import { CategoriesOnTransaction, Category, Transaction } from '@prisma/client';
import { client } from '../prisma';
import { unstable_cache } from 'next/cache';
import { FetchOptions } from './options';

export type CategoriesOnTransactionWithCategory = {
  categoryId: number;
  category: Category;
  assignedAt: Date;
  manuallyAssigned: boolean;
}

export type TransactionModel = Transaction & {
  parent: Transaction | null;
  children: Transaction[];
  categories: CategoriesOnTransactionWithCategory[];
}

export const fetchTransactionModels = async (options?: FetchOptions) => {
  const transactions: TransactionModel[] = await client.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      children: true,
      parent: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    skip: options?.skip,
    take: options?.take,
  });

  return transactions;
};

export const updateTransaction = async (transaction: Transaction) => {
  return await client.transaction.update({
    where: {
      id: transaction.id,
    },
    data: {
      amount: transaction.amount,
      memo: transaction.memo,
    },
  });
};

export const createSubTransaction = async (transaction: Transaction) => {
  return await client.transaction.create({
    data: {
      date: transaction.date,
      amount: 0,
      balance: -1,
      kind: 'sub',
      content: '',
      memo: '',
      parent: {
        connect: {
          id: transaction.id,
        },
      },
    },
  });
};

export const deleteSubTransaction = async (transaction: Transaction) => {
  return await client.transaction.delete({
    where: {
      id: transaction.id,
    },
  });
}