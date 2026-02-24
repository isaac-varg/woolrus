'use server'

import prisma from "@/lib/prisma"

export const getOrderNotes = async (orderId: string) => {
  const notes = await prisma.note.findMany({
    where: {
      OR: [
        { orderId },
        { orderItem: { orderId } },
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
    },
    orderBy: { createdAt: 'desc' },
  })

  return notes
}

export type NoteWithDetails = Awaited<ReturnType<typeof getOrderNotes>>[number]
