'use server'

import prisma from "@/lib/prisma"

export const deleteQualityIssue = async (id: string) => {
  await prisma.qualityIssue.delete({
    where: { id },
  })
}
