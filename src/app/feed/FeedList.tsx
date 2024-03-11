import React, { Suspense } from 'react';

export async function FeedList<TItem>({
  fetcher,
  fn_node,
  count,
}: {
  fetcher: (page: number) => Promise<TItem[]>;
  fn_node: (x: TItem) => React.ReactNode;
  count: number;
}) {
  return (
    <div className='flex flex-col'>
      {
        new Array(count).fill(0).map((_, i) => (
          <Suspense key={i} fallback={<div>loading page...</div>}>
            <FeedPage
              fetcher={fetcher}
              fn_node={fn_node}
              page={i}
            />
          </Suspense>
        ))
      }
    </div>
  )
}

async function FeedPage<TItem>({
  fetcher,
  fn_node,
  page,
}: {
  fetcher: (page: number) => Promise<TItem[]>;
  fn_node: (x: TItem) => React.ReactNode;
  page: number;
}) {
  const items = await fetcher(page);

  return (
    <>
      {items.map((item, i) => (
        <div key={i}>
          {fn_node(item)}
        </div>
      ))}
    </>
  )
}