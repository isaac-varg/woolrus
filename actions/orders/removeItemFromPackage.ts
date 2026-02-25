'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

const itemInclude = {
  pickedBy: { select: { id: true, name: true, image: true } },
  notes: {
    include: {
      author: { select: { id: true, name: true, image: true } },
      attachments: true,
    },
    orderBy: { createdAt: 'desc' as const },
  },
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
  const items = await prisma.orderItem.findMany({
    where: { orderId: source.orderId },
    include: itemInclude,
  })

  return Promise.all(items.map(async (item) => ({
    ...item,
    notes: await Promise.all(item.notes.map(async (note) => ({
      ...note,
      attachments: await Promise.all(
        note.attachments.map(async (att) => ({
          ...att,
          url: await s3.presignedGetObject(bucket, att.s3Key, 3600),
        }))
      ),
    }))),
  })))
}
