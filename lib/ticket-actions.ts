[3 / 26 / 2026 11:02 AM] Abel: "use server"

import { createClient } from "@/lib/supabase/server"

export type Ticket = {
  id: string
  code: string
  name: string
  phone: string
  email: string | null
  quantity: number
  total_amount: number
  payment_method: string
  payment_screenshot: string | null
  status: "pending" | "confirmed" | "used"
  created_at: string
  updated_at: string
}

function generateTicketCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "LEB-"
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function createTicket(data: {
  name: string
  phone: string
  email?: string
  quantity: number
  totalAmount: number
  paymentMethod: string
  paymentScreenshot?: string
}): Promise<{ tickets: Ticket[] | null; error: string | null }> {
  const supabase = await createClient()

  const pricePerTicket = Math.round(data.totalAmount / data.quantity)

  const ticketRows = Array.from({ length: data.quantity }, () => ({
    code: generateTicketCode(),
    name: data.name,
    phone: data.phone,
    email: data.email ? data.email : null,
    quantity: 1,
    total_amount: pricePerTicket,
    payment_method: data.paymentMethod,
    payment_screenshot: data.paymentScreenshot ? data.paymentScreenshot : null,
    status: "pending",
  }))

  const { data: tickets, error } = await supabase
    .from("tickets")
    .insert(ticketRows)
    .select()

  if (error) {
    console.error("Error creating tickets:", error)
    return { tickets: null, error: error.message }
  }

  return { tickets, error: null }
}

export async function getTicketByCode(
  code: string
): Promise<{ ticket: Ticket | null; error: string | null }> {
  const supabase = await createClient()

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (error) {
    return { ticket: null, error: "Ticket not found" }
  }

  return { ticket, error: null }
}

export async function searchTickets(
  query: string
): Promise<{ tickets: Ticket[]; error: string | null }> {
  const supabase = await createClient()

  const nameFilter = "name.ilike.%" + query + "%"
  const phoneFilter = "phone.ilike.%" + query + "%"
  const codeFilter = "code.ilike.%" + query + "%"
  const combined = nameFilter + "," + phoneFilter + "," + codeFilter

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .or(combined)
    .order("created_at", { ascending: false })

  if (error) {
    return { tickets: [], error: error.message }
  }

  return { tickets: tickets ? tickets : [], error: null }
}

export async function getAllTickets(): Promise<{
  tickets: Ticket[]
  error: string | null
}> {
  const supabase = await createClient()

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return { tickets: [], error: error.message }
  }

  return { tickets: tickets ? tickets : [], error: null }
}

export async function updateTicketStatus(
  id: string,
  status: "pending" | "confirmed" | "used"
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export async function markTicketAsUsed(
  code: string
): Promise<{ ticket: Ticket | null; error: string | null }> {
  const supabase = await createClient()

  const { data: existingTicket, error: fetchError } = await supabase
    .from("tickets")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (fetchError) {
    return { ticket: null, error: "Ticket not found" }
  }

  if (!existingTicket) {
    return { ticket: null, error: "Ticket not found" }
  }
  [3 / 26 / 2026 11:02 AM] Abel: if (existingTicket.status === "used") {
    return { ticket: null, error: "Ticket has already been used" }
  }

  if (existingTicket.status !== "confirmed") {
    return { ticket: null, error: "Ticket payment not confirmed yet" }
  }

  const { data: ticket, error } = await supabase
    .from("tickets")
    .update({ status: "used", updated_at: new Date().toISOString() })
    .eq("code", code.toUpperCase())
    .select()
    .single()

  if (error) {
    return { ticket: null, error: error.message }
  }

  return { ticket, error: null }
}

export async function getTicketStats(): Promise<{
  total: number
  pending: number
  confirmed: number
  used: number
  totalRevenue: number
}> {
  const supabase = await createClient()

  const { data: tickets } = await supabase.from("tickets").select("*")

  if (!tickets) {
    return { total: 0, pending: 0, confirmed: 0, used: 0, totalRevenue: 0 }
  }

  return {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    confirmed: tickets.filter((t) => t.status === "confirmed").length,
    used: tickets.filter((t) => t.status === "used").length,
    totalRevenue: tickets
      .filter((t) => t.status !== "pending")
      .reduce((sum, t) => sum + t.total_amount, 0),
  }
}