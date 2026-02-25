'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"
import { getUserByEmail } from "@/actions/user/getUserByEmail"
import { fetchRatesForOrder } from "@/actions/shipping/fetchRates"

export const completePacking = async (orderId: string) => {
  const session = await auth()
  const email = session?.user?.email

  const packedById = email ? (await getUserByEmail(email)).id : null

  await prisma.orderWorkflow.upsert({
    where: { orderId },
    create: {
      orderId,
      status: WorkflowStatus.QA,
      packedById,
      packCompletedAt: new Date(),
    },
    update: {
      status: WorkflowStatus.QA,
      packedById,
      packCompletedAt: new Date(),
    },
  })

  await prisma.order.update({
    where: { id: orderId },
    data: { workflowStatus: WorkflowStatus.QA },
  })

  // Fire-and-forget: fetch shipping rates asynchronously
  fetchRatesForOrder(orderId).catch((err) => {
    console.error(`[ShipStation] Failed to fetch rates for order ${orderId}:`, err)
  })

  return getOrder(orderId)
}
