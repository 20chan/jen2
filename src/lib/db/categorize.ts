import { client } from '../prisma';

export const assignCategory = async (options: { transactionId: number, categoryId: number }) => {
  const { categoryId, transactionId } = options;

  return await client.categoriesOnTransaction.create({
    data: {
      transactionId,
      categoryId,
    },
  });
};

export const assignCategories = async (options: { transactionId: number, categoryIds: number[] }) => {
  const { transactionId, categoryIds } = options;

  return await client.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      categories: {
        connect: categoryIds.map(categoryId => ({
          transactionId_categoryId: {
            transactionId,
            categoryId,
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