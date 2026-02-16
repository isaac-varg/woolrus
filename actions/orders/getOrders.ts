'use server'

import prisma from "@/lib/prisma"
import { PickStatus } from "@/prisma/generated/enums"

export const getOrders = async (status?: PickStatus) => {

  if (status) {
    return await prisma.order.findMany({
      where: {
        pickStatus: status
      }
    })
  }
  return await prisma.order.findMany();
}
