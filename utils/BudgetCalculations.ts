import { budget, transaction } from "@/components/type";

export interface BudgetStatus {
  budget: budget;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  status: "under" | "near" | "over"; // under: <80%, near: 80-100%, over: >100%
}

/**
 * Calculate budget status for a given budget and set of transactions
 * @param budget The budget to calculate status for
 * @param transactions All transactions for the current month
 * @returns BudgetStatus object with spent amount, remaining, percentage, and status
 */
export function calculateBudgetStatus(
  budget: budget,
  transactions: transaction[]
): BudgetStatus {
  // Filter transactions for this budget's category
  const categoryTransactions = transactions.filter(
    (t) => t.category_id === budget.category_id && t.is_deduct === true
  );

  // Sum up the spent amount
  const spentAmount = categoryTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const remainingAmount = budget.allocated_amount - spentAmount;
  const percentageUsed =
    budget.allocated_amount > 0
      ? (spentAmount / budget.allocated_amount) * 100
      : 0;

  // Determine status based on percentage
  let status: "under" | "near" | "over";
  if (percentageUsed < 80) {
    status = "under";
  } else if (percentageUsed <= 100) {
    status = "near";
  } else {
    status = "over";
  }

  return {
    budget,
    spentAmount,
    remainingAmount,
    percentageUsed,
    status,
  };
}

/**
 * Get the current month in YYYY-MM format
 * @returns String in format "YYYY-MM"
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Format month string for display
 * @param monthStr Month string in "YYYY-MM" format
 * @returns Formatted string like "January 2026"
 */
export function formatMonthDisplay(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Filter transactions for a specific month
 * @param transactions All transactions
 * @param month Month string in "YYYY-MM" format
 * @returns Filtered transactions for the specified month
 */
export function filterTransactionsByMonth(
  transactions: transaction[],
  month: string
): transaction[] {
  const [year, monthNum] = month.split("-").map(Number);

  return transactions.filter((t) => {
    if (!t.createdAt) return false;

    const date = t.createdAt.toDate();
    const txYear = date.getFullYear();
    const txMonth = date.getMonth() + 1;

    return txYear === year && txMonth === monthNum;
  });
}

/**
 * Get color based on budget status
 * @param status Budget status (under, near, over)
 * @returns Color hex string
 */
export function getBudgetStatusColor(status: "under" | "near" | "over"): string {
  switch (status) {
    case "under":
      return "#34C759"; // Green
    case "near":
      return "#FF9500"; // Orange/Yellow
    case "over":
      return "#FF3B30"; // Red
  }
}
