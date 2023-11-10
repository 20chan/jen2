import * as R from 'remeda';
import { TransactionsReportCalendar } from './TransactionsReportCalendar';
import { CategoryWrapped, moment } from '@/lib/utils';
import { TransactionWithCategories } from '@/lib/db/transaction';
import { CategoryLabel } from '../transaction/CategoryLabel';
import { CategorizedSummary } from './CategorizedSummary';

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

  const groupByCategory = (xs: TransactionWithCategories[]) => {
    const record = R.pipe(
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

    const entries = Object.values(record);
    const sorted = R.sortBy(
      entries,
      ({ category, amount }) => amount,
    );

    return {
      categories: sorted.filter(x => !x.category.tag),
      tags: sorted.filter(x => x.category.tag),
    };
  };

  const { categories: incomingCategories, tags: incomingTags } = groupByCategory(incomings);
  const { categories: outgoingCategories, tags: outgoingTags } = groupByCategory(outgoings);

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
      <div className='ml-4'>
        <div className='h-10'>
          <h2 className='text-3xl'>
            {month}
          </h2>
        </div>
        <div className='flex flex-row'>
          <div className='w-48'>
            <CategorizedSummary
              total={totalOutgoing}
              uncategorized={outgoingUncategorized}
              prefix='지출'
              categories={outgoingCategories}
              tags={outgoingTags}
            />
          </div>

          <div className='w-48'>
            <CategorizedSummary
              total={totalIncoming}
              uncategorized={incomingUncategorized}
              prefix='수입'
              categories={incomingCategories}
              tags={incomingTags}
            />
          </div>
        </div>

        <div>
        </div>
      </div>
    </div>
  )
}