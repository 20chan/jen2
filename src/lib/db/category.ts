import { unstable_cache } from 'next/cache';
import { client } from '../prisma'
import {
  CategoryRule,
  CategoryWrapped,
  checkRules,
  convertCategoryRulesToRawCategoryRules,
  convertRawCategoryRuleToCategoryRule,
  convertRawCategoryRulesToCategoryRules,
} from '../utils';

export const fetchCategoriesWrapped = async (): Promise<CategoryWrapped[]> => {
  const categories = await client.category.findMany();
  return categories.map(x => ({
    ...x,
    rules: convertRawCategoryRulesToCategoryRules(JSON.parse(x.rulesSerialized)),
  }));
};

export const createCategory = async (category: Omit<CategoryWrapped, 'id' | 'archived'>) => {
  const data = {
    name: category.name,
    color: category.color,
    label: category.label,
    rulesSerialized: JSON.stringify(convertCategoryRulesToRawCategoryRules(category.rules)),
    tag: category.tag,
    archived: false,
  };

  return await client.category.create({
    data,
  });
}

export const updateCategory = async (category: Omit<CategoryWrapped, 'archived'>) => {
  const data = {
    id: category.id,
    name: category.name,
    color: category.color,
    label: category.label,
    tag: category.tag,
    rulesSerialized: JSON.stringify(convertCategoryRulesToRawCategoryRules(category.rules)),
  };

  return await client.category.update({
    where: { id: data.id },
    data,
  });
}

export const archiveCategory = async (category: CategoryWrapped) => {
  // TODO: delete transactions categories that are assigned to this category
  const relations = await client.categoriesOnTransaction.deleteMany({
    where: {
      categoryId: category.id,
    },
  });

  const categoryResp = await client.category.update({
    where: { id: category.id },
    data: {
      archived: true,
    },
  });

  return {
    relations,
    category: categoryResp,
  };
}

export const unarchiveCategory = async (category: CategoryWrapped) => {
  return await client.category.update({
    where: { id: category.id },
    data: {
      archived: false,
    },
  });
}

export const scanAndAssignCategories = async (categoryId: number) => {
  const category = await client.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  const rules: CategoryRule[] = convertRawCategoryRulesToCategoryRules(JSON.parse(category.rulesSerialized));

  const transactionIds: number[] = [];
  const transactions = await client.transaction.findMany();
  for (const transaction of transactions) {
    if (!checkRules(rules, transaction)) {
      continue;
    }

    transactionIds.push(transaction.id);
  }

  return await client.category.update({
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
};