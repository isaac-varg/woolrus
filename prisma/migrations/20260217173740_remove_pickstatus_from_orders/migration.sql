/*
  Warnings:

  - You are about to drop the column `pickStatus` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pickStatus",
ADD COLUMN     "workflowStatus" "WorkflowStatus" NOT NULL DEFAULT 'PENDING';
