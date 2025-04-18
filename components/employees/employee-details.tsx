"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

type Funcionario = {
  id: string
  nome: string
  email: string
  cpf: string
  cargo: string
  salario: number
  dataContratacao: string
  departamento: {
    id: string
    nome: string
  }
  supervisor?: {
    id: string
    nome: string
  } | null
}

export function EmployeeDetails({ id }: { id: string }) {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFuncionario()
  }, [id])

  const fetchFuncionario = async () => {
    try {
      const response = await fetch(`/api/funcionarios/${id}`)
      if (!response.ok) {
        throw new Error("Erro ao buscar funcionário")
      }
      const data = await response.json()
      setFuncionario(data)
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do funcionário",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Formatação de data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Formatação de salário
  const formatarSalario = (salario: number) => {
    return salario.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!funcionario) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Funcionário não encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={`/abstract-geometric-shapes.png?height=96&width=96&query=${funcionario.nome}`}
            alt={funcionario.nome}
          />
          <AvatarFallback className="text-2xl">{funcionario.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{funcionario.nome}</h2>
          <p className="text-muted-foreground">{funcionario.cargo}</p>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Informações de Contato</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{funcionario.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPF:</span>
                  <span>{funcionario.cpf}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Informações Profissionais</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departamento:</span>
                  <span>{funcionario.departamento.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cargo:</span>
                  <span>{funcionario.cargo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salário:</span>
                  <span>{formatarSalario(funcionario.salario)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Informações Adicionais</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Contratação:</span>
                  <span>{formatarData(funcionario.dataContratacao)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supervisor:</span>
                  <span>{funcionario.supervisor?.nome || "Não possui"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
