"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, MoreHorizontal, Eye, FileText } from "lucide-react"
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
}

export function EmployeeList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<string | null>(null)
  const { toast } = useToast()

  const itemsPerPage = 5

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const fetchFuncionarios = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/funcionarios")
      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários")
      }
      const data = await response.json()
      setFuncionarios(data)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os funcionários",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluir = async (id: string) => {
    try {
      const response = await fetch(`/api/funcionarios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir funcionário")
      }

      // Atualizar a lista de funcionários
      setFuncionarios(funcionarios.filter((f) => f.id !== id))

      toast({
        title: "Sucesso",
        description: "Funcionário excluído com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o funcionário",
        variant: "destructive",
      })
    } finally {
      setFuncionarioParaExcluir(null)
    }
  }

  // Paginação
  const totalPages = Math.ceil(funcionarios.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFuncionarios = funcionarios.slice(startIndex, endIndex)

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Salário</TableHead>
            <TableHead>Data de Contratação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFuncionarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum funcionário encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentFuncionarios.map((funcionario) => (
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
                <TableCell>{formatarSalario(funcionario.salario)}</TableCell>
                <TableCell>{formatarData(funcionario.dataContratacao)}</TableCell>
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
                        <Link href={`/funcionarios/${funcionario.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/funcionarios/${funcionario.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/funcionarios/${funcionario.id}/historico`}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Histórico</span>
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog
                        open={funcionarioParaExcluir === funcionario.id}
                        onOpenChange={(open) => {
                          if (!open) setFuncionarioParaExcluir(null)
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              setFuncionarioParaExcluir(funcionario.id)
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
                              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleExcluir(funcionario.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
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

      {funcionarios.length > itemsPerPage && (
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
