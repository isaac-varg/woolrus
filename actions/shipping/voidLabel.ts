'use server'

import prisma from '@/lib/prisma'
import { shipstation } from '@/lib/shipstation'

export const voidLabel = async (labelId: string) => {
  const label = await prisma.shippingLabel.findUniqueOrThrow({
    where: { id: labelId },
  })

  const result = await shipstation.voidLabel(label.labelId)

  if (!result.approved) {
    throw new Error(result.message || 'Label void was rejected by carrier')
  }

  await prisma.shippingLabel.update({
    where: { id: labelId },
    data: {
      status: 'voided',
      voidedAt: new Date(),
    },
  })
}
