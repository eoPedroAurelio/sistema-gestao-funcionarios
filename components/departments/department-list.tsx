"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, MoreHorizontal, Eye, Users } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Departamento = {
  id: string
  nome: string
  orcamento: number
  localizacao: string
  dataCriacao: string
  funcionariosCount: number
}

export function DepartmentList() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [departamentoParaExcluir, setDepartamentoParaExcluir] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  const itemsPerPage = 5

  useEffect(() => {
    fetchDepartamentos()
  }, [])

  const fetchDepartamentos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/departamentos")
      if (!response.ok) {
        throw new Error("Erro ao buscar departamentos")
      }
      const data = await response.json()
      setDepartamentos(data)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os departamentos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluir = async (id: string) => {
    try {
      const response = await fetch(`/api/departamentos/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error)
        return
      }

      // Atualizar a lista de departamentos
      setDepartamentos(departamentos.filter((d) => d.id !== id))

      toast({
        title: "Sucesso",
        description: "Departamento excluído com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir departamento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o departamento",
        variant: "destructive",
      })
    } finally {
      setDepartamentoParaExcluir(null)
      setErrorMessage(null)
    }
  }

  // Paginação
  const totalPages = Math.ceil(departamentos.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDepartamentos = departamentos.slice(startIndex, endIndex)

  // Formatação de data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Formatação de orçamento
  const formatarOrcamento = (orcamento: number) => {
    return orcamento.toLocaleString("pt-BR", {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Departamento</TableHead>
            <TableHead>Orçamento</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Funcionários</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDepartamentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum departamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentDepartamentos.map((departamento) => (
              <TableRow key={departamento.id}>
                <TableCell className="font-medium">{departamento.nome}</TableCell>
                <TableCell>{formatarOrcamento(departamento.orcamento)}</TableCell>
                <TableCell>{departamento.localizacao}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{departamento.funcionariosCount}</span>
                  </div>
                </TableCell>
                <TableCell>{formatarData(departamento.dataCriacao)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/departamentos/${departamento.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/departamentos/${departamento.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/departamentos/${departamento.id}/funcionarios`}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Ver Funcionários</span>
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog
                        open={departamentoParaExcluir === departamento.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setDepartamentoParaExcluir(null)
                            setErrorMessage(null)
                          }
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              setDepartamentoParaExcluir(departamento.id)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              {errorMessage ||
                                "Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            {!errorMessage && (
                              <AlertDialogAction
                                onClick={() => handleExcluir(departamento.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            )}
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {departamentos.length > itemsPerPage && (
        <div className="flex items-center justify-end p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setPage(index + 1)} isActive={page === index + 1}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
