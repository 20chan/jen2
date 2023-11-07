import { TransactionTable } from './TransactionTable';
import { fetchTransactionsWithCategories } from '@/lib/db/transaction';
import { fetchCategoriesWrapped } from '@/lib/db/category';
import { NextProps } from '@/lib/NextProps';
import { CategoryParams } from '@/lib/params';
import { PaginationParams } from '@/lib/params/PaginationParams';

export default async function TransactionListPage(props: NextProps) {
  const transactions = await fetchTransactionsWithCategories();
  const categories = await fetchCategoriesWrapped();

  const context = {
    props,
    categoryParams: CategoryParams.parse(props),
    paginationParams: PaginationParams.parse(props),
  };

  return (
    <div>
      <TransactionTable transactions={[...transactions].slice(0, 100)} categories={categories} context={context} />
    </div>
  )
}