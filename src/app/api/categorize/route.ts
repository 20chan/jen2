import { assignCategory, unassignCategory } from '@/lib/db/categorize';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const { categoryId, transactionId } = await request.json() as { categoryId: number, transactionId: number };

  const resp = await assignCategory({
    categoryId,
    transactionId,
  });

  revalidateTag('categories');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const { categoryId, transactionId } = await request.json() as { categoryId: number, transactionId: number };

  const resp = await unassignCategory({
    categoryId,
    transactionId,
  });

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