'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const getQualityIssues = async (orderId: string) => {
  const issues = await prisma.qualityIssue.findMany({
    where: { orderId },
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
    orderBy: { createdAt: 'desc' },
  })

  return Promise.all(issues.map(async (issue) => ({
    ...issue,
    notes: await Promise.all(issue.notes.map(async (note) => ({
      ...note,
      attachments: await Promise.all(
        note.attachments.map(async (att) => ({
          ...att,
          url: await s3.presignedGetObject(bucket, att.s3Key, 3600),
        }))
      ),
    }))),
  })))
}

export type QualityIssueWithRelations = Awaited<ReturnType<typeof getQualityIssues>>[number]
