'use server'

import prisma from "@/lib/prisma"
import { getOrder } from "./getOrder"

export const createPackage = async (orderId: string, boxId: string) => {
  await prisma.package.create({
    data: { orderId, boxId },
  })

  return getOrder(orderId)
}
