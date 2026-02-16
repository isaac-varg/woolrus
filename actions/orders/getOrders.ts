'use server'

import prisma from "@/lib/prisma"

export const getOrders = async (status?: string) => {

  if (status) {
    return prisma.order.findMany({ where: { status } })
  }
  return prisma.order.findMany({ where: { status: { not: 'complete' } } })
}
