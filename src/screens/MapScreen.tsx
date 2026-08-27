import { tokens, vendors } from '../data'
import { BeachIcon } from '../components/BeachIcon'
import { Card, CardContent } from '../components/ui/card'

const pins = [
  { top: '85%', left: '62%', tint: tokens.sun },
  { top: '89%', left: '24%', tint: tokens.ocean },
  { top: '70%', left: '70%', tint: tokens.coral },
  { top: '70%', left: '38%', tint: '#7ba7a0' },
]

export function MapScreen() {
  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden"><header className="flex shrink-0 items-start justify-between bg-[#0e7a83] px-5 pb-[22px] pt-[18px] text-white"><div><div className="font-['Baloo_2'] text-[19px] font-semibold">Mapa da praia</div><div className="mt-1 flex items-center gap-1 text-xs opacity-85"><BeachIcon name="pin" size={14} />Praia de Maresias</div></div><button className="grid size-[34px] place-items-center rounded-full border-0 bg-white/20 text-white" aria-label="Centralizar mapa"><BeachIcon name="navigation" size={17} /></button></header>
    <div className="relative min-h-0 flex-1 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-[#8fd6d9] to-[#4faeb4]" /><div className="absolute bottom-0 left-0 right-0 h-[38%] rounded-[60%_60%_0_0/30px] bg-[#fbefda]" />{pins.map((pin) => <span className="absolute grid size-4 -translate-x-1/2 -translate-y-full rotate-[-45deg] place-items-center rounded-[50%_50%_50%_0] shadow-[0_3px_8px_rgba(0,0,0,0.25)]" key={`${pin.top}-${pin.left}`} style={{ top: pin.top, left: pin.left, background: pin.tint }}><span className="size-1.5 rotate-45 rounded-full border-2 border-white" /></span>)}<span className="absolute left-[48%] top-[52%] size-4"><span className="block size-3.5 rounded-full border-[3px] border-white bg-[#0b3f44] shadow-[0_0_0_6px_rgba(11,63,68,0.2)]" /></span></div>
    <Card className="shrink-0 rounded-t-[20px] rounded-b-none border-0 bg-white px-4 pb-[90px] pt-2.5 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]"><div className="mx-auto mb-3 h-1 w-9 rounded bg-[#e2ded2]" /><CardContent className="flex gap-2 overflow-x-auto p-0 [scrollbar-width:none]">{vendors.slice(0, 3).map((vendor) => <div className="flex w-[108px] shrink-0 flex-col items-start gap-1.5 rounded-[14px] border border-[#f2dfb8] p-2.5" key={vendor.id}><div className="grid size-[30px] place-items-center rounded-[9px] text-white" style={{ background: vendor.tint }}><BeachIcon name={vendor.icon} size={18} /></div><span className="text-[11.5px] font-bold leading-tight text-[#173438]">{vendor.name}</span><span className="text-[10.5px] text-[#4c6669]">{vendor.distance}</span></div>)}</CardContent></Card>
  </div>
}
