-- CreateEnum
CREATE TYPE "PickStatus" AS ENUM ('PENDING', 'PICKED', 'OUT_OF_STOCK', 'SUBSTITUTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PICKER', 'PACKER', 'QA');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PENDING', 'PICKING', 'PACKING', 'QA', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "wooId" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "wooStatus" TEXT NOT NULL DEFAULT 'processing',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB,
    "orderNotes" TEXT,
    "paymentMethod" TEXT,
    "orderTotal" DOUBLE PRECISION NOT NULL,
    "wooCreatedAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER,
    "variationId" INTEGER,
    "wooProductId" INTEGER NOT NULL,
    "wooVariationId" INTEGER,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "attributes" JSONB,
    "pickStatus" "PickStatus" NOT NULL DEFAULT 'PENDING',
    "pickedAt" TIMESTAMP(3),
    "pickedById" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderWorkflow" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'PENDING',
    "assignedToId" TEXT,
    "pickStartedAt" TIMESTAMP(3),
    "pickCompletedAt" TIMESTAMP(3),
    "packStartedAt" TIMESTAMP(3),
    "packCompletedAt" TIMESTAMP(3),
    "qaStartedAt" TIMESTAMP(3),
    "qaCompletedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "wooPushedAt" TIMESTAMP(3),
    "wooPushError" TEXT,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "wooId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "imageUrl" TEXT,
    "weight" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "stockQuantity" INTEGER,
    "productType" TEXT NOT NULL DEFAULT 'simple',
    "binLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "id" SERIAL NOT NULL,
    "wooId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "stockQuantity" INTEGER,
    "attributes" JSONB NOT NULL,
    "binLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" SERIAL NOT NULL,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_wooId_key" ON "Order"("wooId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderWorkflow_orderId_key" ON "OrderWorkflow"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_wooId_key" ON "Product"("wooId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariation_wooId_key" ON "ProductVariation"("wooId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "ProductVariation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_pickedById_fkey" FOREIGN KEY ("pickedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderWorkflow" ADD CONSTRAINT "OrderWorkflow_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderWorkflow" ADD CONSTRAINT "OrderWorkflow_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
