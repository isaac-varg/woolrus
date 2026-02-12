import "dotenv/config";
import { pullProcessingOrders } from "@/actions/pullOrders";

async function main() {
  console.log('Starting order sync...');
  const result = await pullProcessingOrders();
  console.log('Done:', result);
}

main().catch(console.error).finally(() => process.exit());
