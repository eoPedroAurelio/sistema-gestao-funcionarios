"use client"

import type React from "react"

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {children}
    </div>
  )
}
