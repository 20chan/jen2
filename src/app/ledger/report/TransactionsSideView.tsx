import { TransactionModel } from '@/lib/db/transaction';
import { CategoryWrapped, moment } from '@/lib/utils';
import { ReportParams } from '@/lib/params/ReportParams';
import { TransactionTable } from '../transaction/@transaction/TransactionTable';
import { client } from '@/lib/prisma';

async function filterData(transactions: TransactionModel[], params: ReportParams): Promise<TransactionModel[]> {
  const {
    where,
    day,
    categoryId,
  } = params;

  if (where === null) {
    return [];
  }

  if (day !== null) {
    const date = `${where}-${day.toString().padStart(2, '0')}`;
    return transactions.filter(x => moment(x.date).format('YYYY-MM-DD') === date);
  }

  if (categoryId !== null) {
    return transactions
      .filter(x => moment(x.date).format('YYYY-MM') === where)
      .filter(x => x.categories.some(y => y.category.id === categoryId));
  }

  return [];
}

export async function TransactionSideView({
  transactions,
  categories,
  reportParams,
}: {
  transactions: TransactionModel[];
  categories: CategoryWrapped[];
  reportParams: ReportParams;
}) {
  const filtered = await filterData(transactions, reportParams);

  return (
    <TransactionTable
      transactions={filtered}
      categories={categories}
      context={null}
      simple
      readonly
    />
  )
}