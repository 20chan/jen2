import { parse } from 'node-html-parser';

const url = 'https://quasarzone.com/bbs/qb_saleinfo?page='

export async function fetchQuasarHotDeal(page: number) {
  const resp = await fetch(`${url}${page}`);
  const html = await resp.text();

  const root = parse(html);

  const items = root.querySelectorAll('.market-type-list tr .market-info-list');

  const result = [];
  for (const item of items) {
    const thumbnail = item.querySelector('img')?.getAttribute('src') ?? null;
    const status = item.querySelector('.tit .label')?.innerHTML ?? null;
    const title = item.querySelector('.tit .ellipsis-with-reply-cnt')?.innerHTML ?? null;
    const url = item.querySelector('.tit a')?.getAttribute('href') ?? null;
    const category = item.querySelector('.market-info-sub .category')?.innerHTML ?? null;
    const price = item.querySelector('.market-info-sub .text-orange')?.innerHTML ?? null;

    result.push({
      thumbnail,
      status,
      title,
      url,
      category,
      price,
    });
  }

  return result;
}