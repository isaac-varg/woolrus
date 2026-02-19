'use server'

import prisma from "@/lib/prisma"

export const getBoxes = async () => {
  return await prisma.box.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export type Box = Awaited<ReturnType<typeof getBoxes>>[number]
