"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

type Funcionario = {
  id: string
  nome: string
  email: string
  cargo: string
  departamento: {
    nome: string
  }
  dataContratacao: string
}

export function RecentEmployees() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch("/api/funcionarios")
      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários")
      }
      const data = await response.json()

      // Ordenar por data de contratação (mais recentes primeiro) e limitar a 5
      const recentEmployees = [...data]
        .sort((a, b) => new Date(b.dataContratacao).getTime() - new Date(a.dataContratacao).getTime())
        .slice(0, 5)

      setFuncionarios(recentEmployees)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os funcionários recentes",
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (funcionarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Funcionário</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Data de Contratação</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {funcionarios.map((funcionario) => (
          <TableRow key={funcionario.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/abstract-geometric-shapes.png?height=32&width=32&query=${funcionario.nome}`}
                  alt={funcionario.nome}
                />
                <AvatarFallback>{funcionario.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{funcionario.nome}</div>
                <div className="text-xs text-muted-foreground">{funcionario.email}</div>
              </div>
            </TableCell>
            <TableCell>{funcionario.departamento.nome}</TableCell>
            <TableCell>{funcionario.cargo}</TableCell>
            <TableCell>{formatarData(funcionario.dataContratacao)}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Ativo
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
