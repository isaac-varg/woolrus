'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const deleteNote = async (noteId: string) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { attachments: true },
  })

  if (!note) {
    throw new Error("Note not found.")
  }

  for (const attachment of note.attachments) {
    await s3.removeObject(bucket, attachment.s3Key)
  }

  await prisma.note.delete({
    where: { id: noteId },
  })
}
