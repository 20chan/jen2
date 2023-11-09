import * as R from 'remeda';
import { client } from '@/lib/prisma';
import { moment } from '@/lib/utils';
import { NextProps } from '@/lib/NextProps';
import { TransactionsReport } from './TransactionsReport';

type MonthlyReportProps = NextProps & {
};

export default async function MonthlyReportPage(props: MonthlyReportProps) {
  const transactions = await client.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  const months = R.pipe(
    transactions,
    R.groupBy(x => moment(x.date).format('YYYY-MM')),
  );

  return (
    <div className='flex flex-col gap-24'>
      {Object.entries(months).map(([month, transactions]) => (
        <div key={month}>
          <TransactionsReport transactions={transactions} />
        </div>
      ))}
    </div>
  )
}