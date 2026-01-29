import { account } from "@/components/type";
import { auth, db } from "@/config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const subscribeToAccounts = (
  onUpdate: (accounts: account[]) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    const error = new Error("Not authenticated");
    onError?.(error);
    throw error;
  }

  const q = query(collection(db, "account"), where("user_id", "==", user.uid));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const accounts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as account[];
      onUpdate(accounts);
    },
    (error) => {
      console.error("Error in account subscription:", error);
      onError?.(error);
    },
  );

  return unsubscribe;
};
