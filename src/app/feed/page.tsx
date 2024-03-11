import { fetchQuasarHotDeal } from '@/lib/feed/quasarzone'
import { FeedList } from './FeedList';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';
import { fetchHackerNews } from '@/lib/feed/hn';
import { Suspense } from 'react';
import { fetchGeekNews } from '@/lib/feed/gn';

// TODO: use stream instead of force dynamic
export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const fn_quasar = (x: Awaited<ReturnType<typeof fetchQuasarHotDeal>>[0]) => (
    <Link href={x.url!} className='group border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10 flex flex-row'>
      <div className='w-20'>
        <img src={x.thumbnail!} className='w-20 h-20' />
      </div>
      <div className='flex-1 mx-1.5 mt-1.5 flex flex-col text-sm'>
        <div>
          <span className='mr-1.5 text-half-yellow'>
            [{x.score}]
          </span>
          <span className={classNames({
            'text-half-red': x.status === '인기',
            'text-half-green': x.status === '진행중',
            'text-half-white/75': x.status === '종료',
          })}>
            {x.status}
          </span>
        </div>
        <div>
          {x.title}
        </div>
        <div className='flex flex-row gap-2'>
          <div>
            {x.category}
          </div>
          <div>
            {x.price}
          </div>
        </div>
      </div>
    </Link>
  );

  const fn_hn = (x: Awaited<ReturnType<typeof fetchHackerNews>>[0]) => {
    if (x.type === 'story' || x.type === 'ask') {
      return (
        <Link href={x.url} className='group border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10 flex flex-row'>
          <div className='flex-1 mx-1.5 mt-1.5 text-sm'>
            <span className='mr-1.5 text-half-yellow'>
              [
              <span className='text-half-yellow/50'>
                {
                  x.score.toString().length >= 3
                    ? ''
                    : new Array(3 - x.score.toString().length).fill('0').join('')
                }
              </span>
              {x.score}]
            </span>
            {x.title}
          </div>

          <Link href={`https://news.ycombinator.com/item?id=${x.id}`} className='block h-full px-2 text-half-white/50 hover:text-half-white/70 hover:font-bold'>
            ...
          </Link>
        </Link>
      )
    }
  }

  const fn_gn = (x: Awaited<ReturnType<typeof fetchGeekNews>>[0]) => {
    return (
      <Link href={x.url} className='group border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10 flex flex-row'>
        <div className='flex-1 mx-1.5 mt-1.5 text-sm'>
          <span className='mr-1.5 text-half-yellow'>
            [{x.score}]
          </span>
          {x.title}
        </div>

        <Link href={x.commentUrl} className='block h-full px-2 text-half-white/50 hover:text-half-white/70 hover:font-bold'>
          ...
        </Link>
      </Link>
    )
  }

  return (
    <div>
      Feed

      <div className='flex flex-row gap-x-4'>
        <Suspense fallback={<div>Loading...</div>}>
          <FeedList fetcher={fetchQuasarHotDeal} fn_node={fn_quasar} count={3} className='basis-[28%]' />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <FeedList fetcher={fetchHackerNews} fn_node={fn_hn} count={6} className='basis-[36%]' />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <FeedList fetcher={fetchGeekNews} fn_node={fn_gn} count={3} className='basis-[36%]' />
        </Suspense>
      </div>
    </div>
  )
}