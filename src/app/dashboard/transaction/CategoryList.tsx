import Link from 'next/link';
import { CreateOrEditCategoryForm } from './CreateOrEditCategoryForm';
import { CategoryWrapped } from '@/lib/utils';
import { scanAndAssignCategories } from '@/lib/db/category';
import { revalidateTag } from 'next/cache';
import { CategoryLabel } from './CategoryLabel';
import { TransactionListPageContext } from './TransactionListPageContext';
import { CategoryParams } from '@/lib/params';
import { CategoryItem } from './CategoryItem';

type CategoryListProps = {
  categories: CategoryWrapped[];
  context: TransactionListPageContext;
}

export function CategoryList({
  categories,
  context,
}: CategoryListProps) {
  const applyScanned = async (formData: FormData) => {
    'use server';

    const idRaw = formData.get('id')?.toString();
    if (idRaw === undefined) {
      return;
    }

    const categoryId = parseInt(idRaw);
    if (isNaN(categoryId)) {
      return;
    }

    await scanAndAssignCategories(categoryId);
    revalidateTag('categories');
  };

  return (
    <div className='flex flex-row gap-4'>
      <div className='flex flex-col gap-1 w-80'>
        {
          categories.map(category => (
            <CategoryItem category={category} context={context} />
          ))
        }
      </div>

      <div className='w-80'>
        <CreateOrEditCategoryForm />
      </div>
    </div>
  )
}