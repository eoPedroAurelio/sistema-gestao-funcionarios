import { Pool } from "pg"

// Criar um pool de conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
})

// Função para executar consultas SQL
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Função para testar a conexão com o banco de dados
export async function testConnection() {
  try {
    await pool.query("SELECT 1")
    return { connected: true, result: "Teste de conexão bem-sucedido" }
  } catch (error) {
    console.error("Erro ao testar conexão:", error)
    return { connected: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Exportar o pool para uso em outros lugares
export { pool }
