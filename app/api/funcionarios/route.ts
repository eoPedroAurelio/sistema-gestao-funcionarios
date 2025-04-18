import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/funcionarios - Listar todos os funcionários
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT 
        f.id, f.nome, f.email, f.cpf, f.cargo, f.salario, f.data_contratacao as "dataContratacao",
        f.departamento_id as "departamentoId", d.nome as "departamentoNome"
      FROM funcionarios f
      JOIN departamentos d ON f.departamento_id = d.id
      ORDER BY f.nome
    `)

    const funcionarios = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cpf: row.cpf,
      cargo: row.cargo,
      salario: Number.parseFloat(row.salario),
      dataContratacao: row.dataContratacao,
      departamento: {
        id: row.departamentoId,
        nome: row.departamentoNome,
      },
    }))

    return NextResponse.json(funcionarios)
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error)
    return NextResponse.json({ error: "Erro ao buscar funcionários" }, { status: 500 })
  }
}

// POST /api/funcionarios - Criar um novo funcionário
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
      console.log("Dados recebidos para criar funcionário (parsed):", body)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        { error: "Formato de dados inválido", details: "O corpo da requisição não é um JSON válido" },
        { status: 400 },
      )
    }

    // Validar dados obrigatórios
    const camposObrigatorios = ["nome", "email", "cpf", "cargo", "salario", "dataContratacao", "departamentoId"]
    const camposFaltantes = camposObrigatorios.filter((campo) => !body[campo])

    if (camposFaltantes.length > 0) {
      console.error("Campos obrigatórios faltando:", camposFaltantes)
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${camposFaltantes.join(", ")}` },
        { status: 400 },
      )
    }

    // Verificar se o departamento existe
    const departamentoResult = await query(`SELECT id, nome FROM departamentos WHERE id = $1`, [body.departamentoId])

    if (departamentoResult.rows.length === 0) {
      console.error("Departamento não encontrado:", body.departamentoId)
      return NextResponse.json({ error: "Departamento não encontrado" }, { status: 400 })
    }

    // Verificar se o supervisor existe (se fornecido)
    if (body.supervisorId && body.supervisorId !== "none") {
      const supervisorResult = await query(`SELECT id FROM funcionarios WHERE id = $1`, [body.supervisorId])

      if (supervisorResult.rows.length === 0) {
        console.error("Supervisor não encontrado:", body.supervisorId)
        return NextResponse.json({ error: "Supervisor não encontrado" }, { status: 400 })
      }
    }

    // Verificar se o email já existe
    const emailResult = await query(`SELECT id FROM funcionarios WHERE email = $1`, [body.email])

    if (emailResult.rows.length > 0) {
      console.error("Email já cadastrado:", body.email)
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Verificar se o CPF já existe
    const cpfResult = await query(`SELECT id FROM funcionarios WHERE cpf = $1`, [body.cpf])

    if (cpfResult.rows.length > 0) {
      console.error("CPF já cadastrado:", body.cpf)
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 400 })
    }

    console.log("Iniciando inserção do funcionário no banco de dados")

    // Inserir funcionário
    const funcionarioResult = await query(
      `
      INSERT INTO funcionarios (
        nome, email, cpf, cargo, salario, data_contratacao, departamento_id, supervisor_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nome, email, cpf, cargo, salario, data_contratacao as "dataContratacao", departamento_id as "departamentoId"
      `,
      [
        body.nome,
        body.email,
        body.cpf,
        body.cargo,
        Number.parseFloat(body.salario),
        new Date(body.dataContratacao),
        body.departamentoId,
        body.supervisorId === "none" ? null : body.supervisorId,
      ],
    )

    console.log("Funcionário inserido com sucesso:", funcionarioResult.rows[0])
    const funcionario = funcionarioResult.rows[0]

    // Se houver dados de perfil, inserir perfil
    if (body.idade && body.endereco && body.telefone && body.genero && body.estadoCivil) {
      console.log("Inserindo perfil do funcionário")

      await query(
        `
        INSERT INTO perfis (
          funcionario_id, idade, endereco, telefone, genero, estado_civil
        ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [funcionario.id, Number.parseInt(body.idade), body.endereco, body.telefone, body.genero, body.estadoCivil],
      )

      console.log("Perfil inserido com sucesso")
    }

    return NextResponse.json(
      {
        ...funcionario,
        departamento: {
          id: funcionario.departamentoId,
          nome: departamentoResult.rows[0].nome,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar funcionário:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar funcionário",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
