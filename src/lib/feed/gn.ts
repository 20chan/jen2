import { parse } from 'node-html-parser';

const url = 'https://news.hada.io/?page='

export async function fetchGeekNews(page: number) {
  const resp = await fetch(`${url}${page + 1}`);

  const html = await resp.text();
  const root = parse(html);

  const items = root.querySelectorAll('.topic_row');

  const result = [];
  for (const item of items) {
    const score = parseInt(item.querySelector('.topicinfo span')?.innerText ?? '-1');
    const title = item.querySelector('.topictitle a h1')?.innerHTML ?? null;
    const url = item.querySelector('.topictitle a')?.getAttribute('href') ?? '';
    const description = item.querySelector('.topicdesc a')?.innerText ?? null;
    const commentUrl = 'https://news.hada.io/' + item.querySelector('.topicinfo .u')?.getAttribute('href') ?? '';

    result.push({
      score,
      title,
      url,
      description,
      commentUrl,
    });
  }

  return result;
}