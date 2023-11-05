import { CategoryWrapped } from '@/lib/utils';
import { Category } from '@prisma/client';

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
    }}>
      {category.label}
    </div>
  )
}