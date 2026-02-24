'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"
import { NoteMediaType } from "@/prisma/generated/enums"
import { randomUUID } from "crypto"

const bucket = process.env.S3_NOTES_BUCKET!

export const addNoteAttachment = async (noteId: string, formData: FormData) => {
  const file = formData.get("file") as File | null
  if (!file) {
    throw new Error("No file provided.")
  }

  const fileName = file.name
  const fileSize = file.size
  const s3Key = `notes/${noteId}/${randomUUID()}-${fileName}`

  const mediaType = file.type.startsWith("image/")
    ? NoteMediaType.IMAGE
    : NoteMediaType.VOICE

  const buffer = Buffer.from(await file.arrayBuffer())

  await s3.putObject(bucket, s3Key, buffer, fileSize, {
    'Content-Type': file.type,
  })

  const attachment = await prisma.noteAttachment.create({
    data: {
      noteId,
      s3Key,
      mediaType,
      fileName,
      fileSize,
    },
  })

  return attachment
}

export type CreatedAttachment = Awaited<ReturnType<typeof addNoteAttachment>>
