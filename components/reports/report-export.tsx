"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileJson, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ReportExport() {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true)

    try {
      // Buscar dados de todos os relatórios
      const [salarioData, idadeData, crescimentoData, orcamentoData] = await Promise.all([
        fetch("/api/relatorios?tipo=salario").then((res) => res.json()),
        fetch("/api/relatorios?tipo=idade").then((res) => res.json()),
        fetch("/api/relatorios?tipo=crescimento").then((res) => res.json()),
        fetch("/api/relatorios?tipo=orcamento").then((res) => res.json()),
      ])

      // Combinar todos os dados em um único objeto
      const allData = {
        salario: salarioData,
        idade: idadeData,
        crescimento: crescimentoData,
        orcamento: orcamentoData,
      }

      // Converter para o formato desejado
      let content: string
      let mimeType: string
      let fileExtension: string

      if (format === "json") {
        content = JSON.stringify(allData, null, 2)
        mimeType = "application/json"
        fileExtension = "json"
      } else {
        // Converter para CSV (simplificado)
        const csvRows = []

        // Cabeçalho para dados de salário
        csvRows.push(["Relatório de Distribuição Salarial"])
        csvRows.push(["Departamento", "Júnior", "Pleno", "Sênior"])
        salarioData.forEach((item: any) => {
          csvRows.push([item.name, item.junior, item.pleno, item.senior])
        })

        csvRows.push([]) // Linha em branco

        // Cabeçalho para dados de idade
        csvRows.push(["Relatório de Distribuição por Idade"])
        csvRows.push(["Faixa Etária", "Quantidade"])
        idadeData.forEach((item: any) => {
          csvRows.push([item.name, item.value])
        })

        csvRows.push([]) // Linha em branco

        // Cabeçalho para dados de crescimento
        csvRows.push(["Relatório de Crescimento de Funcionários"])
        csvRows.push(["Mês", "Total de Funcionários"])
        crescimentoData.forEach((item: any) => {
          csvRows.push([item.name, item.employees])
        })

        csvRows.push([]) // Linha em branco

        // Cabeçalho para dados de orçamento
        csvRows.push(["Relatório de Orçamento por Departamento"])
        csvRows.push(["Departamento", "Orçamento", "Gasto"])
        orcamentoData.forEach((item: any) => {
          csvRows.push([item.name, item.budget, item.spent])
        })

        content = csvRows.map((row) => row.join(",")).join("\n")
        mimeType = "text/csv"
        fileExtension = "csv"
      }

      // Criar e baixar o arquivo
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio_funcionarios.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Relatório exportado com sucesso!",
        description: `O relatório foi exportado no formato ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error(`Erro ao exportar relatório em ${format}:`, error)
      toast({
        title: "Erro ao exportar relatório",
        description: "Ocorreu um erro ao exportar o relatório. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exportando..." : "Exportar Relatório"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar como CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          <span>Exportar como JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
