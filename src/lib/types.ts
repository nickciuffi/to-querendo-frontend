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
