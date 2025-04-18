import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/departamentos - Listar todos os departamentos
export async function GET() {
  try {
    // Buscar departamentos com contagem de funcionários
    const result = await query(`
      SELECT 
        d.id, d.nome, d.orcamento, d.localizacao, d.data_criacao as "dataCriacao",
        COUNT(f.id) as "funcionariosCount"
      FROM departamentos d
      LEFT JOIN funcionarios f ON d.id = f.departamento_id
      GROUP BY d.id, d.nome, d.orcamento, d.localizacao, d.data_criacao
      ORDER BY d.nome
    `)

    const departamentos = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      orcamento: Number.parseFloat(row.orcamento),
      localizacao: row.localizacao,
      dataCriacao: row.dataCriacao,
      funcionariosCount: Number.parseInt(row.funcionariosCount),
    }))

    return NextResponse.json(departamentos)
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error)
    return NextResponse.json({ error: "Erro ao buscar departamentos" }, { status: 500 })
  }
}

// POST /api/departamentos - Criar um novo departamento
export async function POST(request: NextRequest) {
  try {
    // Obter o corpo da requisição como texto para debug
    const requestClone = request.clone()
    const bodyText = await requestClone.text()
    console.log("Corpo da requisição (texto):", bodyText)

    // Tentar fazer o parse do JSON
    let body
    try {
      body = JSON.parse(bodyText)
      console.log("Dados recebidos para criar departamento (parsed):", body)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        { error: "Formato de dados inválido", details: "O corpo da requisição não é um JSON válido" },
        { status: 400 },
      )
    }

    // Validar dados obrigatórios
    const camposObrigatorios = ["nome", "orcamento", "localizacao"]
    const camposFaltantes = camposObrigatorios.filter((campo) => !body[campo])

    if (camposFaltantes.length > 0) {
      console.error("Campos obrigatórios faltando:", camposFaltantes)
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${camposFaltantes.join(", ")}` },
        { status: 400 },
      )
    }

    // Inserir departamento
    const result = await query(
      `
      INSERT INTO departamentos (nome, orcamento, localizacao, data_criacao, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, orcamento, localizacao, data_criacao as "dataCriacao", descricao
      `,
      [body.nome, Number.parseFloat(body.orcamento), body.localizacao, new Date(), body.descricao || null],
    )

    const departamento = result.rows[0]

    return NextResponse.json(
      {
        ...departamento,
        orcamento: Number.parseFloat(departamento.orcamento),
        funcionariosCount: 0,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar departamento:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar departamento",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
