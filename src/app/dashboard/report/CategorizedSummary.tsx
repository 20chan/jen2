import { Category } from '@prisma/client';
import { CategoryLabel } from '../transaction/CategoryLabel';

interface CategorizedSummaryProps {
  total: number;
  uncategorized: number;
  prefix: '수입' | '지출';
  categories: Array<{
    category: Category;
    amount: number;
  }>;
  tags: Array<{
    category: Category;
    amount: number;
  }>;
}

export function CategorizedSummary({
  total,
  uncategorized,
  prefix,
  categories,
  tags,
}: CategorizedSummaryProps) {
  return (
    <div className='w-48 flex flex-col'>
      <Row left={`총 ${prefix}`} right={
        <span className={prefix === '지출' ? 'text-half-red' : 'text-half-green'}>{total.toLocaleString()}</span>
      } />
      {
        categories.map(({ category, amount }) => (
          <Row
            key={category.id}
            left={<CategoryLabel category={category} />}
            right={amount.toLocaleString()}
          />
        ))
      }
      <Row left='기타' right={uncategorized.toLocaleString()} />
    </div>
  )
}

function Row({ left, right }: { left: React.ReactNode, right: React.ReactNode }) {
  return (
    <div className='flex flex-row'>
      <div className='w-24'>
        {left}
      </div>
      <div className='flex-1'>
        {right}
      </div>
    </div>
  )
}