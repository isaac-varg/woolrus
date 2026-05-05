'use server'

import prisma from "@/lib/prisma"

export const getLastSync = async () => {
  const log = await prisma.syncLog.findFirst({
    orderBy: { startedAt: 'desc' },
    select: { startedAt: true, completedAt: true, status: true },
  })

  return log?.completedAt ?? log?.startedAt ?? null
}
