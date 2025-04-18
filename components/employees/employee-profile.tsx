"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

type Perfil = {
  id: string
  idade: number
  endereco: string
  telefone: string
  genero: string
  estadoCivil: string
}

export function EmployeeProfile({ id }: { id: string }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPerfil()
  }, [id])

  const fetchPerfil = async () => {
    try {
      const response = await fetch(`/api/funcionarios/${id}`)
      if (!response.ok) {
        throw new Error("Erro ao buscar perfil")
      }
      const data = await response.json()
      setPerfil(data.perfil)
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Perfil não encontrado</p>
      </div>
    )
  }

  // Dados simulados para habilidades e idiomas
  const skills = ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git"]
  const languages = ["Português (Nativo)", "Inglês (Avançado)", "Espanhol (Básico)"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Informações Pessoais</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Idade:</span>
                  <span>{perfil.idade} anos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gênero:</span>
                  <span>{perfil.genero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado Civil:</span>
                  <span>{perfil.estadoCivil}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Contato</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span>{perfil.telefone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contato de Emergência:</span>
                  <span>Maria Silva - (11) 91234-5678</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Endereço</h3>
              <p>{perfil.endereco}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Formação</h3>
              <p>Bacharelado em Ciência da Computação</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Idiomas</h3>
              <ul className="list-disc pl-5">
                {languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
