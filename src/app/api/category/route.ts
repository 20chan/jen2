import { client } from '@/lib/prisma';
import { CategoryWrapped, convertCategoryRuleToRawCategoryRule, convertCategoryRulesToRawCategoryRules } from '@/lib/utils';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const data: Omit<Category, 'id'> = {
    name: input.name,
    color: input.color,
    label: input.label,
    rulesSerialized: JSON.stringify(convertCategoryRulesToRawCategoryRules(input.rules)),
    archived: false,
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

async function PUT(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const data: Omit<Category, 'id'> = {
    name: input.name,
    color: input.color,
    label: input.label,
    rulesSerialized: JSON.stringify(convertCategoryRulesToRawCategoryRules(input.rules)),
    archived: false,
  };

  const resp = await client.category.update({
    where: { id: input.id },
    data,
  });

  revalidatePath('/dashboard/transaction');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const input = await request.json() as CategoryWrapped;

  // TODO: delete transactions categories that are assigned to this category

  const resp = await client.category.update({
    where: { id: input.id },
    data: {
      archived: true,
    },
  });

  revalidatePath('/dashboard/transaction');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  POST,
  PUT,
  DELETE,
};