export interface Beach {
  id: string
  name: string
  city: string
  center: [number, number]
}

export interface Vendor {
  id: string
  name: string
  avatarEmoji: string
  rating: number
  distanceMeters: number
  lng: number
  lat: number
  isOpen: boolean
  specialty: string
}

export interface Product {
  id: string
  name: string
  description: string
  photoUrl: string | null
  minPrice: number
  active: boolean
}

export interface UserBeach {
  id: number
  name: string
  city: string
  state: string
}

export interface UserCategory {
  id: number
  description: string
}

export type Role = "ROLE_TURISTA" | "ROLE_VENDEDOR" | "ROLE_ADMIN"

export interface AuthUser {
  name: string
  email: string
  active: boolean
  phone: string | null
  cpf: string | null
  photoUrl: string | null
  beach: UserBeach | null
  category: UserCategory | null
}

export interface SellerProduct {
  id: number
  name: string
  description: string
  baseProductId: number
  baseProductName: string
  price: number
  active: boolean
  baseProductActive: boolean
  createdAt: string
}
