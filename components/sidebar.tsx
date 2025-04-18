"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Building2, FileText, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Funcionários",
      icon: Users,
      href: "/funcionarios",
      active: pathname.includes("/funcionarios"),
    },
    {
      label: "Departamentos",
      icon: Building2,
      href: "/departamentos",
      active: pathname.includes("/departamentos"),
    },
    {
      label: "Relatórios",
      icon: FileText,
      href: "/relatorios",
      active: pathname.includes("/relatorios"),
    },
    {
      label: "Estatísticas",
      icon: BarChart3,
      href: "/estatisticas",
      active: pathname.includes("/estatisticas"),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
          <span className="ml-2 font-semibold">Sistema de Gestão</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={route.active} tooltip={route.label}>
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p>© 2025 Sistema de Gestão</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
