import type {
  Address,
  RateRequest,
  RateResponse,
  LabelRequest,
  LabelResponse,
  VoidLabelResponse,
  Carrier,
  ShipStationErrorBody,
} from './shipstation.types'

const BASE_URL = 'https://api.shipstation.com/v2'

export class ShipStationError extends Error {
  status: number
  body: ShipStationErrorBody | null

  constructor(message: string, status: number, body: ShipStationErrorBody | null) {
    super(message)
    this.name = 'ShipStationError'
    this.status = status
    this.body = body
  }
}

export class ShipStationRateLimitError extends ShipStationError {
  retryAfter: number

  constructor(retryAfter: number, body: ShipStationErrorBody | null) {
    super('Rate limit exceeded', 429, body)
    this.name = 'ShipStationRateLimitError'
    this.retryAfter = retryAfter
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = process.env.SHIPSTATION_SECRET_KEY
  if (!apiKey) throw new Error('SHIPSTATION_SECRET_KEY is not set')

  const url = `${BASE_URL}${path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'API-Key': apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '2', 10)
    let body: ShipStationErrorBody | null = null
    try { body = await res.json() } catch {}

    // Single retry after waiting
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))

    const retryRes = await fetch(url, {
      ...options,
      headers: {
        'API-Key': apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (retryRes.status === 429) {
      throw new ShipStationRateLimitError(retryAfter, body)
    }

    if (!retryRes.ok) {
      let retryBody: ShipStationErrorBody | null = null
      try { retryBody = await retryRes.json() } catch {}
      throw new ShipStationError(
        `ShipStation API error: ${retryRes.status}`,
        retryRes.status,
        retryBody,
      )
    }

    return retryRes.json() as Promise<T>
  }

  if (!res.ok) {
    let body: ShipStationErrorBody | null = null
    try { body = await res.json() } catch {}
    throw new ShipStationError(
      `ShipStation API error: ${res.status}`,
      res.status,
      body,
    )
  }

  return res.json() as Promise<T>
}

export function getShipFromAddress(): Address {
  return {
    name: process.env.SHIP_FROM_NAME!,
    phone: process.env.SHIP_FROM_PHONE,
    address_line1: process.env.SHIP_FROM_ADDRESS_LINE1!,
    city_locality: process.env.SHIP_FROM_CITY!,
    state_province: process.env.SHIP_FROM_STATE!,
    postal_code: process.env.SHIP_FROM_POSTAL_CODE!,
    country_code: process.env.SHIP_FROM_COUNTRY_CODE ?? 'US',
  }
}

type WooShippingAddress = {
  firstName?: string
  lastName?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
  phone?: string
}

export function orderAddressToShipTo(shipping: WooShippingAddress): Address {
  return {
    name: [shipping.firstName, shipping.lastName].filter(Boolean).join(' '),
    phone: shipping.phone,
    company_name: shipping.company,
    address_line1: shipping.address1 ?? '',
    address_line2: shipping.address2,
    city_locality: shipping.city ?? '',
    state_province: shipping.state ?? '',
    postal_code: shipping.postcode ?? '',
    country_code: shipping.country ?? 'US',
    address_residential_indicator: 'unknown',
  }
}

export const shipstation = {
  getRates: (body: RateRequest) =>
    request<RateResponse>('/rates', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  purchaseLabelFromRate: (body: LabelRequest) =>
    request<LabelResponse>('/labels', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getLabel: (labelId: string) =>
    request<LabelResponse>(`/labels/${labelId}`),

  voidLabel: (labelId: string) =>
    request<VoidLabelResponse>(`/labels/${labelId}/void`, {
      method: 'PUT',
    }),

  getCarriers: () =>
    request<{ carriers: Carrier[] }>('/carriers'),
}
