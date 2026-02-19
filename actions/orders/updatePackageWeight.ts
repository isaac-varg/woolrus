'use server'

import prisma from "@/lib/prisma"

export const updatePackageWeight = async (packageId: string, weight: number | null) => {
  return await prisma.package.update({
    where: { id: packageId },
    data: { weight },
  })
}
