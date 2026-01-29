import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("financeApp.db");

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bankName TEXT NOT NULL,
        anotation TEXT NOT NULL,
        amount TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS ledgers (
        ledgerId INTEGER PRIMARY KEY AUTOINCREMENT,
        ledgerName TEXT NOT NULL
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
        ledgerId INTEGER NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        accountId INTEGER NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (ledgerId) REFERENCES ledgers (ledgerId),
        FOREIGN KEY (accountId) REFERENCES accounts (id)
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const resetDatabase = () => {
  db.execSync(`
    DELETE FROM accounts;
    DELETE FROM transactions;
    DELETE FROM ledgers;
    `);
};

export default db;
