'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import type { UserPreferences } from '@/lib/preferences/types'

export const updatePreferences = async (
  preferences: Partial<UserPreferences>,
) => {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Not authenticated')

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session.user.email },
  })

  const existing = (user.preferences as Record<string, unknown>) ?? {}

  await prisma.user.update({
    where: { id: user.id },
    data: {
      preferences: { ...existing, ...preferences },
    },
  })
}
