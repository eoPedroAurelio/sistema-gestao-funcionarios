import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/departamentos/[id] - Obter um departamento específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Buscar departamento
    const departamentoResult = await query(
      `
      SELECT 
        id, nome, orcamento, localizacao, data_criacao as "dataCriacao", descricao
      FROM departamentos
      WHERE id = $1
      `,
      [id],
    )

    if (departamentoResult.rows.length === 0) {
      return NextResponse.json({ error: "Departamento não encontrado" }, { status: 404 })
    }

    const departamento = departamentoResult.rows[0]

    // Buscar funcionários do departamento
    const funcionariosResult = await query(
      `
      SELECT 
        id, nome, email, cargo, salario
      FROM funcionarios
      WHERE departamento_id = $1
      ORDER BY nome
      `,
      [id],
    )

    const funcionarios = funcionariosResult.rows.map((row) => ({
      ...row,
      salario: Number.parseFloat(row.salario),
    }))

    return NextResponse.json({
      ...departamento,
      orcamento: Number.parseFloat(departamento.orcamento),
      funcionarios,
    })
  } catch (error) {
    console.error("Erro ao buscar departamento:", error)
    return NextResponse.json({ error: "Erro ao buscar departamento" }, { status: 500 })
  }
}

// PUT /api/departamentos/[id] - Atualizar um departamento
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Verificar se o departamento existe
    const checkResult = await query(`SELECT id FROM departamentos WHERE id = $1`, [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Departamento não encontrado" }, { status: 404 })
    }

    // Atualizar departamento
    const result = await query(
      `
      UPDATE departamentos
      SET nome = $1, orcamento = $2, localizacao = $3, descricao = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, nome, orcamento, localizacao, data_criacao as "dataCriacao", descricao
      `,
      [body.nome, Number.parseFloat(body.orcamento), body.localizacao, body.descricao || null, id],
    )

    const departamento = result.rows[0]

    // Contar funcionários
    const countResult = await query(`SELECT COUNT(*) as count FROM funcionarios WHERE departamento_id = $1`, [id])

    return NextResponse.json({
      ...departamento,
      orcamento: Number.parseFloat(departamento.orcamento),
      funcionariosCount: Number.parseInt(countResult.rows[0].count),
    })
  } catch (error) {
    console.error("Erro ao atualizar departamento:", error)
    return NextResponse.json({ error: "Erro ao atualizar departamento" }, { status: 500 })
  }
}

// DELETE /api/departamentos/[id] - Excluir um departamento
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verificar se o departamento existe
    const checkResult = await query(`SELECT id FROM departamentos WHERE id = $1`, [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Departamento não encontrado" }, { status: 404 })
    }

    // Verificar se existem funcionários associados a este departamento
    const funcionariosResult = await query(`SELECT COUNT(*) as count FROM funcionarios WHERE departamento_id = $1`, [
      id,
    ])

    if (Number.parseInt(funcionariosResult.rows[0].count) > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir o departamento porque existem funcionários associados a ele. Transfira ou remova os funcionários primeiro.",
        },
        { status: 400 },
      )
    }

    // Excluir departamento
    await query(`DELETE FROM departamentos WHERE id = $1`, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir departamento:", error)
    return NextResponse.json({ error: "Erro ao excluir departamento" }, { status: 500 })
  }
}
