import { client } from '../prisma';

export const assignCategory = async (options: { transactionId: number, categoryId: number }) => {
  const { categoryId, transactionId } = options;

  return await client.categoriesOnTransaction.create({
    data: {
      transactionId,
      categoryId,
      manuallyAssigned: true,
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