import * as R from 'remeda';
import { CategoryWrapped } from '.';
import type { Category } from '@prisma/client';

export function sortCategories<T extends CategoryWrapped | Category>(categories: T[]): T[] {
  return R.sortBy(
    categories,
    x => x.tag ? 1 : 0,
    x => x.name.toLowerCase(),
  );
}