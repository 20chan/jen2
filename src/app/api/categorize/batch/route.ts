import { assignCategories, unassignCategories } from '@/lib/db/categorize';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as {
    transactionId: number;
    categoryIdsAdded: number[];
    categoryIdsRemoved: number[];
  };

  const added = await assignCategories({
    transactionId: input.transactionId,
    categoryIds: input.categoryIdsAdded,
    manuallyAssigned: true,
  });

  const removed = await unassignCategories({
    transactionId: input.transactionId,
    categoryIds: input.categoryIdsRemoved,
  });

  revalidateTag('categories');

  return Response.json({
    ok: true,
    data: { added, removed },
  });
}

export {
  POST,
};
