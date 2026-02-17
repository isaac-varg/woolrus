'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/prisma/generated/enums"

export const getOrders = async (status?: WorkflowStatus) => {

  const options = {
    include: {
      items: true,
    },
    orderBy: {
      wooCreatedAt: 'asc' as const,
    },
    ...(status && { where: { workflowStatus: status } }),
  }

  return await prisma.order.findMany(options);
}

export type OrderWithItems = Awaited<ReturnType<typeof getOrders>>[number]
