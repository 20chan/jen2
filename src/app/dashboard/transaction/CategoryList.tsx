import Link from 'next/link';
import { CreateCategoryForm } from './CreateCategoryForm';
import { CategoryWrapped } from '@/lib/utils';
import { scanAndAssignCategories } from '@/lib/db/category';
import { revalidatePath } from 'next/cache';
import { CategoryLabel } from './CategoryLabel';

interface CategoryListProps {
  categories: CategoryWrapped[];
  scanFor?: string;
}

export function CategoryList({
  categories,
  scanFor,
}: CategoryListProps) {
  const applyScanned = async (formData: FormData) => {
    'use server';

    const categoryName = formData.get('categoryName')?.toString() ?? '';
    await scanAndAssignCategories(categoryName);
    revalidatePath('/dashboard/transaction');
  };

  return (
    <div className='flex flex-col gap-2'>
      {
        categories.map(x => (
          <div key={x.name}>
            <div>
              <div className='inline-block w-52'>
                {x.name}
              </div>
              <span className='text-sm'>
                <CategoryLabel category={x} />
              </span>
            </div>

            <div>
              {
                x.rules.map((rule, i) => (
                  <div key={`${x.name}:rule:${i}`} className='ml-2 flex flex-row text-sm'>
                    <div className='mr-1'>
                      OR
                    </div>

                    <div>
                      {
                        rule.pairs.map((pair, j) => (
                          <div key={`${x.name}:rule:${i}:pair:${j}`} className='ml-2 flex flex-row'>
                            <div className='mr-1'>
                              AND
                            </div>
                            <div>
                              {pair.key} =~ <span className='bg-half-dark-white/10 px-1'>{pair.value}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>

            {
              scanFor === x.name ? (
                <form action={applyScanned}>
                  <input name='categoryName' type='hidden' value={x.name} />
                  <input type='submit' className='block w-full text-center bg-half-dark-red/60 text-sm uppercase cursor-pointer' value='apply' />
                </form>
              ) : (
                <Link href={`/dashboard/transaction?scanfor=${x.name}`} className='block w-full text-center bg-half-dark-yellow/60 text-sm uppercase'>
                  test
                </Link>
              )
            }
          </div>
        ))
      }

      <div className='mt-10'>
        <CreateCategoryForm />
      </div>
    </div>
  )
}