'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, Minus, Plus, Check, Loader2 } from 'lucide-react'
import { Nav } from '@/components/nav'
import { createTicket, type Ticket } from '@/lib/ticket-actions'
import { TICKET_PRICE } from '@/lib/constants'

export default function BuyPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    quantity: 1,
    paymentMethod: '' as 'cbe' | 'telebirr' | '',
    paymentScreenshot: null as string | null,
    screenshotName: ''
  })

  const [completedTickets, setCompletedTickets] = useState<Ticket[] | null>(null)

  const totalAmount = form.quantity * TICKET_PRICE

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5e6) {
      toast.error('Max file size is 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(prev => ({
        ...prev,
        paymentScreenshot: ev.target?.result as string,
        screenshotName: file.name
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please fill in name and phone')
      return
    }
    if (!form.paymentMethod) {
      toast.error('Select a payment method')
      return
    }
    if (!form.paymentScreenshot) {
      toast.error('Upload payment screenshot')
      return
    }

    startTransition(async () => {
      const { tickets, error } = await createTicket({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        quantity: form.quantity,
        totalAmount,
        paymentMethod: form.paymentMethod,
        paymentScreenshot: form.paymentScreenshot || undefined,
      })

      if (error) {
        toast.error(error)
        return
      }

      if (tickets && tickets.length > 0) {
        setCompletedTickets(tickets)
        toast.success(`${tickets.length} ticket${tickets.length > 1 ? 's' : ''} reserved! Awaiting verification.`)
      }
    })
  }

  if (completedTickets && completedTickets.length > 0) {
    return (
      <div className="min-h-screen bg-[#0A0712] px-4 pb-8">
        <Nav title="Tickets Reserved" />
        <div className="bg-[#1A1528] rounded-xl p-6 border border-[#2A2240] animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-[rgba(61,214,140,0.10)] border-2 border-[#3DD68C] text-[#3DD68C] text-2xl flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-center text-white mb-1.5">Reservation Complete</h2>
          <p className="text-[#6B6280] text-sm text-center mb-5 leading-relaxed">
            {completedTickets.length > 1
              ? `Your ${completedTickets.length} tickets are reserved. Each ticket has a unique code. An admin will verify your payment shortly.`
              : 'Your ticket is reserved. An admin will verify your payment shortly.'
            }
          </p>

          {completedTickets.map((ticket, index) => (
            <div key={ticket.id} className="bg-[#130F1F] rounded-lg p-4 border border-[#2A2240] mb-3">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <div className="font-serif font-bold text-white tracking-wide">
                    {completedTickets.length > 1 ? `TICKET ${index + 1} of ${completedTickets.length}` : 'LEBAWI CARNIVAL'}
                  </div>
                </div>
                <div className="font-mono text-xs text-[#C9A84C] mt-0.5">{ticket.code}</div>
              </div>
              <div className="h-px bg-[#2A2240] mb-1" />
              <InfoRow label="Name" value={ticket.name} />
              <InfoRow label="Amount" value={`${ticket.total_amount} Birr`} />
              <InfoRow label="Payment" value={ticket.payment_method === 'cbe' ? 'CBE' : 'Telebirr'} />
              <InfoRow label="Status" value="Awaiting Verification" badge="pending" />
            </div>
          ))}

          {completedTickets.length > 1 && (
            <div className="bg-[rgba(201,168,76,0.08)] rounded-lg p-3 border border-[#C9A84C]/15 mb-4">
              <p className="text-xs text-[#C9A84C] text-center font-medium">
                Each ticket has its own unique code. Share individual codes with each attendee.
              </p>
            </div>
          )}

          <button
            onClick={() => router.push('/')}
            className="btn-hover w-full bg-gradient-to-br from-[#4A2670] to-[#6B3FA0] text-white py-3.5 rounded-md text-sm font-bold shadow-[0_4px_20px_rgba(107,63,160,0.25)]"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0712] px-4 pb-8">
      <Nav title="Purchase Ticket" />
      <div className="bg-[#1A1528] rounded-xl p-6 border border-[#2A2240] animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Lebawi Carnival</h2>
            <p className="text-[#C9A84C] text-sm font-medium mt-0.5">Entry Ticket — {TICKET_PRICE} Birr</p>
          </div>
          <div className="font-serif text-sm font-bold text-[#C9A84C] px-2.5 py-1 border border-[#C9A84C]/20 rounded">
            2026
          </div>
        </div>
        <div className="h-px bg-[#2A2240] mb-5" />

        {/* Form */}
        <Field label="Full Name" required>
          <input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3.5 py-3 rounded-md border-[1.5px] border-[#2A2240] text-sm text-[#E8E4F0] bg-[#130F1F] placeholder:text-[#6B6280] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 outline-none transition-all"
          />
        </Field>

        <Field label="Phone Number" required>
          <input
            type="tel"
            placeholder="+251 9XX XXX XXXX"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3.5 py-3 rounded-md border-[1.5px] border-[#2A2240] text-sm text-[#E8E4F0] bg-[#130F1F] placeholder:text-[#6B6280] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 outline-none transition-all"
          />
        </Field>

        <Field label="Email" optional>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3.5 py-3 rounded-md border-[1.5px] border-[#2A2240] text-sm text-[#E8E4F0] bg-[#130F1F] placeholder:text-[#6B6280] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 outline-none transition-all"
          />
        </Field>

        <Field label="Number of Tickets">
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => setForm(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
              className="w-11 h-11 rounded-md bg-[#130F1F] text-[#C9A84C] text-xl font-bold flex items-center justify-center border border-[#2A2240] hover:bg-[#1A1528] transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-serif text-2xl font-bold text-white min-w-9 text-center">{form.quantity}</span>
            <button
              onClick={() => setForm(prev => ({ ...prev, quantity: Math.min(10, prev.quantity + 1) }))}
              className="w-11 h-11 rounded-md bg-[#130F1F] text-[#C9A84C] text-xl font-bold flex items-center justify-center border border-[#2A2240] hover:bg-[#1A1528] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </Field>

        {/* Total */}
        <div className="flex justify-between items-center py-3.5 border-t border-b border-[#2A2240] mb-5">
          <span className="text-xs font-semibold text-[#9B93AD] uppercase tracking-wide">Total</span>
          <span className="font-serif text-2xl font-bold text-[#C9A84C]">{totalAmount} Birr</span>
        </div>

        {/* Payment Section */}
        <SectionHeader>Payment</SectionHeader>
        <p className="text-sm text-[#9B93AD] leading-relaxed mb-3.5">
          Transfer <strong className="text-[#C9A84C]">{totalAmount} Birr</strong> to one of the accounts below, then upload your confirmation screenshot.
        </p>

        <PaymentOption
          selected={form.paymentMethod === 'cbe'}
          onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cbe' }))}
          name="Commercial Bank of Ethiopia"
          account="Account: XXXX XXXX XXXX"
          holder="Name: — (to be updated)"
          icon="🏦"
        />

        <PaymentOption
          selected={form.paymentMethod === 'telebirr'}
          onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'telebirr' }))}
          name="Telebirr"
          account="Phone: XXXX XXX XXXX"
          holder="Name: — (to be updated)"
          icon="📱"
        />

        {/* Upload Section */}
        <SectionHeader>Proof of Payment</SectionHeader>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {!form.paymentScreenshot ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#3D3260] rounded-lg py-6 px-4 text-center cursor-pointer bg-[#130F1F] mb-4 hover:border-[#C9A84C]/50 transition-colors"
          >
            <Upload className="w-7 h-7 mx-auto mb-1.5 text-[#6B6280]" />
            <div className="text-sm font-semibold text-[#9B93AD]">Tap to upload screenshot</div>
            <div className="text-xs text-[#6B6280] mt-0.5">PNG, JPG — max 5MB</div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-[#130F1F] rounded-lg p-3 border-[1.5px] border-[#C9A84C]/20 mb-4">
            <img
              src={form.paymentScreenshot}
              alt="proof"
              className="w-14 h-14 object-cover rounded-md border border-[#2A2240]"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#E8E4F0] truncate max-w-[160px] mb-1">
                {form.screenshotName}
              </div>
              <button
                onClick={() => {
                  setForm(prev => ({ ...prev, paymentScreenshot: null, screenshotName: '' }))
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="text-xs font-semibold text-[#E85454]"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="btn-hover w-full bg-gradient-to-br from-[#4A2670] to-[#6B3FA0] text-white py-3.5 rounded-md text-sm font-bold shadow-[0_4px_20px_rgba(107,63,160,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit & Reserve Ticket'
          )}
        </button>
      </div>
    </div>
  )
}

function Field({ label, required, optional, children }: { label: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[11px] font-semibold text-[#9B93AD] mb-1.5 tracking-wide uppercase">
          {label}
          {required && <span className="text-[#C9A84C]"> *</span>}
          {optional && <span className="text-[#6B6280] font-normal"> (optional)</span>}
        </label>
      )}
      {children}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#2A2240]" />
      <span className="text-[10px] font-bold text-[#6B6280] uppercase tracking-[2.5px]">{children}</span>
      <div className="flex-1 h-px bg-[#2A2240]" />
    </div>
  )
}

function PaymentOption({ selected, onClick, name, account, holder, icon }: {
  selected: boolean
  onClick: () => void
  name: string
  account: string
  holder: string
  icon: string
}) {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center bg-[#130F1F] rounded-lg p-3.5 mb-2 border-[1.5px] cursor-pointer transition-all ${
        selected ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)]' : 'border-[#2A2240]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-[#C9A84C]' : 'border-[#3D3260]'
        }`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />}
        </div>
        <div>
          <div className="text-sm font-bold text-[#E8E4F0] mb-0.5">{name}</div>
          <div className="text-xs font-semibold font-mono text-[#C9A84C]">{account}</div>
          <div className="text-[11px] text-[#6B6280]">{holder}</div>
        </div>
      </div>
      <span className="text-2xl opacity-40">{icon}</span>
    </div>
  )
}

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: 'pending' | 'confirmed' }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#2A2240] last:border-0">
      <span className="text-[13px] text-[#9B93AD]">{label}</span>
      {badge ? (
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight ${
          badge === 'confirmed'
            ? 'bg-[rgba(61,214,140,0.10)] text-[#3DD68C]'
            : 'bg-[rgba(232,184,76,0.10)] text-[#E8B84C]'
        }`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-semibold text-[#E8E4F0]">{value}</span>
      )}
    </div>
  )
}
