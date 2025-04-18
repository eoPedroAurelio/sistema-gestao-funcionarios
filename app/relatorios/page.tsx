import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalaryDistributionChart } from "@/components/reports/salary-distribution-chart"
import { AgeDistributionChart } from "@/components/reports/age-distribution-chart"
import { EmployeeGrowthChart } from "@/components/reports/employee-growth-chart"
import { DepartmentBudgetChart } from "@/components/reports/department-budget-chart"
import { ReportExport } from "@/components/reports/report-export"
import { Header } from "@/components/header"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Header title="Relatórios">
        <ReportExport />
      </Header>

      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salary">Distribuição Salarial</TabsTrigger>
          <TabsTrigger value="age">Distribuição por Idade</TabsTrigger>
          <TabsTrigger value="growth">Crescimento</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
        </TabsList>

        <TabsContent value="salary" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Salarial por Departamento</CardTitle>
              <CardDescription>Análise da distribuição salarial entre os departamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <SalaryDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Idade</CardTitle>
              <CardDescription>Análise da distribuição de idade dos funcionários por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <AgeDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Funcionários</CardTitle>
              <CardDescription>Análise do crescimento do número de funcionários ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeGrowthChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento por Departamento</CardTitle>
              <CardDescription>Análise do orçamento alocado para cada departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentBudgetChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
