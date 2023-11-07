import { assignCategories, unassignCategories } from '@/lib/db/category';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as { categoryId: number, transactionId: number };

  const resp = await assignCategories(input.categoryId, input.transactionId, true);

  revalidateTag('categories');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const input = await request.json() as { categoryId: number, transactionId: number };

  const resp = await unassignCategories(input.categoryId, input.transactionId);

  revalidateTag('categories');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  POST,
  DELETE,
};