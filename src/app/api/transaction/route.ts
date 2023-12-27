import { createSubTransaction, deleteSubTransaction, updateTransaction } from '@/lib/db/transaction';
import { Transaction } from '@prisma/client';
import { revalidateTag } from 'next/cache';

async function POST(request: Request) {
  const input = await request.json() as Transaction;

  const resp = await createSubTransaction(input);

  revalidateTag('transactions');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function PUT(request: Request) {
  const input = await request.json() as Transaction;

  const resp = await updateTransaction(input);

  revalidateTag('transactions');

  return Response.json({
    ok: true,
    data: resp,
  });
}

async function DELETE(request: Request) {
  const input = await request.json() as Transaction;

  const resp = await deleteSubTransaction(input);

  revalidateTag('transactions');

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