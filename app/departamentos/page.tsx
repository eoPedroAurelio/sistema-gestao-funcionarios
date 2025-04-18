import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DepartmentList } from "@/components/departments/department-list"
import { Header } from "@/components/header"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Header title="Departamentos">
        <Link href="/departamentos/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Departamento
          </Button>
        </Link>
      </Header>

      <DepartmentList />
    </div>
  )
}
