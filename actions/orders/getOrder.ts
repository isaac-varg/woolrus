'use server'

import prisma from "@/lib/prisma"
import { s3 } from "@/lib/s3"

const bucket = process.env.S3_NOTES_BUCKET!

export const getOrder = async (orderId: string) => {

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          pickedBy: {
            select: { id: true, name: true, image: true }
          },
          notes: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              attachments: true,
            },
            orderBy: { createdAt: 'desc' },
          }
        }
      },
      workflow: {
        include: {
          packedBy: {
            select: { id: true, name: true, image: true }
          },
          qaBy: {
            select: { id: true, name: true, image: true }
          }
        }
      },
      packages: {
        include: {
          box: true,
          notes: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              attachments: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          shippingRates: { orderBy: { shippingAmount: 'asc' } },
          shippingLabel: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      notes: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          attachments: true,
        },
        orderBy: { createdAt: 'desc' },
      }
    }
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const enrichAttachments = async (notes: typeof order.notes) =>
    Promise.all(notes.map(async (note) => ({
      ...note,
      attachments: await Promise.all(
        note.attachments.map(async (att) => ({
          ...att,
          url: await s3.presignedGetObject(bucket, att.s3Key, 3600),
        }))
      ),
    })))

  return {
    ...order,
    notes: await enrichAttachments(order.notes),
    items: await Promise.all(order.items.map(async (item) => ({
      ...item,
      notes: await enrichAttachments(item.notes),
    }))),
    packages: await Promise.all(order.packages.map(async (pkg) => ({
      ...pkg,
      notes: await enrichAttachments(pkg.notes),
    }))),
  };

}

export type Order = Awaited<ReturnType<typeof getOrder>>
