import * as R from 'remeda';
import { Category } from '@prisma/client';
import { CategoryLabel } from '../transaction/CategoryLabel';
import Link from 'next/link';
import { ReportParams } from '@/lib/params/ReportParams';

interface CategorizedSummaryProps {
  month: string;
  total: number;
  uncategorized: number;
  prefix: '수입' | '지출';
  categories: Array<{
    category: Category;
    amount: number;
  }>;
  tags?: Array<{
    category: Category;
    amount: number;
  }>;
  max?: number;
}

export function CategorizedSummary({
  month,
  total,
  uncategorized,
  prefix,
  categories,
  tags,
  max
}: CategorizedSummaryProps) {
  const leftOvers = categories.slice(max ?? categories.length - 1);
  const leftOversSum = R.sumBy(leftOvers, x => x.amount);

  return (
    <div>
      <div className='mb-2 border-b border-b-half-dark-white/70'>
        <Row left={`총 ${prefix}`} right={
          <span className={prefix === '지출' ? 'text-half-red' : 'text-half-green'}>{total.toLocaleString()}</span>
        } />
      </div>
      <div className='flex flex-row'>
        <div className='w-48 flex flex-col'>
          {
            categories.slice(0, max ?? categories.length - 1).map(({ category, amount }) => (
              <Row
                key={category.id}
                left={<CategoryLink month={month} category={category} />}
                right={amount.toLocaleString()}
              />
            ))
          }
          {
            Math.abs(leftOversSum) > 0 && (
              <Row left='기타' right={leftOversSum.toLocaleString()} />
            )
          }
          {
            Math.abs(uncategorized) > 0 && (
              <Row left={<span className='text-sm'>UNCATEGORIZED</span>} right={uncategorized.toLocaleString()} />
            )
          }
        </div>
        {
          tags && (
            <div className='w-48 flex flex-col'>
              {
                tags.map(({ category, amount }) => (
                  <Row
                    key={category.id}
                    left={<CategoryLink month={month} category={category} />}
                    right={amount.toLocaleString()}
                  />
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

function CategoryLink({ month, category }: { month: string; category: Category }) {
  return (
    <Link
      href={`/ledger/report?${ReportParams.merge({ where: month, categoryId: category.id })}`}
      className='cursor-pointer'
    >
      <CategoryLabel category={category} />
    </Link>
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