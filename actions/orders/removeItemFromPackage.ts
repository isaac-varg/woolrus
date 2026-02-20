'use server'

import prisma from "@/lib/prisma"

const itemInclude = {
  pickedBy: { select: { id: true, name: true, image: true } }
} as const

export const removeItemFromPackage = async (itemId: string) => {
  const source = await prisma.orderItem.findUniqueOrThrow({ where: { id: itemId } })

  // Find unassigned sibling (same product/variation, no package)
  const sibling = await prisma.orderItem.findFirst({
    where: {
      orderId: source.orderId,
      wooProductId: source.wooProductId,
      wooVariationId: source.wooVariationId,
      packageId: null,
      id: { not: source.id },
    }
  })

  await prisma.$transaction(async (tx) => {
    if (source.quantity === 1) {
      if (sibling) {
        // Merge into existing unassigned sibling, delete source
        await tx.orderItem.update({ where: { id: sibling.id }, data: { quantity: sibling.quantity + 1 } })
        await tx.orderItem.delete({ where: { id: source.id } })
      } else {
        // Simple unassign
        await tx.orderItem.update({ where: { id: source.id }, data: { packageId: null } })
      }
    } else {
      // Decrement source quantity
      await tx.orderItem.update({ where: { id: source.id }, data: { quantity: source.quantity - 1 } })

      if (sibling) {
        // Increment existing unassigned sibling
        await tx.orderItem.update({ where: { id: sibling.id }, data: { quantity: sibling.quantity + 1 } })
      } else {
        // Create new unassigned item row with qty 1
        await tx.orderItem.create({
          data: {
            orderId: source.orderId,
            productId: source.productId,
            variationId: source.variationId,
            wooProductId: source.wooProductId,
            wooVariationId: source.wooVariationId,
            name: source.name,
            sku: source.sku,
            quantity: 1,
            price: source.price,
            imageUrl: source.imageUrl,
            attributes: source.attributes ?? undefined,
            pickStatus: source.pickStatus,
            pickedAt: source.pickedAt,
            pickedById: source.pickedById,
            isPacked: source.isPacked,
            packageId: null,
          }
        })
      }
    }
  })

  // Return fresh items for the order so the store can sync
  return await prisma.orderItem.findMany({
    where: { orderId: source.orderId },
    include: itemInclude,
  })
}
