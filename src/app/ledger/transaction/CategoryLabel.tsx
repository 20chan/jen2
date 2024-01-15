import { CategoryWrapped } from '@/lib/utils';
import { Category } from '@prisma/client';
import classNames from 'classnames';

export function CategoryLabel({
  category,
}: {
  category: Category | CategoryWrapped;
}) {
  return (
    <div style={{
      display: 'inline-block',
      backgroundColor: `${category.color}55`,
      paddingLeft: '0.125rem',
      paddingRight: '0.125rem',
      borderRadius: category.tag ? '0.5rem' : undefined,
      height: '1.25rem',
    }}>
      <div className='flex flex-col h-full justify-center items-center'>

        <div className={classNames(category.tag ? 'text-xs' : 'text-sm')}>
          {category.label}
        </div>
      </div>
    </div>
  )
}