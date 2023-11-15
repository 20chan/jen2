import { client } from '../prisma';
import { checkRules } from '../utils';
import { fetchCategoriesWrapped } from './category';

export const assignCategory = async (options: { transactionId: number, categoryId: number, manuallyAssigned?: boolean }) => {
  const { categoryId, transactionId, manuallyAssigned } = options;

  return await client.categoriesOnTransaction.create({
    data: {
      transactionId,
      categoryId,
      manuallyAssigned: manuallyAssigned ?? true,
    },
  });
};

export const assignCategories = async (options: {
  transactionId: number,
  categoryIds: number[],
  manuallyAssigned: boolean,
}) => {
  const { transactionId, categoryIds, manuallyAssigned } = options;

  return await client.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      categories: {
        connectOrCreate: categoryIds.map(categoryId => ({
          create: {
            categoryId,
            manuallyAssigned,
          },
          where: {
            transactionId_categoryId: {
              transactionId,
              categoryId,
            },
          },
        })),
      },
    },
  });
};

export const unassignCategory = async (options: { transactionId: number, categoryId: number }) => {
  const { categoryId, transactionId } = options;

  return await client.categoriesOnTransaction.delete({
    where: {
      transactionId_categoryId: {
        transactionId,
        categoryId,
      },
    },
  });
};

export const unassignCategories = async (options: { transactionId: number, categoryIds: number[] }) => {
  const { transactionId, categoryIds } = options;

  return await client.categoriesOnTransaction.deleteMany({
    where: {
      transactionId,
      categoryId: {
        in: categoryIds,
      },
    },
  });
};

export const assignAllCategories = async (options: { transactionIds: number[] }) => {
  const { transactionIds } = options;

  const transactions = await client.transaction.findMany({
    where: {
      id: {
        in: transactionIds,
      },
    },
  });

  const categories = await fetchCategoriesWrapped();
  const categoryWithRules = categories.filter(x => x.rules.length > 0);

  for (const transaction of transactions) {
    for (const category of categoryWithRules) {
      if (checkRules(category.rules, transaction)) {
        await assignCategory({
          transactionId: transaction.id,
          categoryId: category.id,
          manuallyAssigned: false,
        });
      }
    }
  }
}