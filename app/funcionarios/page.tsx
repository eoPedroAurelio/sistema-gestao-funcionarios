import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { EmployeeList } from "@/components/employees/employee-list"
import { EmployeeFilters } from "@/components/employees/employee-filters"
import { Header } from "@/components/header"

export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-4">
      <Header title="Funcionários">
        <Link href="/funcionarios/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </Link>
      </Header>

      <EmployeeFilters />
      <EmployeeList />
    </div>
  )
}
