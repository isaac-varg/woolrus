'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserByEmail } from "@/actions/user/getUserByEmail"
import { QualityIssueType, QualityIssueSeverity, WorkflowStatus } from "@/prisma/generated/enums"

export const createQualityIssue = async ({
  orderId,
  orderItemId,
  packageId,
  type,
  severity,
  description,
  stageDiscovered,
  stageOriginated,
  isCustomerReported,
}: {
  orderId: string
  orderItemId?: string
  packageId?: string
  type: QualityIssueType
  severity: QualityIssueSeverity
  description?: string
  stageDiscovered: WorkflowStatus
  stageOriginated?: WorkflowStatus
  isCustomerReported?: boolean
}) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  const user = await getUserByEmail(session.user.email)

  // Auto-infer responsible party from workflow + item data based on stage originated
  let responsibleId: string | undefined
  if (stageOriginated) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        workflow: true,
        items: orderItemId ? { where: { id: orderItemId } } : false,
      },
    })

    if (order) {
      switch (stageOriginated) {
        case 'PICKING':
          // If a specific item, use its picker; otherwise fall back to first picker
          if (orderItemId && order.items && Array.isArray(order.items) && order.items[0]?.pickedById) {
            responsibleId = order.items[0].pickedById
          }
          break
        case 'PACKING':
          responsibleId = order.workflow?.packedById ?? undefined
          break
        case 'QA':
          responsibleId = order.workflow?.qaById ?? undefined
          break
      }
    }
  }

  const issue = await prisma.qualityIssue.create({
    data: {
      orderId,
      orderItemId,
      packageId,
      type,
      severity,
      description,
      stageDiscovered,
      stageOriginated,
      isCustomerReported: isCustomerReported ?? false,
      reportedById: user.id,
      responsibleId,
    },
    include: {
      reportedBy: { select: { id: true, name: true, image: true } },
      responsible: { select: { id: true, name: true, image: true } },
      resolvedBy: { select: { id: true, name: true, image: true } },
      orderItem: true,
      package: true,
      notes: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          attachments: true,
        },
        orderBy: { createdAt: 'desc' as const },
      },
    },
  })

  return issue
}

export type CreatedQualityIssue = Awaited<ReturnType<typeof createQualityIssue>>
