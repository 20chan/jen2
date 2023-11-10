import { updateTransaction } from '@/lib/db/transaction';
import { Transaction } from '@prisma/client';
import { revalidateTag } from 'next/cache';

async function PUT(request: Request) {
  const input = await request.json() as Transaction;

  const resp = await updateTransaction(input);

  revalidateTag('transactions');

  return Response.json({
    ok: true,
    data: resp,
  });
}

export {
  PUT,
};