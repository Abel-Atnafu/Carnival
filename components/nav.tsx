'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface NavProps {
  title: string
}

export function Nav({ title }: NavProps) {
  return (
    <nav className="flex items-center justify-between py-4 mb-2">
      <Link 
        href="/" 
        className="flex items-center gap-1 text-[#C9A84C] font-semibold text-sm py-2 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <span className="font-serif font-bold text-lg text-[#E8E4F0]">{title}</span>
      <div className="w-16" />
    </nav>
  )
}
