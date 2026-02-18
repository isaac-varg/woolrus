'use server'

import prisma from "@/lib/prisma"

export const getOrder = async (orderId: string) => {

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true
    }
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;

}

export type Order = Awaited<ReturnType<typeof getOrder>>
