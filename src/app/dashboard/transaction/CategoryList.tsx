import { CreateOrEditCategoryForm } from './CreateOrEditCategoryForm';
import { CategoryWrapped } from '@/lib/utils';
import { TransactionListPageContext } from './TransactionListPageContext';
import { CategoryItem } from './CategoryItem';

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
            <CategoryItem category={category} context={context} />
          ))
        }
      </div>

      <div className='w-80'>
        <CreateOrEditCategoryForm category={categoryForEdit} />
      </div>
    </div>
  )
}