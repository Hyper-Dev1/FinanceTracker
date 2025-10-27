import db from "./db";

// Account Operations
export const insertAccount = (
  bankName: string,
  anotation: string,
  amount: string,
  type: string
) => {
  return db.runSync(
    "INSERT INTO accounts (bankName, anotation, amount, type) VALUES (?, ?, ?, ?)",
    [bankName, anotation, amount, type]
  );
};

export const getAllAccounts = () => {
  return db.getAllSync("SELECT * FROM accounts");
};

export const updateAccount = (id: number, amount: string) => {
  return db.runSync("UPDATE accounts SET amount = ? WHERE id = ?", [
    amount,
    id,
  ]);
};

export const deleteAccount = (id: number) => {
  return db.runSync("DELETE FROM accounts WHERE id = ?", [id]);
};

// Ledger Operations
export const insertLedger = (ledgerName: string) => {
  return db.runSync("INSERT INTO ledgers (ledgerName) VALUES (?)", [
    ledgerName,
  ]);
};

export const getAllLedgers = () => {
  return db.getAllSync("SELECT * FROM ledgers");
};

export const deleteLedger = (ledgerId: number) => {
  return db.runSync("DELETE FROM ledgers WHERE ledgerId = ?", [ledgerId]);
};

// Transaction Operations
export const insertTransaction = (
  ledgerId: number,
  amount: number,
  type: string,
  accountId: number,
  date: string
) => {
  return db.runSync(
    "INSERT INTO transactions (ledgerId, amount, type, accountId, date) VALUES (?, ?, ?, ?, ?)",
    [ledgerId, amount, type, accountId, date]
  );
};

export const getAllTransactions = () => {
  return db.getAllSync("SELECT * FROM transactions ORDER BY date DESC");
};

export const getTransactionsByLedger = (ledgerId: number) => {
  return db.getAllSync(
    "SELECT * FROM transactions WHERE ledgerId = ? ORDER BY date DESC",
    [ledgerId]
  );
};

export const getTransactionsByAccount = (accountId: number) => {
  return db.getAllSync(
    "SELECT * FROM transactions WHERE accountId = ? ORDER BY date DESC",
    [accountId]
  );
};

export const getTransactionsByDateRange = (
  startDate: string,
  endDate: string
) => {
  return db.getAllSync(
    "SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC",
    [startDate, endDate]
  );
};

export const deleteTransaction = (transactionId: number) => {
  return db.runSync("DELETE FROM transactions WHERE transactionId = ?", [
    transactionId,
  ]);
};

// Advanced queries
export const getAccountBalance = (accountId: number) => {
  const result = db.getFirstSync(
    `SELECT 
      SUM(CASE WHEN type = 'add' THEN amount ELSE -amount END) as balance
     FROM transactions 
     WHERE accountId = ?`,
    [accountId]
  ) as { balance: number } | null;

  return result?.balance || 0;
};

export const getLedgerTotal = (ledgerId: number) => {
  const result = db.getFirstSync(
    `SELECT 
      SUM(CASE WHEN type = 'add' THEN amount ELSE -amount END) as total
     FROM transactions 
     WHERE ledgerId = ?`,
    [ledgerId]
  ) as { total: number } | null;

  return result?.total || 0;
};
