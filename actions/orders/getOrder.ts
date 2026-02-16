'use server'

import prisma from "@/lib/prisma"

export const getOrder = async (orderId: number) => {

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    }
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;

}

export type Order = Awaited<ReturnType<typeof getOrder>>
