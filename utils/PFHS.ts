export type PFHSCategoryInput = {
  name: string;
  budget: number;
  actual: number;
};

export type PFHSMetrics = {
  SR_norm: number;
  BAS: number;
  CSE: number;
};

export type PFHSStatus =
  | "Financially Healthy"
  | "Stable"
  | "Vulnerable"
  | "Financial Risk";

export type PFHSResult = {
  pfhs: number;
  status: PFHSStatus;
  metrics: PFHSMetrics;
  insights: string[];
  hasBudgetData: boolean;
};

export type PFHSInput = {
  income: number;
  categories: PFHSCategoryInput[];
};

const clamp01 = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

function getStatus(score: number): PFHSStatus {
  if (score >= 80) return "Financially Healthy";
  if (score >= 60) return "Stable";
  if (score >= 40) return "Vulnerable";
  return "Financial Risk";
}

const isFiniteNumber = (value: number): boolean =>
  typeof value === "number" && Number.isFinite(value);

function validatePFHSInput(income: number, categories: PFHSCategoryInput[]) {
  if (!isFiniteNumber(income) || income < 0) {
    throw new Error("Invalid PFHS input: income must be a non-negative number");
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error("Invalid PFHS input: categories are required");
  }

  categories.forEach((category) => {
    if (!isFiniteNumber(category.budget) || !isFiniteNumber(category.actual)) {
      throw new Error("Invalid PFHS input: category values must be finite numbers");
    }
    if (category.budget < 0 || category.actual < 0) {
      throw new Error("Invalid PFHS input: negative values are not allowed");
    }
  });
}

function getCategoryTerm(actual: number, budget: number): number {
  if (budget === 0) {
    return actual === 0 ? 1 : 0;
  }

  const error = Math.abs(actual - budget) / budget;
  return 1 - clamp01(error);
}

export function calculatePFHS({
  income,
  categories,
}: PFHSInput): PFHSResult {
  validatePFHSInput(income, categories);

  const totalExpenses = categories.reduce((sum, c) => sum + c.actual, 0);
  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const categoryTerms = categories.map((c) => getCategoryTerm(c.actual, c.budget));

  const savings = income - totalExpenses;
  const srRaw = income > 0 ? savings / income : 0;
  const SR_norm = income > 0 ? clamp01(clamp01(srRaw) / 0.2) : 0;

  const BAS =
    totalBudget > 0
      ? clamp01(1 - Math.abs(totalExpenses - totalBudget) / totalBudget)
      : 0;

  const CSE =
    categoryTerms.length > 0
      ? clamp01(
          categoryTerms.reduce((sum, term) => sum + term, 0) / categoryTerms.length,
        )
      : 0;

  const pfhsRaw = 100 * (0.4 * SR_norm + 0.3 * BAS + 0.3 * CSE);
  const pfhs = income <= 0 ? 0 : Math.round(Math.max(0, Math.min(100, pfhsRaw)));

  const insights: string[] = [];

  if (income <= 0) {
    insights.push("No income recorded for this month");
  } else {
    if (SR_norm < 0.5) {
      insights.push("Savings rate is critically below the 20% target");
    } else if (SR_norm < 1) {
      insights.push("Savings rate is below the 20% target");
    }

    if (BAS < 0.8) {
      insights.push("Total spending deviates significantly from your monthly budget");
    }

    if (CSE < 0.7) {
      insights.push("Category spending efficiency is low across this month");
    }

    const unbudgetedCategories = categories
      .filter((c) => c.budget === 0 && c.actual > 0)
      .map((c) => c.name);
    if (unbudgetedCategories.length > 0) {
      insights.push(`Spending detected without budget in: ${unbudgetedCategories.join(", ")}`);
    }

    categories.forEach((c) => {
      if (c.budget > 0 && c.actual > c.budget * 1.2) {
        insights.push(`Overspending in ${c.name} category`);
      }
    });
  }

  if (insights.length === 0) {
    insights.push("Your monthly finances are well aligned with your plans");
  }

  return {
    pfhs,
    status: getStatus(pfhs),
    metrics: {
      SR_norm,
      BAS,
      CSE,
    },
    insights,
    hasBudgetData: categories.some((c) => c.budget > 0),
  };
}
