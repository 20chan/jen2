import { CategoriesOnTransaction, Category, Transaction } from '@prisma/client';
import { client } from '../prisma';
import { unstable_cache } from 'next/cache';

export type CategoriesOnTransactionWithCategory = {
  categoryId: number;
  category: Category;
  assignedAt: Date;
  manuallyAssigned: boolean;
}

export type TransactionWithCategories = Transaction & {
  categories: CategoriesOnTransactionWithCategory[];
}

export const fetchTransactionsWithCategories = unstable_cache(async () => {
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
  });

  return transactions;
}, undefined, {
  tags: ['transactions', 'categories'],
});