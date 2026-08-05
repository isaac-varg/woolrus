import { pullProcessingOrders } from "@/actions/sync/pullOrders";

export async function POST(request: Request) {
  // Simple auth check — use a secret token
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await pullProcessingOrders();
  return Response.json(result);
}
