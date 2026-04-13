import { Timestamp } from "firebase/firestore";

export type account = {
  id: string;
  account_name: string;
  anotation: string;
  opening_balance: number;
  running_balance: number;
  snapshot_balance: number;
  snapshot_date: string;
  account_type: string;
  user_id: string;
};

export type category = {
  id: string;
  category_name: string;
  is_deduct: boolean; // true = expense category, false = income category
  user_id: string;
};

export type transaction = {
  id: string;
  category_id: string;
  category_name?: string;
  amount: number;
  account_id: string;
  account_name?: string;
  createdAt: Timestamp;
  is_deduct: boolean;
};

export type User = {
  email: string;
  name: string;
  uid: string;
};

export type budget = {
  id: string;
  category_id: string;
  category_name?: string; // Enriched field
  allocated_amount: number;
  month: string; // Format: "YYYY-MM"
  user_id: string;
  createdAt: Timestamp;
};
