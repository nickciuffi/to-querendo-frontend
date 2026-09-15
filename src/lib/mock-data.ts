import type { Beach, Product, Vendor } from "@/lib/types"

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

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Água de Coco",
    description: "Coco gelado na hora, direto do gelo",
    price: 8,
    emoji: "🥥",
    category: "bebida",
    vendorId: "v5",
  },
  {
    id: "p2",
    name: "Caipirinha de Limão",
    description: "Cachaça, limão e açúcar na medida certa",
    price: 18,
    emoji: "🍹",
    category: "bebida",
    vendorId: "v4",
  },
  {
    id: "p3",
    name: "Açaí na Tigela",
    description: "Açaí batido com banana, granola e leite condensado",
    price: 22,
    emoji: "🍧",
    category: "acai",
    vendorId: "v3",
  },
  {
    id: "p4",
    name: "Espetinho de Queijo Coalho",
    description: "Queijo coalho grelhado na hora com melzinho",
    price: 12,
    emoji: "🧀",
    category: "comida",
    vendorId: "v2",
  },
  {
    id: "p5",
    name: "Mate Gelado",
    description: "Mate tradicional bem geladinho",
    price: 7,
    emoji: "🧉",
    category: "bebida",
    vendorId: "v1",
  },
  {
    id: "p6",
    name: "Espeto de Camarão",
    description: "Camarão temperado grelhado na brasa",
    price: 25,
    emoji: "🍤",
    category: "comida",
    vendorId: "v2",
  },
  {
    id: "p7",
    name: "Óculos de Sol",
    description: "Proteção UV, vários modelos disponíveis",
    price: 35,
    emoji: "🕶️",
    category: "acessorio",
    vendorId: "v4",
  },
  {
    id: "p8",
    name: "Biscoito Globo",
    description: "Pacotinho crocante, clássico de praia",
    price: 6,
    emoji: "🍘",
    category: "comida",
    vendorId: "v1",
  },
]

export function getVendorById(id: string): Vendor | undefined {
  return VENDORS.find((vendor) => vendor.id === id)
}

export function getBeachByName(name: string): Beach | undefined {
  const normalized = name.trim().toLowerCase()
  return BEACHES.find((beach) => beach.name.toLowerCase() === normalized)
}

export function getProductsByVendorId(vendorId: string): Product[] {
  return PRODUCTS.filter((product) => product.vendorId === vendorId)
}

export function getOnlineSellersCount(productId: string): number {
  const seed = productId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return (seed % 20) + 3
}
