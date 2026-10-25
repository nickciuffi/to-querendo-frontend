/** Vendedor da praia posicionado no mapa, com os produtos que ele vende. */
export interface MapVendor {
  id: number
  name: string
  lat: number
  lng: number
  products: SellerProduct[]
  /** Produto que representa o vendedor no ícone do mapa. */
  featuredProduct: SellerProduct
  /** Tem ao menos um produto ativo à venda. */
  available: boolean
}

/** Ponto genérico desenhado no mapa (vendedor ou banhista). */
export interface MapMarker {
  id: number
  label: string
  lat: number
  lng: number
  /** Foto que preenche o ícone; sem ela, usa as iniciais (se houver) ou o emoji padrão. */
  photoUrl: string | null
  /** Iniciais exibidas no ícone quando não há foto (ex.: nome de um banhista). */
  initials?: string
  /** Cor do anel quando o marcador não está selecionado. */
  ringColor: string
  /** Desenha o ícone em tons de cinza. */
  dimmed?: boolean
}

/** Banhista com intenção(ões) de compra, exibido no mapa do vendedor. */
export interface BuyerWithIntentions {
  id: number
  name: string
  intentions: PurchaseIntention[]
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
  /** Centro da praia. Ausente em praias antigas ainda sem coordenadas. */
  latitude?: number | null
  longitude?: number | null
  /** Distância até o usuário em km. Só vem em GET /praia/proximas. */
  distanceKm?: number | null
}

export interface UserCategory {
  id: number
  description: string
}

export type Role = "ROLE_TURISTA" | "ROLE_VENDEDOR" | "ROLE_ADMIN"

export interface AuthUser {
  name: string
  email: string
  phone: string | null
  cpf: string | null
  photoUrl: string | null
  beach: UserBeach | null
  category: UserCategory | null
  description: string
  online: boolean
}

export interface SellerProduct {
  id: number
  name: string
  description: string
  baseProductId: number
  baseProductName: string
  photoUrl: string | null
  price: number
  active: boolean
  baseProductActive: boolean
  createdAt: string
}

export interface PurchaseIntention {
  id: number
  baseProductId: number
  baseProductName: string
  locationDescription: string
  observations: string
  photoUrl: string | null
  createdAt: string
}
