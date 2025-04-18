import { PrismaClient } from "@prisma/client"

// Declarar o prisma global para evitar múltiplas instâncias
declare global {
  var prisma: PrismaClient | undefined
}

// Função para criar uma nova instância do PrismaClient
function createPrismaClient() {
  return new PrismaClient({
    log: ["error", "warn"],
  })
}

// Inicializar o PrismaClient (evitando múltiplas instâncias em desenvolvimento)
export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
