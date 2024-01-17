import React from 'react';

export async function FeedList<TItem>({
  fetcher,
  fn_node,
  count,
}: {
  fetcher: (page: number) => Promise<TItem[]>;
  fn_node: (x: TItem) => React.ReactNode;
  count: number;
}) {
  const items: TItem[] = [];

  let page = 0;
  while (items.length < count) {
    const newItems = await fetcher(page);
    if (newItems.length === 0) {
      break;
    }
    items.push(...newItems);
    page += 1;
  }

  items.splice(count);


  return (
    <div className='flex flex-col'>
      {items.map((item, i) => (
        <div key={i}>
          {fn_node(item)}
        </div>
      ))}
    </div>
  )
}