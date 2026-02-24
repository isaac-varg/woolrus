'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const deleteNoteAttachment = async (attachmentId: string) => {
  const attachment = await prisma.noteAttachment.findUnique({
    where: { id: attachmentId },
  })

  if (!attachment) {
    throw new Error("Attachment not found.")
  }

  await s3.removeObject(bucket, attachment.s3Key)

  await prisma.noteAttachment.delete({
    where: { id: attachmentId },
  })
}
