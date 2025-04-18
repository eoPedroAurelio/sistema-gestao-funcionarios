"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Esquema de validação
const departmentFormSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  orcamento: z.string().min(1, { message: "Orçamento é obrigatório" }),
  localizacao: z.string().min(1, { message: "Localização é obrigatória" }),
  descricao: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentFormSchema>

export function DepartmentForm({ department }: { department?: DepartmentFormValues }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Valores padrão para o formulário
  const defaultValues: Partial<DepartmentFormValues> = department || {
    nome: "",
    orcamento: "",
    localizacao: "",
    descricao: "",
  }

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues,
  })

  async function onSubmit(data: DepartmentFormValues) {
    setIsLoading(true)
    console.log("Dados do formulário:", data)

    try {
      // Enviar os dados para a API
      const response = await fetch("/api/departamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("Status da resposta:", response.status)
      const responseData = await response.json()
      console.log("Dados da resposta:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao cadastrar departamento")
      }

      toast({
        title: "Departamento cadastrado com sucesso!",
        description: "O departamento foi adicionado ao sistema.",
      })

      router.push("/departamentos")
    } catch (error) {
      console.error("Erro ao cadastrar departamento:", error)

      toast({
        title: "Erro ao cadastrar departamento",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar o departamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Departamento</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do departamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orcamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orçamento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => {
                      // Remove caracteres não numéricos, exceto ponto e vírgula
                      const value = e.target.value.replace(/[^\d.,]/g, "")
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormDescription>Informe o orçamento anual do departamento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localizacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade - UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição do departamento" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormDescription>Adicione uma breve descrição sobre o departamento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push("/departamentos")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Departamento"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
