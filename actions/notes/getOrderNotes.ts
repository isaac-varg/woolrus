'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const getOrderNotes = async (orderId: string) => {
  const notes = await prisma.note.findMany({
    where: {
      OR: [
        { orderId },
        { orderItem: { orderId } },
        { package: { orderId } },
      ],
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      attachments: true,
      orderItem: {
        select: { id: true, name: true },
      },
      package: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const enriched = await Promise.all(
    notes.map(async (note) => ({
      ...note,
      attachments: await Promise.all(
        note.attachments.map(async (att) => ({
          ...att,
          url: await s3.presignedGetObject(bucket, att.s3Key, 3600),
        }))
      ),
    }))
  )

  return enriched
}

export type NoteWithDetails = Awaited<ReturnType<typeof getOrderNotes>>[number]
