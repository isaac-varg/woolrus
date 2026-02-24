import "dotenv/config";
import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Resetting all data except boxes...\n");

  const deletions = await prisma.$transaction([
    prisma.noteAttachment.deleteMany(),
    prisma.note.deleteMany(),
    prisma.package.deleteMany(),
    prisma.orderWorkflow.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.productVariation.deleteMany(),
    prisma.product.deleteMany(),
    prisma.syncLog.deleteMany(),
  ]);

  const labels = [
    "NoteAttachment",
    "Note",
    "Package",
    "OrderWorkflow",
    "OrderItem",
    "Order",
    "ProductVariation",
    "Product",
    "SyncLog",
  ];

  for (let i = 0; i < labels.length; i++) {
    console.log(`  ${labels[i]}: ${deletions[i].count} deleted`);
  }

  console.log("\nDone. Boxes and auth tables were preserved.");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
