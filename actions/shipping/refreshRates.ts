'use server'

import { fetchRatesForOrder } from './fetchRates'

export const refreshRates = async (orderId: string) => {
  return fetchRatesForOrder(orderId)
}
