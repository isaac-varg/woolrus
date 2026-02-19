'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/prisma/generated/enums"

export const updateOrderStatus = async (orderId: string, status: WorkflowStatus) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { workflowStatus: status },
    include: {
      items: {
        include: {
          pickedBy: {
            select: { id: true, name: true, image: true }
          }
        }
      },
      workflow: {
        include: {
          packedBy: {
            select: { id: true, name: true, image: true }
          }
        }
      },
      packages: {
        include: { box: true },
        orderBy: { createdAt: 'asc' },
      }
    },
  })
}
