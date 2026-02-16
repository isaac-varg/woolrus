'use server'

import prisma from "@/lib/prisma"
import { PickStatus } from "@/prisma/generated/enums"

export const getOrders = async (status?: PickStatus) => {

  const options = {
    include: {
      items: true,
    },
    orderBy: {
      wooCreatedAt: 'asc' as const,
    },
    ...(status && { where: { pickStatus: status } }),
  }

  return await prisma.order.findMany(options);
}

export type OrderWithItems = Awaited<ReturnType<typeof getOrders>>[number]
