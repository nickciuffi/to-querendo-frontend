import type { Beach, Vendor } from "@/lib/types"

export const BEACHES: Beach[] = [
  { id: "copacabana", name: "Copacabana", city: "Rio de Janeiro", center: [-43.1822, -22.9711] },
  { id: "ipanema", name: "Ipanema", city: "Rio de Janeiro", center: [-43.2047, -22.9868] },
  { id: "barra-tijuca", name: "Barra da Tijuca", city: "Rio de Janeiro", center: [-43.3653, -23.0086] },
  { id: "porto-de-galinhas", name: "Porto de Galinhas", city: "Ipojuca", center: [-35.0031, -8.5083] },
  { id: "praia-grande", name: "Praia Grande", city: "Ubatuba", center: [-45.1147, -23.4384] },
]

export const VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Seu Carlos",
    avatarEmoji: "🧉",
    rating: 4.8,
    distanceMeters: 120,
    lng: -43.1822 + 0.0025,
    lat: -22.9711 - 0.0012,
    isOpen: true,
    specialty: "Mate e água de coco",
  },
  {
    id: "v2",
    name: "Dona Marisa",
    avatarEmoji: "🍍",
    rating: 4.9,
    distanceMeters: 260,
    lng: -43.1822 - 0.003,
    lat: -22.9711 + 0.0018,
    isOpen: true,
    specialty: "Frutas e espetinhos",
  },
  {
    id: "v3",
    name: "Zé do Açaí",
    avatarEmoji: "🍧",
    rating: 4.6,
    distanceMeters: 340,
    lng: -43.1822 + 0.0012,
    lat: -22.9711 + 0.0035,
    isOpen: false,
    specialty: "Açaí na tigela",
  },
  {
    id: "v4",
    name: "Bel da Barraca",
    avatarEmoji: "🍹",
    rating: 4.7,
    distanceMeters: 410,
    lng: -43.1822 - 0.0045,
    lat: -22.9711 - 0.0028,
    isOpen: true,
    specialty: "Caipirinha e sucos",
  },
  {
    id: "v5",
    name: "Painço",
    avatarEmoji: "🥥",
    rating: 4.5,
    distanceMeters: 500,
    lng: -43.1822 + 0.0038,
    lat: -22.9711 - 0.0032,
    isOpen: true,
    specialty: "Água de coco gelada",
  },
]

const VENDOR_PRODUCT_COUNTS: Record<string, number> = {
  v1: 2,
  v2: 2,
  v3: 1,
  v4: 2,
  v5: 1,
}

export function getVendorById(id: string): Vendor | undefined {
  return VENDORS.find((vendor) => vendor.id === id)
}

export function getBeachByName(name: string): Beach | undefined {
  const normalized = name.trim().toLowerCase()
  return BEACHES.find((beach) => beach.name.toLowerCase() === normalized)
}

export function getVendorProductCount(vendorId: string): number {
  return VENDOR_PRODUCT_COUNTS[vendorId] ?? 0
}

export function getOnlineSellersCount(productId: string): number {
  const seed = productId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return (seed % 20) + 3
}
