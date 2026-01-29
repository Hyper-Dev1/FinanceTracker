import { account, category, transaction } from "@/components/type";
import { auth, db } from "@/config/firebase";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    signOut(auth).then(() => {
      router.replace("/(onboarding)");
    });
  }
});

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

export async function createCategory(category_name: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "categories"), {
    category_name,
    user_id: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCategory(categoryId: string) {
  await deleteDoc(doc(db, "categories", categoryId));
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
  if (!user) throw new Error("Not authenticated");

  let q = query(
    collection(db, "transaction"),
    where("user_id", "==", user.uid),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as transaction[];
};
