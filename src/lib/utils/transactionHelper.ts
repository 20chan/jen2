import type { Transaction } from '@prisma/client';
import type { TransactionModel } from '../db/transaction';

export function transactionToModel(transaction: Transaction, parent: Transaction | null): TransactionModel {
  return {
    ...transaction,
    parent,
    parentId: parent?.id ?? null,
    children: [],
    categories: [],
  };
}