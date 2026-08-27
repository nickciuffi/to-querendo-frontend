import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BeachIcon } from './components/BeachIcon'
import { HomeScreen } from './screens/HomeScreen'
import { MapScreen } from './screens/MapScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { RequestsScreen } from './screens/RequestsScreen'
import type { IconName, TabId } from './types'

const tabs: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'map', label: 'Mapa', icon: 'map' },
  { id: 'requests', label: 'Pedidos', icon: 'bag' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
]

function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const screen = {
    home: <HomeScreen activeCategory={activeCategory} onCategoryChange={(category) => setActiveCategory(activeCategory === category ? null : category)} />,
    map: <MapScreen />,
    requests: <RequestsScreen />,
    profile: <ProfileScreen />,
  }[tab]

  return <main className="grid min-h-screen place-items-center bg-[#0b3f44] p-4 sm:p-8"><Card className="relative flex h-[780px] max-h-[calc(100vh-2rem)] w-[375px] max-w-full flex-col overflow-hidden rounded-[42px] border-8 border-[#0d2124] bg-[#fbefda] p-0 shadow-2xl sm:max-h-[92vh]"><div className="absolute left-1/2 top-0 z-20 h-[22px] w-[130px] -translate-x-1/2 rounded-b-2xl bg-[#0d2124]" /><div className="flex h-[30px] shrink-0 items-center justify-between bg-[#0e7a83] px-6 text-xs font-bold text-[#0b3f44]"><span>9:41</span><span>Beach Buy</span></div>{screen}<nav className="z-10 flex shrink-0 border-t border-[#f2dfb8] bg-white px-2.5 pb-4 pt-2.5">{tabs.map((item) => <Button key={item.id} variant="ghost" className={`h-auto flex-1 flex-col gap-0.5 rounded-none px-1 py-0 text-[10px] ${tab === item.id ? 'text-[#0e7a83]' : 'text-[#a9b4b5]'}`} onClick={() => setTab(item.id)}><BeachIcon name={item.icon} size={20} />{item.label}{tab === item.id && <span className="mt-px size-1 rounded-full bg-[#ff6f52]" />}</Button>)}</nav></Card></main>
}

export default App

