import * as R from 'remeda';
import { Transaction } from '@prisma/client';
import { TransactionsReportCalendar } from './TransactionsReportCalendar';
import { moment } from '@/lib/utils';

export function TransactionsReport({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const incomings = transactions.filter(x => x.amount > 0);
  const outgoings = transactions.filter(x => x.amount < 0);

  const totalIncoming = R.sumBy(incomings, x => x.amount);
  const totalOutgoing = R.sumBy(outgoings, x => x.amount);

  const month = moment(transactions[0].date).format('YYYY-MM');

  return (
    <div className='flex flex-row'>
      <div>
        <TransactionsReportCalendar transactions={transactions} />
      </div>
      <div className='ml-2'>
        <div className='h-10'>
          <h2 className='text-3xl'>
            {month}
          </h2>
        </div>
        <div>
          총 지출: <span className='text-half-red'>{totalOutgoing.toLocaleString()}</span>
        </div>
        <div>
          총 수입: <span className='text-half-blue'>{totalIncoming.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}