'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

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

  return getOrder(orderId)
}
