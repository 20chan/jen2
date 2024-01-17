import * as  R from 'remeda';

type HackerNewsItemBase = {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
}

export type HackerNewsStory = HackerNewsItemBase & {
  descendants: number;
  kids: number[];
  type: 'story';
  url: string;
}

export type HackerNewsAsk = HackerNewsItemBase & {
  descendants: number;
  kids: number[];
  score: number;
  text: string;
  title: string;
  type: 'ask';
  url: string;
}

export type HackerNewsJob = HackerNewsItemBase & {
  text: string;
  type: 'job';
  url: string;
}

export type HackerNewsPoll = HackerNewsItemBase & {
  kids: number;
  parts: number;
  text: string;
  type: 'poll';
}

export type HackerNewsItem = (
  | HackerNewsStory
  | HackerNewsAsk
  | HackerNewsJob
  | HackerNewsPoll
)

const PAGE_COUNT = 500;

export async function fetchHackerNews(page: number) {
  const resp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
  const ids = await resp.json() as number[];

  const ids_page = ids.slice(page * PAGE_COUNT, (page + 1) * PAGE_COUNT);

  const chunks = R.chunk(ids_page, 10);
  const results: HackerNewsItem[] = [];

  for (const chunk of chunks) {
    const promises = chunk.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
    const responses = await Promise.all(promises);
    const items = await Promise.all(responses.map(resp => resp.json()));

    const items0 = items.map(x => {
      if (x.type === 'story' && x.url === undefined) {
        return {
          ...x,
          url: `https://news.ycombinator.com/item?id=${x.id}`,
          type: 'ask',
        };
      }
      return x;
    })
    results.push(...items0);
  }

  return results;
}