import { scanAndAssignCategories } from '@/lib/db/category';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as { categoryId: number };

  const resp = await scanAndAssignCategories(input.categoryId);

  revalidateTag('categories');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  POST,
};
