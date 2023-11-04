import { loadFromDirectory } from '@/lib/load_transaction';

export async function POST(request: Request) {
  const input = await request.json() as {
    path: string;
  };

  const resp = await loadFromDirectory(input.path);
  return Response.json(resp);
}