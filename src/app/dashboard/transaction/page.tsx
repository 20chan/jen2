import * as R from 'remeda';
import { client } from '@/lib/prisma';
import { TransactionTable } from './TransactionTable';
import { moment } from '@/lib/utils';

export default async function TransactionListPage() {
  const transactions = await client.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <TransactionTable transactions={transactions} />
  )
}