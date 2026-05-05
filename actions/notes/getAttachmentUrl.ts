'use server'

import { presignedGetObject } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const getAttachmentUrl = async (s3Key: string) => {
  const url = await presignedGetObject(bucket, s3Key, 3600)
  return url
}
