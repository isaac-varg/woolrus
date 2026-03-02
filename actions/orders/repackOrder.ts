'use server'

import prisma from '@/lib/prisma'
import { shipstation } from '@/lib/shipstation'
import { WorkflowStatus } from '@/prisma/generated/enums'

type OrderResult = {
  orderId: string
  orderNumber: string
  success: boolean
  error?: string
}

export type RepackOrdersResult = {
  results: OrderResult[]
}

export async function repackOrders(orderIds: string[]): Promise<RepackOrdersResult> {
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: {
      packages: {
        include: {
          shippingLabel: true,
        },
      },
    },
  })

  const results: OrderResult[] = []

  for (const order of orders) {
    try {
      // Void active labels via ShipStation
      for (const pkg of order.packages) {
        if (pkg.shippingLabel && pkg.shippingLabel.status === 'active') {
          await shipstation.voidLabel(pkg.shippingLabel.labelId)
        }
      }

      // Reset everything in a single transaction
      await prisma.$transaction([
        prisma.shippingLabel.deleteMany({
          where: { orderId: order.id },
        }),
        prisma.shippingRate.deleteMany({
          where: { orderId: order.id },
        }),
        prisma.orderItem.updateMany({
          where: { orderId: order.id },
          data: { packageId: null, isPacked: false, isQAVerified: false },
        }),
        prisma.package.deleteMany({
          where: { orderId: order.id },
        }),
        prisma.orderWorkflow.update({
          where: { orderId: order.id },
          data: {
            status: WorkflowStatus.PACKING,
            packCompletedAt: null,
            qaCompletedAt: null,
            qaById: null,
            trackingNumber: null,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { workflowStatus: WorkflowStatus.PACKING },
        }),
      ])

      results.push({
        orderId: order.id,
        orderNumber: order.orderNumber,
        success: true,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      results.push({
        orderId: order.id,
        orderNumber: order.orderNumber,
        success: false,
        error: errorMsg,
      })
    }
  }

  return { results }
}
