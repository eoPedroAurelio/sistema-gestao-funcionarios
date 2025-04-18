import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeForm } from "@/components/employees/employee-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewEmployeePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/funcionarios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Novo Funcionário</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Funcionário</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo funcionário</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  )
}
