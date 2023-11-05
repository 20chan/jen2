import { assignCategories, unassignCategories } from '@/lib/db/category';
import { client } from '@/lib/prisma';
import { CategoryWrapped, convertCategoryRuleToRawCategoryRule } from '@/lib/utils';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as { categoryId: number, transactionId: number };

  const resp = await assignCategories(input.categoryId, input.transactionId, true);

  revalidatePath('/dashboard/transaction');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const input = await request.json() as { categoryId: number, transactionId: number };

  const resp = await unassignCategories(input.categoryId, input.transactionId);

  revalidatePath('/dashboard/transaction');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  POST,
  DELETE,
};