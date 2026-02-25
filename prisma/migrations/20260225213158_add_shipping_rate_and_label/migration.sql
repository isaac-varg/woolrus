-- CreateTable
CREATE TABLE "ShippingLabel" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "shipmentId" TEXT,
    "trackingNumber" TEXT,
    "carrierCode" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "shippingCost" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "labelFormat" TEXT NOT NULL DEFAULT 'pdf',
    "labelDownloadPdf" TEXT,
    "labelDownloadPng" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "voidedAt" TIMESTAMP(3),
    "shipDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "rateId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "carrierCode" TEXT NOT NULL,
    "carrierName" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "shippingAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "deliveryDays" INTEGER,
    "estimatedDeliveryDate" TIMESTAMP(3),
    "guaranteedService" BOOLEAN NOT NULL DEFAULT false,
    "trackable" BOOLEAN NOT NULL DEFAULT false,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingLabel_packageId_key" ON "ShippingLabel"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingLabel_labelId_key" ON "ShippingLabel"("labelId");

-- CreateIndex
CREATE INDEX "ShippingLabel_orderId_idx" ON "ShippingLabel"("orderId");

-- CreateIndex
CREATE INDEX "ShippingRate_orderId_idx" ON "ShippingRate"("orderId");

-- CreateIndex
CREATE INDEX "ShippingRate_packageId_idx" ON "ShippingRate"("packageId");

-- AddForeignKey
ALTER TABLE "ShippingLabel" ADD CONSTRAINT "ShippingLabel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingLabel" ADD CONSTRAINT "ShippingLabel_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRate" ADD CONSTRAINT "ShippingRate_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRate" ADD CONSTRAINT "ShippingRate_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
