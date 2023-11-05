import { client } from '../prisma'
import { CategoryRule, CategoryWrapped, checkRules, convertRawCategoryRuleToCategoryRule } from '../utils';

export const fetchCategoriesWrapped = async (): Promise<CategoryWrapped[]> => {
  const categories = await client.category.findMany();

  return categories.map(x => ({
    ...x,
    rules: JSON.parse(x.rulesSerialized).map(convertRawCategoryRuleToCategoryRule),
  }));
}

export const scanAndAssignCategories = async (categoryName: string) => {
  const category = await client.category.findUniqueOrThrow({
    where: {
      name: categoryName,
    },
  });

  const rules: CategoryRule[] = JSON.parse(category.rulesSerialized).map(convertRawCategoryRuleToCategoryRule);

  const transactionIds: number[] = [];
  const transactions = await client.transaction.findMany();
  for (const transaction of transactions) {
    if (!checkRules(rules, transaction)) {
      continue;
    }

    transactionIds.push(transaction.id);
  }

  await client.category.update({
    where: {
      id: category.id,
    },
    data: {
      Transaction: {
        connectOrCreate: transactionIds.map(transactionId => ({
          create: {
            manuallyAssigned: false,
            transactionId,
          },
          where: {
            transactionId_categoryId: {
              transactionId,
              categoryId: category.id,
            },
          },
        })),
      }
    }
  });
}