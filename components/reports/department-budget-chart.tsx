"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useToast } from "@/components/ui/use-toast"

type BudgetData = {
  name: string
  budget: number
  spent: number
}

export function DepartmentBudgetChart() {
  const [data, setData] = useState<BudgetData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/relatorios?tipo=orcamento")
      if (!response.ok) {
        throw new Error("Erro ao buscar dados")
      }
      const responseData = await response.json()
      setData(responseData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de orçamento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value) => [`R$ ${value.toLocaleString()}`, ""]}
          labelFormatter={(label) => `Departamento: ${label}`}
        />
        <Legend />
        <Bar dataKey="budget" name="Orçamento" fill="#8884d8" />
        <Bar dataKey="spent" name="Gasto" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
