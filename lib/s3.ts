import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const port = process.env.S3_PORT ? parseInt(process.env.S3_PORT) : 9000
const endpoint = `http://${process.env.S3_END_POINT || ""}:${port}`

export const s3 = new S3Client({
  endpoint,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true,
})

export const presignedGetObject = (
  bucket: string,
  key: string,
  expiresIn = 3600,
) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn },
  )

export const putObject = (
  bucket: string,
  key: string,
  body: Buffer,
  contentType?: string,
) =>
  s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

export const removeObject = (bucket: string, key: string) =>
  s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
