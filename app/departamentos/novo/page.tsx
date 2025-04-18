import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DepartmentForm } from "@/components/departments/department-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewDepartmentPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/departamentos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Novo Departamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Departamento</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo departamento</CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentForm />
        </CardContent>
      </Card>
    </div>
  )
}
