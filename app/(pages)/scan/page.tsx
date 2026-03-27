'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { ScanLine, Check, X, RotateCcw, Loader2 } from 'lucide-react'
import { Nav } from '@/components/nav'
import { markTicketAsUsed, type Ticket } from '@/lib/ticket-actions'

export default function ScanPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ ok: boolean; msg: string; ticket?: Ticket } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleScan = () => {
    if (!input.trim()) return
    
    startTransition(async () => {
      const { ticket, error } = await markTicketAsUsed(input.trim())
      
      if (error) {
        setResult({ ok: false, msg: error })
        return
      }
      
      if (ticket) {
        setResult({ ok: true, msg: 'Entry Approved!', ticket })
        toast.success('Entry approved!')
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0712] px-4 pb-8">
      <Nav title="Gate Scanner" />
      <div className="bg-[#1A1528] rounded-xl p-6 border border-[#2A2240] animate-fade-in">
        <div className="text-4xl text-center mb-2">
          <ScanLine className="w-10 h-10 mx-auto text-[#C9A84C]" />
        </div>
        <h2 className="font-serif text-xl font-bold text-center text-white mb-1.5">Validate Ticket</h2>
        <p className="text-[#6B6280] text-sm text-center mb-5 leading-relaxed">
          Enter ticket code to verify entry
        </p>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="LEB-XXXXXX"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            className="w-full px-3.5 py-3 rounded-md border-[1.5px] border-[#2A2240] text-lg font-semibold font-mono text-[#E8E4F0] bg-[#130F1F] placeholder:text-[#6B6280] text-center tracking-widest focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 outline-none transition-all"
          />
        </div>
        
        <button
          onClick={handleScan}
          disabled={isPending}
          className="btn-hover w-full bg-gradient-to-br from-[#4A2670] to-[#6B3FA0] text-white py-3.5 rounded-md text-sm font-bold shadow-[0_4px_20px_rgba(107,63,160,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ScanLine className="w-4 h-4" />
          )}
          {isPending ? 'Validating...' : 'Validate'}
        </button>
        
        {result && (
          <div 
            className={`mt-4 p-4 rounded-lg border-2 text-center animate-fade-in ${
              result.ok 
                ? 'border-[#3DD68C] bg-[rgba(61,214,140,0.10)]' 
                : 'border-[#E85454] bg-[rgba(232,84,84,0.10)]'
            }`}
          >
            <div className={`text-4xl mb-2 ${result.ok ? 'text-[#3DD68C]' : 'text-[#E85454]'}`}>
              {result.ok ? <Check className="w-10 h-10 mx-auto" /> : <X className="w-10 h-10 mx-auto" />}
            </div>
            <div className="text-base font-bold text-[#E8E4F0]">{result.msg}</div>
            {result.ticket && (
              <div className="text-sm text-[#9B93AD] mt-1">
                {result.ticket.name} — x{result.ticket.quantity}
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => {
            setInput('')
            setResult(null)
          }}
          className="btn-hover w-full mt-3 bg-transparent text-[#9B93AD] py-3.5 rounded-md text-sm font-semibold border border-[#2A2240] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear & Scan Next
        </button>
      </div>
    </div>
  )
}
