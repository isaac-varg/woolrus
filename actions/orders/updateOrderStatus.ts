'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/prisma/generated/enums"

export const updateOrderStatus = async (orderId: string, status: WorkflowStatus) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { workflowStatus: status },
    include: { items: true },
  })
}
