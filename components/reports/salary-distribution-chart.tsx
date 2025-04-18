"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useToast } from "@/components/ui/use-toast"

type SalaryData = {
  name: string
  junior: number
  pleno: number
  senior: number
}

export function SalaryDistributionChart() {
  const [data, setData] = useState<SalaryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/relatorios?tipo=salario")
      if (!response.ok) {
        throw new Error("Erro ao buscar dados")
      }
      const responseData = await response.json()
      setData(responseData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de distribuição salarial",
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
        <YAxis tickFormatter={(value) => `R$ ${value}`} />
        <Tooltip formatter={(value) => [`R$ ${value}`, "Média Salarial"]} />
        <Legend />
        <Bar dataKey="junior" name="Júnior" fill="#8884d8" />
        <Bar dataKey="pleno" name="Pleno" fill="#82ca9d" />
        <Bar dataKey="senior" name="Sênior" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}
