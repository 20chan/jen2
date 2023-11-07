import { CreateOrEditCategoryForm } from './CreateOrEditCategoryForm';
import { CategoryWrapped } from '@/lib/utils';
import { TransactionListPageContext } from '../TransactionListPageContext';
import { CategoryItem } from './CategoryItem';
import { CategoryParams } from '@/lib/params';
import Link from 'next/link';

type CategoryListProps = {
  categories: CategoryWrapped[];
  context: TransactionListPageContext;
}

export function CategoryList({
  categories,
  context,
}: CategoryListProps) {
  const categorySorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const categoryForEdit = categories.find(category => category.id === context.categoryParams.edit);

  return (
    <div className='flex flex-row gap-4'>
      <div className='flex flex-col gap-1 w-80'>
        {
          categorySorted.map(category => (
            <CategoryItem key={category.id} category={category} context={context} />
          ))
        }

        <Link href={`/dashboard/transaction?${CategoryParams.merge(context.props.searchParams, {
          edit: null,
          create: context.categoryParams.create ? null : true,
        })}`} className='w-full bg-half-dark-green/50 hover:bg-half-dark-green/70 py-0.5 text-center'>
          +
        </Link>
      </div>

      <div className='w-80'>
        {
          (context.categoryParams.create || context.categoryParams.edit !== null) && (
            <CreateOrEditCategoryForm category={categoryForEdit} />
          )
        }
      </div>
    </div>
  )
}