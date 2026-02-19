'use server'

import prisma from "@/lib/prisma"
import { getOrder } from "./getOrder"

export const deletePackage = async (packageId: string, orderId: string) => {
  await prisma.package.delete({
    where: { id: packageId },
  })

  return getOrder(orderId)
}
