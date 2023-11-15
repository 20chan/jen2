import { assignAllCategories } from '@/lib/db/categorize';
import { loadFromDirectory } from '@/lib/load_transaction';

export async function POST(request: Request) {
  const input = await request.json() as {
    path: string;
  };

  const resp = await loadFromDirectory(input.path);
  await assignAllCategories({ transactionIds: resp.creates });

  return Response.json(resp);
}