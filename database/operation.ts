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
  console.log(ledgerId)
  return db.runSync("DELETE FROM ledgers WHERE ledgerId = ?", [ledgerId]);
};

export const insertTransaction = ({
  ledgerId,
  amount,
  type,
  accountId,
  date,
}: {
  ledgerId: string;
  amount: number;
  type: string;
  accountId: string;
  date: string;
}) => {
  return db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO transactions 
        (ledgerId, amount, type, accountId, date) 
        VALUES (?, ?, ?, ?, ?)`,
      [ledgerId, amount, type, accountId, date]
    );
    if (type === "deduct"){
      db.runSync(
        `UPDATE accounts 
          SET amount = amount - ? 
          WHERE id = ?`,
        [amount, accountId]
      );
    } else{
      db.runSync(
        `UPDATE accounts 
          SET amount = amount + ? 
          WHERE id = ?`,
        [amount, accountId]
      );
    }
  });
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

export const getAllAccountBalance = () => {
  const result = db.getFirstSync(`select sum(a.amount) as balance from accounts a`) as {
    balance: number;
  } | null;

  return result?.balance || 0;
};

export const getAllDetailedTransaction = () => {
  return db.getAllSync(
    `select t."transactionId", l."ledgerName", a."anotation", a.type as accountType, t.date, t.amount, t.type from transactions t left join accounts a on a.id = t."accountId" left join ledgers l on l."ledgerId" = t."ledgerId" order by t.date desc limit 10 `
  );
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