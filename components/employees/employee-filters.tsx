"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal, Download } from "lucide-react"

export function EmployeeFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("")
  const [position, setPosition] = useState("")
  const [salaryRange, setSalaryRange] = useState([0, 10000])

  // Dados de exemplo - em uma implementação real, viriam do banco de dados
  const departments = ["TI", "Marketing", "Vendas", "RH", "Financeiro", "Operações"]
  const positions = [
    "Desenvolvedor Full Stack",
    "Analista de Marketing",
    "Gerente de Vendas",
    "Analista de RH",
    "Analista Financeiro",
    "UX Designer",
    "Gerente de Operações",
    "Social Media",
    "Representante de Vendas",
    "Recrutadora",
  ]

  const handleSearch = () => {
    // Em uma implementação real, isso filtraria os dados
    console.log("Pesquisando por:", { searchTerm, department, position, salaryRange })
  }

  const handleExport = () => {
    // Em uma implementação real, isso exportaria os dados para CSV/JSON
    console.log("Exportando dados...")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar funcionário..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros Avançados</SheetTitle>
              <SheetDescription>Refine sua busca com filtros avançados</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Cargo</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os cargos</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Faixa Salarial</Label>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>R$ {salaryRange[0].toLocaleString()}</span>
                    <span>R$ {salaryRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSearch}>Aplicar Filtros</Button>
            </div>
          </SheetContent>
        </Sheet>

        <Button variant="outline" size="icon" onClick={handleExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
