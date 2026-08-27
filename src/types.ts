export type TabId = 'home' | 'map' | 'requests' | 'profile'

export type IconName =
  | 'search'
  | 'pin'
  | 'bell'
  | 'star'
  | 'home'
  | 'map'
  | 'bag'
  | 'user'
  | 'plus'
  | 'arrow'
  | 'coffee'
  | 'food'
  | 'ice'
  | 'umbrella'
  | 'sparkles'
  | 'waves'
  | 'navigation'
  | 'clock'
  | 'heart'
  | 'card'
  | 'help'
  | 'logout'

export interface Category {
  id: string
  label: string
  icon: IconName
}

export interface Vendor {
  id: number
  name: string
  category: string
  distance: string
  time: string
  rating: number
  available: boolean
  tint: string
  icon: IconName
}

export interface Request {
  id: number
  vendor: string
  item: string
  status: string
  color: string
}
