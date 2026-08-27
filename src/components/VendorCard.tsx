import { tokens } from '../data'
import type { Vendor } from '../types'
import { BeachIcon } from './BeachIcon'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

function PulseDot({ color = tokens.coral }: { color?: string }) {
  return <span className="relative inline-flex size-2.5 items-center justify-center"><span className="absolute size-2 animate-ping rounded-full opacity-50" style={{ background: color }} /><span className="relative z-10 size-1.5 rounded-full" style={{ background: color }} /></span>
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="rounded-2xl border-0 bg-white py-0 shadow-[0_4px_14px_rgba(23,52,56,0.06)]"><CardContent className="flex items-center gap-3 p-3">
      <div className="grid size-[46px] shrink-0 place-items-center rounded-xl text-white" style={{ background: vendor.tint }}><BeachIcon name={vendor.icon} size={22} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5"><span className="truncate text-[13.5px] font-bold text-[#173438]">{vendor.name}</span><span className="flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-[#4c6669]"><span className="text-[#ffc94a]"><BeachIcon name="star" size={12} /></span>{vendor.rating}</span></div>
        <span className="text-[11.5px] text-[#4c6669]">{vendor.category}</span>
        <div className="mt-1">
          {vendor.available ? <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0a5a61]"><PulseDot color={tokens.ocean} />{vendor.distance} · {vendor.time}</span> : <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9aa5a6]"><span className="size-[7px] rounded-full bg-[#c7c7c7]" />{vendor.distance} · {vendor.time}</span>}
        </div>
      </div>
      <Button size="sm" className="rounded-[10px] bg-[#ff6f52] px-3.5 py-2.5 text-xs hover:bg-[#e85d45]" disabled={!vendor.available}>Pedir</Button>
    </CardContent></Card>
  )
}
