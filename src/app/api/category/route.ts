import { archiveCategory, createCategory, updateCategory } from '@/lib/db/category';
import { CategoryWrapped } from '@/lib/utils';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const resp = await createCategory(input);

  revalidateCategories();

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function PUT(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const resp = await updateCategory(input);

  revalidateCategories();

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const input = await request.json() as CategoryWrapped;
  const resp = await archiveCategory(input);

  revalidateCategories();

  return Response.json({
    ok: true,
    data: resp,
  });
}

function revalidateCategories() {
  revalidateTag('categories');
}

export {
  POST,
  PUT,
  DELETE,
};