import { categories, vendors } from '../data'
import type { Category } from '../types'
import { BeachIcon } from '../components/BeachIcon'
import { VendorCard } from '../components/VendorCard'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

type HomeScreenProps = { activeCategory: string | null; onCategoryChange: (category: string) => void }

const categoryColors = ['#ffc94a', '#0e7a83', '#ff6f52', '#7ba7a0', '#e1a34a', '#5aa5ae']

function CategoryCard({ category, active, color, onClick }: { category: Category; active: boolean; color: string; onClick: () => void }) {
  return <Button variant="outline" className={`h-auto min-w-0 flex-1 flex-col gap-2 rounded-2xl border-[#f2dfb8] px-2.5 py-3 text-[11px] text-[#173438] shadow-sm hover:border-[#0e7a83] ${active ? 'border-[#ff6f52] bg-[#fff4ed] ring-2 ring-[#ff6f52]/20' : 'bg-white'}`} onClick={onClick}><span className="grid size-10 place-items-center rounded-xl text-white" style={{ background: color }}><BeachIcon name={category.icon} size={21} /></span><span>{category.label}</span></Button>
}

export function HomeScreen({ activeCategory, onCategoryChange }: HomeScreenProps) {
  const visibleVendors = activeCategory ? vendors.filter((vendor) => vendor.category.toLowerCase().includes(activeCategory === 'cadeiras' ? 'cadeira' : activeCategory)) : vendors

  return <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <header className="flex shrink-0 items-start justify-between bg-[#0e7a83] px-5 pb-[22px] pt-[18px] text-white"><div><div className="font-['Baloo_2'] text-[19px] font-semibold">Boa tarde ☀️</div><div className="mt-1 flex items-center gap-1 text-xs opacity-85"><BeachIcon name="pin" size={14} />Praia de Ubatuba</div></div><Button variant="ghost" size="icon" className="relative bg-white/20 text-white hover:bg-white/30" aria-label="Notificações"><BeachIcon name="bell" size={18} /><span className="absolute right-[7px] top-1.5 size-[7px] rounded-full border-[1.5px] border-[#0e7a83] bg-[#ff6f52]" /></Button></header>
    <div className="relative z-10 mx-5 -mt-3.5 flex items-center gap-2 rounded-[14px] bg-white px-3.5 py-1 text-[#4c6669] shadow-[0_8px_20px_rgba(11,63,68,0.18)]"><BeachIcon name="search" size={18} /><Input className="border-0 px-0 shadow-none focus-visible:ring-0" placeholder="O que você precisa na praia?" /></div>
    <div className="h-5 shrink-0 bg-[#fbefda] [clip-path:ellipse(65%_60%_at_50%_100%)]" aria-hidden="true" />
    <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-[90px] pt-1 [scrollbar-width:none]">
      <div className="mb-3 flex items-center justify-between"><span className="font-['Baloo_2'] text-base font-semibold text-[#173438]">Disponível em sua praia</span><Button variant="ghost" size="sm" className="h-auto gap-0.5 px-1 text-xs text-[#0e7a83]">ver mapa <BeachIcon name="arrow" size={14} /></Button></div>
      <div className="grid grid-cols-3 gap-2">{categories.map((category, index) => <CategoryCard key={category.id} category={category} color={categoryColors[index % categoryColors.length]} active={activeCategory === category.id} onClick={() => onCategoryChange(category.id)} />)}</div>
      <div className="mb-3 mt-6 flex items-center justify-between"><span className="font-['Baloo_2'] text-base font-semibold text-[#173438]">Serviços disponíveis</span>{activeCategory && <Button variant="ghost" size="sm" className="h-auto px-1 text-xs text-[#ff6f52]" onClick={() => onCategoryChange(activeCategory)}>limpar filtro</Button>}</div>
      <div className="flex flex-col gap-3">{visibleVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}</div>
      {visibleVendors.length === 0 && <p className="px-1 py-6 text-center text-[13px] text-[#4c6669]">Nenhum serviço encontrado nesta categoria.</p>}
    </main>
    <Button size="icon-lg" className="absolute bottom-[84px] right-5 size-[54px] rounded-full bg-[#ff6f52] text-white shadow-[0_10px_20px_rgba(255,111,82,0.45)] hover:bg-[#e85d45]" aria-label="Novo pedido"><BeachIcon name="plus" size={24} /></Button>
  </div>
}
