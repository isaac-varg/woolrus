'use server'

import prisma from "@/lib/prisma"
import { QualityIssueType, QualityIssueSeverity, WorkflowStatus } from "@/prisma/generated/enums"

export const updateQualityIssue = async (
  id: string,
  data: {
    type?: QualityIssueType
    severity?: QualityIssueSeverity
    description?: string
    stageOriginated?: WorkflowStatus
    responsibleId?: string | null
    resolutionNotes?: string
    triggeredRepack?: boolean
    linkedLabelId?: string | null
  }
) => {
  const issue = await prisma.qualityIssue.update({
    where: { id },
    data,
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
