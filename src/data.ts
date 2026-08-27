import type { Category, Request, Vendor } from './types'

export const tokens = {
  sand: '#fbefda',
  sandDeep: '#f2dfb8',
  ocean: '#0e7a83',
  oceanDeep: '#0a5a61',
  oceanDark: '#0b3f44',
  coral: '#ff6f52',
  sun: '#ffc94a',
  ink: '#173438',
  inkSoft: '#4c6669',
} as const

export const categories: Category[] = [
  { id: 'milho', label: 'Milho', icon: 'coffee' },
  { id: 'espetinho', label: 'Espetinho', icon: 'food' },
  { id: 'sorvete', label: 'Sorvete', icon: 'ice' },
  { id: 'bola', label: 'Bola', icon: 'umbrella' },
  { id: 'artesanato', label: 'Artesanato', icon: 'sparkles' },
  { id: 'chop', label: 'Chop', icon: 'waves' },
]

export const vendors: Vendor[] = [
  { id: 1, name: 'Milho do Zé', category: 'Milho', distance: '80 m', time: 'chega em ~3 min', rating: 4.9, available: true, tint: tokens.sun, icon: 'coffee' },
  { id: 2, name: 'Espetinho Dona Rosa', category: 'Espetinho', distance: '150 m', time: 'chega em ~5 min', rating: 4.7, available: true, tint: tokens.ocean, icon: 'umbrella' },
  { id: 3, name: 'Sorvete Kibom', category: 'Sorvete', distance: '210 m', time: 'ocupado no momento', rating: 4.8, available: false, tint: tokens.coral, icon: 'ice' },
  { id: 4, name: 'Chop da Bianca', category: 'Chop', distance: '320 m', time: 'chega em ~8 min', rating: 5.0, available: true, tint: '#7ba7a0', icon: 'sparkles' },
]

export const requests: Request[] = [
  { id: 1, vendor: 'Água de Coco do Zé', item: '2x Água de coco gelada', status: 'A caminho', color: tokens.coral },
  { id: 2, vendor: 'Cadeiras Dona Rosa', item: '2 cadeiras + guarda-sol', status: 'Concluído', color: tokens.ocean },
  { id: 3, vendor: 'Espetinho do Marcão', item: '3x Espetinho de carne', status: 'Cancelado', color: '#b5b5b5' },
]
