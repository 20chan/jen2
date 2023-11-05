import { client } from '@/lib/prisma';
import { CategoryWrapped, convertCategoryRuleToRawCategoryRule } from '@/lib/utils';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const data: Omit<Category, 'id'> = {
    name: input.name,
    color: input.color,
    label: input.label,
    rulesSerialized: JSON.stringify(input.rules.map(x => convertCategoryRuleToRawCategoryRule(x))),
  };

  const resp = await client.category.create({
    data,
  });

  revalidatePath('/dashboard/transaction');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  POST,
};