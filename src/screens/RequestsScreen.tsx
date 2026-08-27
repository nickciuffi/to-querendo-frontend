import { requests } from '../data'
import { BeachIcon } from '../components/BeachIcon'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export function RequestsScreen() {
  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden"><header className="flex shrink-0 items-start justify-between bg-[#0e7a83] px-5 pb-[22px] pt-[18px] text-white"><div><div className="font-['Baloo_2'] text-[19px] font-semibold">Meus pedidos</div><div className="mt-1 text-xs opacity-85">acompanhe suas solicitações</div></div></header><main className="min-h-0 flex-1 overflow-y-auto px-5 pb-[90px] pt-[18px] [scrollbar-width:none]">{requests.map((request) => <Card className="mb-2.5 rounded-[14px] border-0 bg-white py-0 shadow-[0_4px_14px_rgba(23,52,56,0.06)]" key={request.id}><CardContent className="p-[13px_14px]"><div className="mb-1.5 flex items-center justify-between gap-2"><span className="text-[13px] font-bold text-[#173438]">{request.vendor}</span><Button variant="outline" size="sm" className="h-auto rounded-full px-2 py-0.5 text-[10.5px]" style={{ color: request.color, borderColor: request.color }}>{request.status}</Button></div><span className="flex items-center gap-1.5 text-xs text-[#4c6669]"><BeachIcon name="clock" size={13} />{request.item}</span></CardContent></Card>)}</main></div>
}
