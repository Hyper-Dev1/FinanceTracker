import { insertAccount, insertLedger } from "./operation";

export const seedDatabase = () => {
  try {
    // Insert accounts
    insertAccount("Prabhu Bank", "PBL", "0", "Current");
    insertAccount("Nabil Bank", "NABIL", "0", "Salary");
    insertAccount("Agriculture Development Bank", "ADB", "0", "Saving");
    insertAccount(
      "Nepal Investment Mega Bank",
      "NIMB",
      "0",
      "Investment"
    );

    // Insert ledgers
    insertLedger("Groceries");
    insertLedger("Transport");
    insertLedger("Bills");

    // Insert sample transactions
    // insertTransaction(1, 12300, "add", 1, "2025-10-16 09:15:22");
    // insertTransaction(1, 2300, "deduct", 1, "2025-10-16 14:32:10");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
