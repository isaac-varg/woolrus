'use server'

import prisma from "@/lib/prisma"

export const getOrdersWithUnresolvedVoids = async () => {
  const orders = await prisma.order.findMany({
    where: {
      orderVoids: {
        some: { isResolved: false },
      },
    },
    include: {
      orderVoids: {
        where: { isResolved: false },
        include: {
          orderItem: {
            select: { id: true, name: true, sku: true, imageUrl: true },
          },
          resolvedBy: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return orders
}

export type OrderWithVoids = Awaited<ReturnType<typeof getOrdersWithUnresolvedVoids>>[number]
