import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeDetails } from "@/components/employees/employee-details"
import { EmployeeProfile } from "@/components/employees/employee-profile"
import { EmployeeHistory } from "@/components/employees/employee-history"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/funcionarios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Funcionário</h1>
        </div>
        <Link href={`/funcionarios/${params.id}/editar`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Editar Funcionário
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Dados Básicos</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Funcionário</CardTitle>
              <CardDescription>Dados básicos do funcionário</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeDetails id={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Funcionário</CardTitle>
              <CardDescription>Informações complementares do funcionário</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeProfile id={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cargos</CardTitle>
              <CardDescription>Histórico de promoções e mudanças de cargo</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeHistory id={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
