"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type HistoricoCargo = {
  id: string
  cargoAnterior: string
  novoCargo: string
  dataAlteracao: string
  motivo: string
  aprovadoPor: string
}

export function EmployeeHistory({ id }: { id: string }) {
  const [historico, setHistorico] = useState<HistoricoCargo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistorico()
  }, [id])

  const fetchHistorico = async () => {
    try {
      const response = await fetch(`/api/funcionarios/${id}`)
      if (!response.ok) {
        throw new Error("Erro ao buscar histórico")
      }
      const data = await response.json()
      setHistorico(data.historicoCargos || [])
    } catch (error) {
      console.error("Erro ao buscar histórico:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de cargos",
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

  if (historico.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Nenhum histórico de cargo encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cargo Anterior</TableHead>
              <TableHead>Novo Cargo</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Aprovado Por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historico.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatarData(item.dataAlteracao)}</TableCell>
                <TableCell>{item.cargoAnterior}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  <span>{item.novoCargo}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {item.motivo}
                  </Badge>
                </TableCell>
                <TableCell>{item.aprovadoPor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
