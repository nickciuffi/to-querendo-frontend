import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return <input type={type} className={cn('flex h-10 w-full rounded-xl border border-[#f2dfb8] bg-white px-3 py-2 text-sm text-[#173438] outline-none placeholder:text-[#4c6669] focus-visible:ring-2 focus-visible:ring-[#0e7a83]/30', className)} {...props} />
}

export { Input }
