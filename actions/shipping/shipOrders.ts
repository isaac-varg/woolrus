'use server'

import prisma from '@/lib/prisma'
import { woo } from '@/lib/woocommerce'
import { addWooOrderNote } from '@/lib/woocommerce-rest'
import { UPDATE_ORDER_STATUS } from '@/queries/orders'
import { WorkflowStatus } from '@/prisma/generated/enums'

type OrderResult = {
  orderId: string
  orderNumber: string
  success: boolean
  error?: string
}

export type ShipOrdersResult = {
  results: OrderResult[]
  labelUrls: string[]
}

export async function shipOrders(orderIds: string[]): Promise<ShipOrdersResult> {
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: {
      workflow: true,
      shippingLabels: true,
      notes: {
        include: {
          author: { select: { name: true } },
        },
      },
    },
  })

  // Also get item-level and package-level notes
  const allNotes = await prisma.note.findMany({
    where: {
      OR: [
        { orderId: { in: orderIds } },
        { orderItem: { orderId: { in: orderIds } } },
        { package: { orderId: { in: orderIds } } },
      ],
    },
    include: {
      author: { select: { name: true } },
      orderItem: { select: { name: true } },
      package: { select: { id: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Group notes by orderId
  const notesByOrder = new Map<string, typeof allNotes>()
  for (const note of allNotes) {
    const oid = note.orderId ?? note.orderItem?.name ?? note.package?.id
    // We need the actual orderId — use a lookup
    let resolvedOrderId: string | null = note.orderId
    if (!resolvedOrderId && note.orderItemId) {
      const item = await prisma.orderItem.findUnique({
        where: { id: note.orderItemId },
        select: { orderId: true },
      })
      resolvedOrderId = item?.orderId ?? null
    }
    if (!resolvedOrderId && note.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: note.packageId },
        select: { orderId: true },
      })
      resolvedOrderId = pkg?.orderId ?? null
    }
    if (resolvedOrderId) {
      const existing = notesByOrder.get(resolvedOrderId) ?? []
      existing.push(note)
      notesByOrder.set(resolvedOrderId, existing)
    }
  }

  const results: OrderResult[] = []
  const labelUrls: string[] = []

  for (const order of orders) {
    // Collect label URLs
    for (const label of order.shippingLabels) {
      if (label.labelDownloadPdf && label.status === 'active') {
        labelUrls.push(label.labelDownloadPdf)
      }
    }

    try {
      // 1. Update local status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { workflowStatus: WorkflowStatus.COMPLETED },
        }),
        prisma.orderWorkflow.update({
          where: { orderId: order.id },
          data: {
            status: WorkflowStatus.COMPLETED,
            completedAt: new Date(),
          },
        }),
      ])

      // 2. Push status + tracking to WooCommerce
      const trackingNumber = order.workflow?.trackingNumber ?? ''
      try {
        await woo.request(UPDATE_ORDER_STATUS, {
          input: {
            orderId: order.wooId,
            status: 'COMPLETED',
            metaData: [
              { key: '_tracking_number', value: trackingNumber },
              { key: '_tracking_provider', value: 'ShipStation' },
            ],
          },
        })

        // 3. Push notes to WooCommerce
        const orderNotes = notesByOrder.get(order.id) ?? []
        for (const note of orderNotes) {
          if (!note.content) continue
          const prefix = note.author?.name ? `[${note.author.name}] ` : ''
          await addWooOrderNote(order.wooId, `${prefix}${note.content}`, false)
        }

        // 4. Record success
        await prisma.orderWorkflow.update({
          where: { orderId: order.id },
          data: { wooPushedAt: new Date(), wooPushError: null },
        })
      } catch (wooError) {
        // WooCommerce push failed — local status is still COMPLETED
        const errorMsg = wooError instanceof Error ? wooError.message : String(wooError)
        await prisma.orderWorkflow.update({
          where: { orderId: order.id },
          data: { wooPushError: errorMsg },
        })
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: false,
          error: `WooCommerce push failed: ${errorMsg}`,
        })
        continue
      }

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

  return { results, labelUrls }
}
