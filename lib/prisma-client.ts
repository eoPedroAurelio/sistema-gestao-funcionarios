// Este arquivo é usado para importação dinâmica do Prisma Client nas rotas de API
import { PrismaClient } from "@prisma/client"

// Criar uma nova instância do PrismaClient
const prismaClient = new PrismaClient({
  log: ["error", "warn"],
})

export default prismaClient
