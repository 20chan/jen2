import { CategoryList } from './CategoryList';
import { fetchCategoriesWrapped } from '@/lib/db/category';
import { NextProps } from '@/lib/NextProps';
import { CategoryParams } from '@/lib/params';
import { PaginationParams } from '@/lib/params/PaginationParams';

export default async function TransactionListPage(props: NextProps) {
  const categories = await fetchCategoriesWrapped();

  const context = {
    props,
    categoryParams: CategoryParams.parse(props),
    paginationParams: PaginationParams.parse(props),
  };

  return (
    <div className='ml-4 border-l border-l-half-dark-white/50 px-4'>
      <CategoryList categories={categories} context={context} />
    </div>
  )
}