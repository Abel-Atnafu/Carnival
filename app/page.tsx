import Link from 'next/link'
import { TICKET_PRICE } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0712] via-[#160E28] via-70% to-[#0A0712] flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(107,63,160,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2A2240] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute top-[85%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2A2240] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#2A2240] to-transparent opacity-[0.12] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-in-slow max-w-md w-full">
        {/* Badge */}
        <div className="text-[9px] font-bold tracking-[4px] text-[#C9A84C] uppercase px-4 py-1.5 border border-[#C9A84C]/20 rounded">
          LEBAWI INTERNATIONAL ACADEMY
        </div>
        
        {/* Title */}
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-[0.5em] leading-none">
          CARNIVAL
        </h1>
        
        {/* Divider */}
        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <span className="text-[#C9A84C] text-xs">&#9670;</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
        </div>
        
        {/* Year */}
        <p className="font-serif text-lg text-[#9B93AD] tracking-[0.5em]">2026</p>
        
        {/* Collaboration Badge */}
        <p className="text-[10px] font-semibold tracking-[2px] text-[#9B93AD] uppercase">
          LIA <span className="text-[#C9A84C]">×</span> Baller&apos;s League
        </p>
        
        {/* Description */}
        <p className="text-[#6B6280] text-sm text-center max-w-[260px] leading-relaxed">
          An evening of celebration, community, and unforgettable memories
        </p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 px-7 py-3.5 bg-[rgba(201,168,76,0.12)] rounded-md border border-[#C9A84C]/15">
          <span className="text-[9px] font-bold tracking-[3px] text-[#9B93AD]">ENTRY</span>
          <span className="font-serif text-4xl font-bold text-[#C9A84C]">{TICKET_PRICE}</span>
          <span className="text-xs font-semibold text-[#C9A84C] tracking-widest">BIRR</span>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
          <Link 
            href="/buy" 
            className="btn-hover bg-gradient-to-br from-[#4A2670] to-[#6B3FA0] text-white py-3.5 px-7 rounded-md text-sm font-bold text-center shadow-[0_4px_20px_rgba(107,63,160,0.25)] tracking-wide"
          >
            Purchase Ticket
          </Link>
          <Link 
            href="/my-ticket" 
            className="btn-hover bg-transparent text-[#9B93AD] py-3.5 px-7 rounded-md text-sm font-semibold text-center border border-[#2A2240]"
          >
            View My Ticket
          </Link>
        </div>
        
        {/* Footer link */}
        <Link href="/scan" className="text-xs text-[#6B6280] font-medium hover:text-[#9B93AD] transition-colors mt-2">
          Gate Scanner
        </Link>
      </div>
    </div>
  )
}
