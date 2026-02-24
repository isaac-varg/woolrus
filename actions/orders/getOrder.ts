'use server'

import prisma from "@/lib/prisma"

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
              author: { select: { id: true, name: true, image: true } }
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
        include: { box: true },
        orderBy: { createdAt: 'asc' },
      },
      notes: {
        include: {
          author: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: 'desc' },
      }
    }
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;

}

export type Order = Awaited<ReturnType<typeof getOrder>>
