import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/funcionarios/[id] - Obter um funcionário específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Buscar funcionário
    const funcionarioResult = await query(
      `
      SELECT 
        f.id, f.nome, f.email, f.cpf, f.cargo, f.salario, 
        f.data_contratacao as "dataContratacao", f.departamento_id as "departamentoId",
        f.supervisor_id as "supervisorId", d.nome as "departamentoNome"
      FROM funcionarios f
      JOIN departamentos d ON f.departamento_id = d.id
      WHERE f.id = $1
      `,
      [id],
    )

    if (funcionarioResult.rows.length === 0) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
    }

    const funcionario = funcionarioResult.rows[0]

    // Buscar supervisor se existir
    let supervisor = null
    if (funcionario.supervisorId) {
      const supervisorResult = await query(`SELECT id, nome FROM funcionarios WHERE id = $1`, [
        funcionario.supervisorId,
      ])
      if (supervisorResult.rows.length > 0) {
        supervisor = supervisorResult.rows[0]
      }
    }

    // Buscar perfil
    const perfilResult = await query(`SELECT * FROM perfis WHERE funcionario_id = $1`, [id])
    const perfil = perfilResult.rows.length > 0 ? perfilResult.rows[0] : null

    // Buscar histórico de cargos
    const historicoResult = await query(
      `
      SELECT 
        id, cargo_anterior as "cargoAnterior", novo_cargo as "novoCargo",
        data_alteracao as "dataAlteracao", motivo, aprovado_por as "aprovadoPor"
      FROM historico_cargos
      WHERE funcionario_id = $1
      ORDER BY data_alteracao DESC
      `,
      [id],
    )
    const historicoCargos = historicoResult.rows

    return NextResponse.json({
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      cpf: funcionario.cpf,
      cargo: funcionario.cargo,
      salario: Number.parseFloat(funcionario.salario),
      dataContratacao: funcionario.dataContratacao,
      departamento: {
        id: funcionario.departamentoId,
        nome: funcionario.departamentoNome,
      },
      supervisor,
      perfil,
      historicoCargos,
    })
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error)
    return NextResponse.json({ error: "Erro ao buscar funcionário" }, { status: 500 })
  }
}

// PUT /api/funcionarios/[id] - Atualizar um funcionário
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Verificar se o funcionário existe
    const checkResult = await query(`SELECT id FROM funcionarios WHERE id = $1`, [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
    }

    // Atualizar funcionário
    await query(
      `
      UPDATE funcionarios
      SET nome = $1, email = $2, cpf = $3, cargo = $4, salario = $5, 
          data_contratacao = $6, departamento_id = $7, supervisor_id = $8,
          updated_at = NOW()
      WHERE id = $9
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
        id,
      ],
    )

    // Atualizar ou inserir perfil
    if (body.idade && body.endereco && body.telefone && body.genero && body.estadoCivil) {
      // Verificar se o perfil existe
      const perfilResult = await query(`SELECT id FROM perfis WHERE funcionario_id = $1`, [id])

      if (perfilResult.rows.length > 0) {
        // Atualizar perfil existente
        await query(
          `
          UPDATE perfis
          SET idade = $1, endereco = $2, telefone = $3, genero = $4, estado_civil = $5, updated_at = NOW()
          WHERE funcionario_id = $6
          `,
          [Number.parseInt(body.idade), body.endereco, body.telefone, body.genero, body.estadoCivil, id],
        )
      } else {
        // Inserir novo perfil
        await query(
          `
          INSERT INTO perfis (funcionario_id, idade, endereco, telefone, genero, estado_civil)
          VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [id, Number.parseInt(body.idade), body.endereco, body.telefone, body.genero, body.estadoCivil],
        )
      }
    }

    // Buscar funcionário atualizado
    const funcionarioResult = await query(
      `
      SELECT 
        f.id, f.nome, f.email, f.cpf, f.cargo, f.salario, 
        f.data_contratacao as "dataContratacao", f.departamento_id as "departamentoId",
        d.nome as "departamentoNome"
      FROM funcionarios f
      JOIN departamentos d ON f.departamento_id = d.id
      WHERE f.id = $1
      `,
      [id],
    )

    const funcionario = funcionarioResult.rows[0]

    return NextResponse.json({
      ...funcionario,
      salario: Number.parseFloat(funcionario.salario),
      departamento: {
        id: funcionario.departamentoId,
        nome: funcionario.departamentoNome,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error)
    return NextResponse.json({ error: "Erro ao atualizar funcionário" }, { status: 500 })
  }
}

// DELETE /api/funcionarios/[id] - Excluir um funcionário
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verificar se o funcionário existe
    const checkResult = await query(`SELECT id FROM funcionarios WHERE id = $1`, [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
    }

    // Excluir funcionário (as tabelas relacionadas serão excluídas em cascata)
    await query(`DELETE FROM funcionarios WHERE id = $1`, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error)
    return NextResponse.json({ error: "Erro ao excluir funcionário" }, { status: 500 })
  }
}
