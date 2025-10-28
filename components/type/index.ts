export type account = {
  id: number;
  bankName: string;
  anotation: string;
  amount: number;
  type: string;
};

export type ledger = {
  ledgerId: string;
  ledgerName: string;
};

export type transaction = {
  transactionId: number;
  ledgerId: string;
  amount: number;
  type: string;
  accountId: number;
  date: string;
};
