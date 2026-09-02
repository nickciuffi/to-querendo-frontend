export type UserRole = "cliente" | "vendedor"

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

export type ProductCategory = "bebida" | "comida" | "acai" | "acessorio"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  emoji: string
  category: ProductCategory
  vendorId: string
}

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  beachId: string
}
