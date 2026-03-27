'use client'

import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import { Lock, Phone, Ticket, CreditCard, Check, ScanLine, Loader2, RefreshCw } from 'lucide-react'
import { Nav } from '@/components/nav'
import { getAllTickets, updateTicketStatus, getTicketStats, type Ticket as TicketType } from '@/lib/ticket-actions'
import { ADMIN_PIN } from '@/lib/constants'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'used'>('all')
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, used: 0, totalRevenue: 0 })
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    const [ticketsResult, statsResult] = await Promise.all([
      getAllTickets(),
      getTicketStats()
    ])
    if (!ticketsResult.error) {
      setTickets(ticketsResult.tickets)
    }
    setStats(statsResult)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true)
    } else {
      toast.error('Incorrect PIN')
    }
  }

  const handleConfirm = (ticket: TicketType) => {
    startTransition(async () => {
      const { success, error } = await updateTicketStatus(ticket.id, 'confirmed')
      if (error) {
        toast.error(error)
        return
      }
      if (success) {
        toast.success(`Confirmed: ${ticket.name}`)
        loadData()
      }
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0712] px-4 pb-8">
        <Nav title="Admin" />
        <div className="bg-[#1A1528] rounded-xl p-6 border border-[#2A2240] animate-fade-in">
          <div className="text-4xl text-center mb-3">
            <Lock className="w-10 h-10 mx-auto text-[#C9A84C]" />
          </div>
          <h2 className="font-serif text-xl font-bold text-center text-white mb-1.5">Admin Access</h2>
          <p className="text-[#6B6280] text-sm text-center mb-5 leading-relaxed">
            Enter PIN to continue
          </p>
          <div className="mb-4">
            <input
              type="password"
              placeholder="• • • •"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-3.5 py-3 rounded-md border-[1.5px] border-[#2A2240] text-2xl font-bold text-[#E8E4F0] bg-[#130F1F] placeholder:text-[#6B6280] text-center tracking-[10px] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 outline-none transition-all"
            />
          </div>
          <button
            onClick={handleLogin}
            className="btn-hover w-full bg-gradient-to-br from-[#4A2670] to-[#6B3FA0] text-white py-3.5 rounded-md text-sm font-bold shadow-[0_4px_20px_rgba(107,63,160,0.25)]"
          >
            Enter
          </button>
          <p className="text-[11px] text-[#6B6280] text-center mt-2.5">Default PIN: 2026</p>
        </div>
      </div>
    )
  }

  const totalQuantity = tickets.reduce((sum, t) => sum + t.quantity, 0)

  const filteredTickets = 
    filter === 'all' ? tickets :
    filter === 'confirmed' ? tickets.filter(t => t.status === 'confirmed') :
    filter === 'pending' ? tickets.filter(t => t.status === 'pending') :
    tickets.filter(t => t.status === 'used')

  return (
    <div className="min-h-screen bg-[#0A0712] px-4 pb-8">
      <Nav title="Dashboard" />
      
      {/* Refresh Button */}
      <button
        onClick={() => loadData()}
        disabled={isLoading}
        className="mb-4 flex items-center gap-2 text-sm text-[#9B93AD] hover:text-[#C9A84C] transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Loading...' : 'Refresh'}
      </button>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat value={totalQuantity} label="Tickets" />
        <Stat value={stats.confirmed} label="Confirmed" color="text-[#3DD68C]" />
        <Stat value={stats.pending} label="Pending" color="text-[#E8B84C]" />
        <Stat value={stats.totalRevenue.toLocaleString()} label="Birr" color="text-[#C9A84C]" />
      </div>
      
      {/* Filter */}
      <div className="flex gap-1.5 mb-3.5 overflow-x-auto pb-1">
        {(['all', 'confirmed', 'pending', 'used'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
              filter === f 
                ? 'bg-[#6B3FA0] text-white border-[#6B3FA0]' 
                : 'bg-[#130F1F] text-[#9B93AD] border-[#2A2240]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tickets List */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="text-center py-10 text-[#6B6280] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-10 text-[#6B6280]">No tickets yet</div>
        ) : (
          filteredTickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              isPending={isPending}
              onConfirm={() => handleConfirm(ticket)} 
            />
          ))
        )}
      </div>
    </div>
  )
}

function Stat({ value, label, color }: { value: number | string; label: string; color?: string }) {
  return (
    <div className="bg-[#1A1528] rounded-lg py-3.5 px-1.5 text-center border border-[#2A2240]">
      <div className={`font-serif text-xl font-bold ${color || 'text-[#E8E4F0]'}`}>{value}</div>
      <div className="text-[10px] text-[#9B93AD] mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  )
}

function TicketCard({ ticket, onConfirm, isPending }: { ticket: TicketType; onConfirm: () => void; isPending: boolean }) {
  return (
    <div className="bg-[#1A1528] rounded-lg p-4 border border-[#2A2240]">
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="font-bold text-[15px] text-[#E8E4F0]">{ticket.name}</div>
          <div className="font-mono text-xs text-[#C9A84C] mt-0.5">{ticket.code}</div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight ${
          ticket.status === 'confirmed' 
            ? 'bg-[rgba(61,214,140,0.10)] text-[#3DD68C]' 
            : ticket.status === 'used'
            ? 'bg-[rgba(107,63,160,0.10)] text-[#9B93AD]'
            : 'bg-[rgba(232,184,76,0.10)] text-[#E8B84C]'
        }`}>
          {ticket.status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3 text-[13px] text-[#9B93AD] mb-2">
        <span className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" />
          {ticket.phone}
        </span>
        <span className="flex items-center gap-1">
          <Ticket className="w-3.5 h-3.5" />
          x{ticket.quantity}
        </span>
        <span className="flex items-center gap-1">
          {ticket.total_amount} Birr
        </span>
        {ticket.payment_method && (
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            {ticket.payment_method === 'cbe' ? 'CBE' : 'Telebirr'}
          </span>
        )}
        {ticket.status === 'used' && (
          <span className="flex items-center gap-1">
            <ScanLine className="w-3.5 h-3.5 text-[#3DD68C]" />
            Scanned
          </span>
        )}
      </div>
      
      {ticket.payment_screenshot && (
        <div className="mb-2.5">
          <div className="text-[11px] text-[#6B6280] mb-1.5 font-semibold uppercase tracking-wide">Payment Proof</div>
          <img
            src={ticket.payment_screenshot}
            alt="proof"
            className="w-full max-h-44 object-contain rounded-lg border border-[#2A2240] bg-[#0A0712]"
          />
        </div>
      )}
      
      {ticket.status === 'pending' && (
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="w-full py-2.5 rounded-md bg-[#3DD68C] text-[#0A0712] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#2cc07a] transition-colors mt-2 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Confirm Payment
        </button>
      )}
    </div>
  )
}
