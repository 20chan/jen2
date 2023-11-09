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

export type TransactionWithCategories = Transaction & {
  categories: CategoriesOnTransactionWithCategory[];
}

export const fetchTransactionsWithCategories = async (options?: FetchOptions) => {
  const transactions: TransactionWithCategories[] = await client.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
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