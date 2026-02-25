'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"

export const updateOrderStatus = async (orderId: string, status: WorkflowStatus) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { workflowStatus: status },
  })

  return await getOrder(orderId)
}
