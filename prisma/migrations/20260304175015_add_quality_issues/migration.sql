-- CreateEnum
CREATE TYPE "QualityIssueSeverity" AS ENUM ('MINOR', 'MAJOR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "QualityIssueType" AS ENUM ('WRONG_ITEM', 'DAMAGED_ITEM', 'MISSING_ITEM', 'WRONG_QUANTITY', 'PACKAGING_DAMAGE', 'LABELING_ERROR', 'WRONG_BOX_SIZE');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "qualityIssueId" TEXT;

-- CreateTable
CREATE TABLE "QualityIssue" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "packageId" TEXT,
    "type" "QualityIssueType" NOT NULL,
    "severity" "QualityIssueSeverity" NOT NULL,
    "description" TEXT,
    "stageDiscovered" "WorkflowStatus" NOT NULL,
    "stageOriginated" "WorkflowStatus",
    "isCustomerReported" BOOLEAN NOT NULL DEFAULT false,
    "reportedById" TEXT NOT NULL,
    "responsibleId" TEXT,
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "triggeredRepack" BOOLEAN NOT NULL DEFAULT false,
    "linkedLabelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QualityIssue_orderId_idx" ON "QualityIssue"("orderId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_qualityIssueId_fkey" FOREIGN KEY ("qualityIssueId") REFERENCES "QualityIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_linkedLabelId_fkey" FOREIGN KEY ("linkedLabelId") REFERENCES "ShippingLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
