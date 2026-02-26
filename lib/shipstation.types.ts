// ShipStation v2 API types

export interface Address {
  name: string
  phone?: string
  company_name?: string
  address_line1: string
  address_line2?: string
  address_line3?: string
  city_locality: string
  state_province: string
  postal_code: string
  country_code: string
  address_residential_indicator?: 'yes' | 'no' | 'unknown'
}

export interface Weight {
  value: number
  unit: 'pound' | 'ounce' | 'gram' | 'kilogram'
}

export interface Dimensions {
  length: number
  width: number
  height: number
  unit: 'inch' | 'centimeter'
}

export interface RateRequest {
  rate_options: {
    carrier_ids: string[]
  }
  shipment: {
    ship_from: Address
    ship_to: Address
    packages: RatePackage[]
  }
}

export interface RatePackage {
  weight: Weight
  dimensions: Dimensions
}

export interface Rate {
  rate_id: string
  rate_type: string
  carrier_id: string
  carrier_code: string
  carrier_friendly_name: string
  service_code: string
  service_type: string
  shipping_amount: MoneyAmount
  delivery_days?: number
  estimated_delivery_date?: string
  guaranteed_service: boolean
  trackable: boolean
  package_type?: string
  negotiated_rate: boolean
  validation_status: string
  warning_messages?: string[]
  error_messages?: string[]
}

export interface MoneyAmount {
  amount: number
  currency: string
}

export interface RateResponseInner {
  rates: Rate[]
  invalid_rates?: Rate[]
  rate_request_id: string
  shipment_id: string
  created_at: string
  status: string
  errors?: ApiError[]
}

export interface RateResponse {
  rate_response: RateResponseInner
}

export interface LabelRequest {
  rate_id: string
  label_format?: 'pdf' | 'png' | 'zpl'
  label_layout?: '4x6' | 'letter'
}

export interface LabelResponse {
  label_id: string
  status: string
  shipment_id: string
  ship_date: string
  created_at: string
  shipment_cost: MoneyAmount
  tracking_number: string
  is_return_label: boolean
  carrier_id: string
  carrier_code: string
  service_code: string
  label_format: string
  label_layout: string
  trackable: boolean
  label_download: {
    pdf?: string
    png?: string
    zpl?: string
    href: string
  }
  packages: LabelPackage[]
}

export interface LabelPackage {
  package_id: number
  tracking_number: string
  weight: Weight
  dimensions: Dimensions
}

export interface VoidLabelResponse {
  approved: boolean
  message: string
}

export interface Carrier {
  carrier_id: string
  carrier_code: string
  account_number: string
  requires_funded_amount: boolean
  balance: number
  nickname: string | null
  friendly_name: string
  primary: boolean
  has_multi_package_supporting_services: boolean
  supports_label_messages: boolean
}

export interface ApiError {
  error_source: string
  error_type: string
  error_code: string
  message: string
}

export interface CarrierServiceInfo {
  carrier_id: string
  service_code: string
  name: string
  domestic: boolean
  international: boolean
}

export interface ShipStationErrorBody {
  request_id?: string
  errors?: ApiError[]
}
