import { client } from '@/lib/prisma';
import { TransactionTable } from './TransactionTable';

export async function TransactionList() {
  const transactions = await client.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 100,
  });

  return (
    <TransactionTable transactions={transactions} />
  )
}