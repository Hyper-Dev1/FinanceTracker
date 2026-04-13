import { account, budget, category, transaction } from "@/components/type";
import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

interface TransactionFilter {
  category?: string;
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const getCurrentUser = (): Promise<any | null> => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();

      if (!user) {
        resolve(null);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      resolve(snap.exists() ? snap.data() : null);
    });
  });
};

export const getAllCategory = async (): Promise<category[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const q = query(
    collection(db, "categories"),
    where("user_id", "==", user.uid),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as category[];
};

export async function createCategory(category_name: string, is_deduct: boolean = true) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "categories"), {
    category_name,
    is_deduct,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCategory(categoryId: string) {
  await deleteDoc(doc(db, "categories", categoryId));
}

export async function updateCategory({
  id,
  category_name,
  is_deduct,
}: {
  id: string;
  category_name: string;
  is_deduct: boolean;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const categoryRef = doc(db, "categories", id);
  await updateDoc(categoryRef, {
    category_name,
    is_deduct,
  });
}

export const getAllAccounts = async (): Promise<account[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(collection(db, "account"), where("user_id", "==", user.uid));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as account[];
};

export async function createAccounts({
  account_name,
  anotation,
  opening_balance,
  account_type,
}: {
  account_name: string;
  anotation: string;
  opening_balance: number;
  account_type: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "account"), {
    account_name,
    anotation,
    opening_balance,
    running_balance: opening_balance,
    snapshot_balance: opening_balance,
    account_type,
    snapshot_date: serverTimestamp(),
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function deleteAccounts(id: string) {
  await deleteDoc(doc(db, "account", id));
}

export async function createTransaction({
  is_deduct,
  category_id,
  account_id,
  amount,
}: {
  is_deduct: boolean;
  category_id: string;
  account_id: string;
  amount: number;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "transaction"), {
    is_deduct,
    category_id,
    account_id,
    amount,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });
  try {
    const accountRef = doc(db, "account", account_id);

    await updateDoc(accountRef, {
      running_balance: increment(is_deduct ? -amount : amount),
    });
  } catch {
    console.log("Error Updating Accounts");
  }
}

export const getAllTransaction = async (
  filters?: TransactionFilter,
): Promise<transaction[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  let q = query(
    collection(db, "transaction"),
    where("user_id", "==", user.uid),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as transaction[];
};

export async function updateTransaction({
  id,
  is_deduct,
  category_id,
  account_id,
  amount,
  oldTransaction,
}: {
  id: string;
  is_deduct: boolean;
  category_id: string;
  account_id: string;
  amount: number;
  oldTransaction: transaction;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  // Reverse old transaction impact
  if (oldTransaction.account_id) {
    try {
      const oldAccountRef = doc(db, "account", oldTransaction.account_id);
      await updateDoc(oldAccountRef, {
        running_balance: increment(
          oldTransaction.is_deduct ? oldTransaction.amount : -oldTransaction.amount
        ),
      });
    } catch (error) {
      console.error("Error reversing old account balance:", error);
      throw new Error("Failed to reverse old transaction");
    }
  }

  // Apply new transaction impact
  try {
    const newAccountRef = doc(db, "account", account_id);
    await updateDoc(newAccountRef, {
      running_balance: increment(is_deduct ? -amount : amount),
    });
  } catch (error) {
    console.error("Error applying new account balance:", error);
    // Try to restore old balance
    if (oldTransaction.account_id) {
      const oldAccountRef = doc(db, "account", oldTransaction.account_id);
      await updateDoc(oldAccountRef, {
        running_balance: increment(
          oldTransaction.is_deduct ? -oldTransaction.amount : oldTransaction.amount
        ),
      });
    }
    throw new Error("Failed to update account balance");
  }

  // Update transaction document
  const transactionRef = doc(db, "transaction", id);
  await updateDoc(transactionRef, {
    is_deduct,
    category_id,
    account_id,
    amount,
  });
}

export async function deleteTransaction(transactionToDelete: transaction) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  // Reverse the transaction impact on account balance
  if (transactionToDelete.account_id) {
    try {
      const accountRef = doc(db, "account", transactionToDelete.account_id);
      await updateDoc(accountRef, {
        running_balance: increment(
          transactionToDelete.is_deduct
            ? transactionToDelete.amount
            : -transactionToDelete.amount
        ),
      });
    } catch (error) {
      console.error("Error reversing account balance:", error);
      throw new Error("Failed to reverse account balance");
    }
  }

  // Delete the transaction document
  await deleteDoc(doc(db, "transaction", transactionToDelete.id));
}

export async function transferBetweenAccounts({
  sourceAccountId,
  destinationAccountId,
  amount,
}: {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  if (sourceAccountId === destinationAccountId) {
    throw new Error("Cannot transfer to the same account");
  }

  if (amount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }

  // Get or create "Transfer" category
  const categories = await getAllCategory();
  let transferCategory = categories.find((c) => c.category_name === "Transfer");

  if (!transferCategory) {
    await addDoc(collection(db, "categories"), {
      category_name: "Transfer",
      is_deduct: true,
      user_id: user.uid,
      createdAt: serverTimestamp(),
    });
    const updatedCategories = await getAllCategory();
    transferCategory = updatedCategories.find(
      (c) => c.category_name === "Transfer"
    );
  }

  if (!transferCategory) {
    throw new Error("Failed to create Transfer category");
  }

  // Verify source account has sufficient balance
  const sourceAccountDoc = await getDoc(doc(db, "account", sourceAccountId));
  if (!sourceAccountDoc.exists()) {
    throw new Error("Source account not found");
  }

  const sourceAccount = sourceAccountDoc.data() as account;
  if (sourceAccount.running_balance < amount) {
    throw new Error("Insufficient balance in source account");
  }

  // Create deduct transaction from source account
  await addDoc(collection(db, "transaction"), {
    is_deduct: true,
    category_id: transferCategory.id,
    account_id: sourceAccountId,
    amount,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });

  // Create add transaction to destination account
  await addDoc(collection(db, "transaction"), {
    is_deduct: false,
    category_id: transferCategory.id,
    account_id: destinationAccountId,
    amount,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });

  // Update source account balance
  const sourceAccountRef = doc(db, "account", sourceAccountId);
  await updateDoc(sourceAccountRef, {
    running_balance: increment(-amount),
  });

  // Update destination account balance
  const destinationAccountRef = doc(db, "account", destinationAccountId);
  await updateDoc(destinationAccountRef, {
    running_balance: increment(amount),
  });
}

// Budget Operations
export async function createBudget({
  category_id,
  allocated_amount,
  month,
}: {
  category_id: string;
  allocated_amount: number;
  month: string; // Format: "YYYY-MM"
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "budget"), {
    category_id,
    allocated_amount,
    month,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function getBudgetsForMonth(month: string): Promise<budget[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "budget"),
    where("user_id", "==", user.uid),
    where("month", "==", month)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as budget[];
}

export async function updateBudget(id: string, allocated_amount: number) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const budgetRef = doc(db, "budget", id);
  await updateDoc(budgetRef, {
    allocated_amount,
  });
}

export async function deleteBudget(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await deleteDoc(doc(db, "budget", id));
}
