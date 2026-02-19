-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "isPacked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderWorkflow" ADD COLUMN     "packedById" TEXT;

-- AddForeignKey
ALTER TABLE "OrderWorkflow" ADD CONSTRAINT "OrderWorkflow_packedById_fkey" FOREIGN KEY ("packedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
