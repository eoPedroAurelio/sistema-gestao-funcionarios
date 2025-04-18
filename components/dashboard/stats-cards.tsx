"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, DollarSign, CalendarDays } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type DashboardStats = {
  totalFuncionarios: number
  mediaSalarial: number
  totalDepartamentos: number
  contratacoesRecentes: number
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas")
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Formatação de valores
  const formatarSalario = (salario: number) => {
    return salario.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  // Dados para exibição
  const cardsData = [
    {
      title: "Total de Funcionários",
      value: stats?.totalFuncionarios || 0,
      icon: Users,
      description: `${stats?.contratacoesRecentes || 0} no último mês`,
    },
    {
      title: "Média Salarial",
      value: stats ? formatarSalario(stats.mediaSalarial) : "R$ 0,00",
      icon: DollarSign,
      description: "Média de todos os funcionários",
    },
    {
      title: "Departamentos",
      value: stats?.totalDepartamentos || 0,
      icon: Building2,
      description: "Ativos na empresa",
    },
    {
      title: "Contratações Recentes",
      value: stats?.contratacoesRecentes || 0,
      icon: CalendarDays,
      description: "Nos últimos 30 dias",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardsData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
