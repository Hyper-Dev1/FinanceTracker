import { Timestamp } from "firebase/firestore";

export interface ForecastResult {
  currentBalance: number;
  dailyBurnRate: number; // How much balance changes per day (negative = losing money)
  predictedZeroDate: Date | null; // When balance hits 0 (if trend continues)
  daysUntilZero: number | null;
  forecastBalance30Days: number; // Balance prediction in 30 days
  trend: "increasing" | "decreasing" | "stable";
  confidence: "high" | "medium" | "low"; // Based on data points available
}

interface DataPoint {
  date: Date;
  balance: number;
}

/**
 * Calculate linear regression forecast based on transaction history
 * Uses least squares method to fit a line through balance data points
 */
export function calculateBalanceForecast(
  transactions: Array<{
    amount: number;
    is_deduct: boolean;
    createdAt: Timestamp;
  }>,
  currentBalance: number,
): ForecastResult {
  // Need at least 3 data points for meaningful forecast
  if (transactions.length < 3) {
    return {
      currentBalance,
      dailyBurnRate: 0,
      predictedZeroDate: null,
      daysUntilZero: null,
      forecastBalance30Days: currentBalance,
      trend: "stable",
      confidence: "low",
    };
  }

  // Sort transactions by date
  const sortedTxns = [...transactions].sort(
    (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis(),
  );

  // Build balance history by walking through transactions
  const dataPoints: DataPoint[] = [];
  let runningBalance = currentBalance;

  // Walk backwards from current balance
  for (let i = sortedTxns.length - 1; i >= 0; i--) {
    const txn = sortedTxns[i];
    dataPoints.unshift({
      date: txn.createdAt.toDate(),
      balance: runningBalance,
    });

    // Reverse the transaction to get previous balance
    if (txn.is_deduct) {
      runningBalance += txn.amount;
    } else {
      runningBalance -= txn.amount;
    }
  }

  // Add current balance as the latest point
  dataPoints.push({
    date: new Date(),
    balance: currentBalance,
  });

  // Perform linear regression: y = mx + b
  // where y = balance, x = days since first transaction
  const firstDate = dataPoints[0].date.getTime();
  const points = dataPoints.map((dp) => ({
    x: (dp.date.getTime() - firstDate) / (1000 * 60 * 60 * 24), // Days since start
    y: dp.balance,
  }));

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

  // Calculate slope (m) and intercept (b)
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  const dailyBurnRate = m;

  // Determine trend
  let trend: "increasing" | "decreasing" | "stable";
  if (Math.abs(m) < 5)
    trend = "stable"; // Less than Rs 5/day change = stable
  else if (m > 0) trend = "increasing";
  else trend = "decreasing";

  // Predict when balance hits zero (if decreasing)
  let predictedZeroDate: Date | null = null;
  let daysUntilZero: number | null = null;

  if (m < 0 && currentBalance > 0) {
    // Solve for x when y = 0: 0 = mx + b
    const currentDays =
      (new Date().getTime() - firstDate) / (1000 * 60 * 60 * 24);
    // Current balance = m * currentDays + b
    // We need to find when: 0 = m * futureDay + b
    const daysToZero = -b / m - currentDays;

    if (daysToZero > 0) {
      daysUntilZero = Math.round(daysToZero);
      predictedZeroDate = new Date();
      predictedZeroDate.setDate(predictedZeroDate.getDate() + daysUntilZero);
    }
  }

  // Forecast 30 days ahead
  const currentDays =
    (new Date().getTime() - firstDate) / (1000 * 60 * 60 * 24);
  const forecastBalance30Days = m * (currentDays + 30) + b;

  // Determine confidence based on data quality
  let confidence: "high" | "medium" | "low";
  if (n >= 30) confidence = "high";
  else if (n >= 10) confidence = "medium";
  else confidence = "low";

  return {
    currentBalance,
    dailyBurnRate,
    predictedZeroDate,
    daysUntilZero,
    forecastBalance30Days: Math.max(0, forecastBalance30Days),
    trend,
    confidence,
  };
}

/**
 * Format forecast message for display
 */
export function formatForecastMessage(forecast: ForecastResult): string {
  if (forecast.confidence === "low") {
    return "Not enough data for accurate forecast. Add more transactions.";
  }

  if (forecast.trend === "stable") {
    return "Your balance is relatively stable. Keep it up!";
  }

  if (forecast.trend === "increasing") {
    const gain = Math.abs(forecast.dailyBurnRate).toFixed(0);
    return `Great! You're saving about Rs ${gain}/day on average.`;
  }

  // Decreasing trend
  const loss = Math.abs(forecast.dailyBurnRate).toFixed(0);
  if (forecast.daysUntilZero !== null && forecast.daysUntilZero < 90) {
    return `Warning: At this rate (Rs ${loss}/day), your balance may hit zero in ${forecast.daysUntilZero} days.`;
  }

  return `You're spending about Rs ${loss}/day on average.`;
}
