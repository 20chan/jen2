import * as R from 'remeda';
import { TransactionsReportCalendar } from './TransactionsReportCalendar';
import { CategoryWrapped, moment } from '@/lib/utils';
import { TransactionWithCategories } from '@/lib/db/transaction';
import { CategoryLabel } from '../transaction/CategoryLabel';

export function TransactionsReport({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategories[];
  categories: CategoryWrapped[];
}) {
  const incomings = transactions.filter(x => x.amount > 0);
  const outgoings = transactions.filter(x => x.amount < 0);

  const totalIncoming = R.sumBy(incomings, x => x.amount);
  const totalOutgoing = R.sumBy(outgoings, x => x.amount);

  const month = moment(transactions[0].date).format('YYYY-MM');

  const groupByCategory = (xs: TransactionWithCategories[]) => R.pipe(
    xs,
    R.flatMap(x => x.categories.map(y => ({
      category: y.category,
      amount: x.amount,
    }))),
    R.groupBy(x => x.category.id),
    R.mapValues(x => ({
      category: x[0].category,
      amount: R.sumBy(x, y => y.amount)
    })),
  );

  const incomingsWithCategories = Object.entries(groupByCategory(incomings)).sort((a, b) => {
    return b[1].amount - a[1].amount;
  });
  const outgoingsWithCategories = Object.entries(groupByCategory(outgoings)).sort((a, b) => {
    return a[1].amount - b[1].amount;
  });

  const incomingUncategorized = R.pipe(
    incomings,
    R.filter(x => x.categories.length === 0),
    R.sumBy(x => x.amount),
  );

  const outgoingUncategorized = R.pipe(
    outgoings,
    R.filter(x => x.categories.length === 0),
    R.sumBy(x => x.amount),
  );

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
        <div className='flex flex-row'>
          <div className='w-48'>
            <div>
              총 지출: <span className='text-half-red'>{totalOutgoing.toLocaleString()}</span>
            </div>
            {
              outgoingsWithCategories.map(([categoryId, { category, amount }]) => (
                <div key={categoryId}>
                  <CategoryLabel category={category} /> {amount.toLocaleString()}
                </div>
              ))
            }

            <div>
              기타 지출: {outgoingUncategorized.toLocaleString()}
            </div>
          </div>

          <div className='w-48'>
            <div>
              총 수입: <span className='text-half-blue'>{totalIncoming.toLocaleString()}</span>
            </div>
            {
              incomingsWithCategories.map(([categoryId, { category, amount }]) => (
                <div key={categoryId}>
                  <CategoryLabel category={category} /> {amount.toLocaleString()}
                </div>
              ))
            }
            <div>
              기타 수입: {incomingUncategorized.toLocaleString()}
            </div>
          </div>
        </div>

        <div>
        </div>
      </div>
    </div>
  )
}