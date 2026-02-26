-- CreateTable
CREATE TABLE "CarrierService" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domestic" BOOLEAN NOT NULL DEFAULT false,
    "international" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingCarrier" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "carrierCode" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "friendlyName" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingCarrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarrierService_carrierId_serviceCode_key" ON "CarrierService"("carrierId", "serviceCode");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCarrier_carrierId_key" ON "ShippingCarrier"("carrierId");

-- AddForeignKey
ALTER TABLE "CarrierService" ADD CONSTRAINT "CarrierService_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "ShippingCarrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
