-- AlterTable
ALTER TABLE "OrderWorkflow" ADD COLUMN     "qaById" TEXT;

-- AddForeignKey
ALTER TABLE "OrderWorkflow" ADD CONSTRAINT "OrderWorkflow_qaById_fkey" FOREIGN KEY ("qaById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
