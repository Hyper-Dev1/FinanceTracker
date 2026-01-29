import { account, category, transaction } from "@/components/type";
import { Timestamp } from "firebase/firestore";

type LocalTransactionFilter = {
  categoryId?: string;
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
};

type AccountMap = Record<string, string>;
type CategoryMap = Record<string, string>;

export function DateNow() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[now.getMonth()];

  return `${month},${day}`;
}

export function formatCurrency(amount: number) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "0.00";

  const formatted = num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formatted}`;
}

export const formatDate = (value: any) => {
  if (!value) return "";

  const date =
    value instanceof Date
      ? value
      : value instanceof Timestamp
        ? value.toDate()
        : typeof value === "string"
          ? new Date(value)
          : typeof value === "object" && "seconds" in value
            ? new Date(value.seconds * 1000)
            : null;

  if (!date) return "";

  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

export default {
  formatCurrency,
  DateNow,
};

export const filterAndParseTransactions = (
  transactions: transaction[],
  accountMap: Record<string, string>,
  categoryMap: Record<string, string>,
  filters?: LocalTransactionFilter,
) => {
  return transactions
    .filter((tx) => {
      // console.log(filters);
      if (filters?.categoryId && tx.category_id !== filters.categoryId) {
        return false;
      }

      if (filters?.accountId && tx.account_id !== filters.accountId) {
        return false;
      }

      if (filters?.startDate && tx.createdAt.toDate() < filters.startDate) {
        return false;
      }

      if (filters?.endDate && tx.createdAt.toDate() > filters.endDate) {
        return false;
      }

      return true;
    })
    .map((tx) => ({
      account_name: tx.account_id
        ? (accountMap[tx.account_id] ?? "Unknown Account")
        : null,

      category_name: tx.category_id
        ? (categoryMap[tx.category_id] ?? "Uncategorized")
        : null,

      ...tx,
    }));
};

export const buildAccountMap = (accounts: account[]): AccountMap =>
  accounts.reduce((acc, a) => {
    acc[a.id] = a.anotation;
    return acc;
  }, {} as AccountMap);

export const buildCategoryMap = (categories: category[]): CategoryMap =>
  categories.reduce((acc, c) => {
    acc[c.id] = c.category_name;
    return acc;
  }, {} as CategoryMap);
