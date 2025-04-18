import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentEmployees } from "@/components/dashboard/recent-employees"
import { DepartmentDistribution } from "@/components/dashboard/department-distribution"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Header } from "@/components/header"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <Header title="Dashboard" />

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Distribuição salarial dos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Departamento</CardTitle>
            <CardDescription>Número de funcionários por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentDistribution />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários Recentes</CardTitle>
          <CardDescription>Últimos funcionários adicionados ao sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentEmployees />
        </CardContent>
      </Card>
    </div>
  )
}
