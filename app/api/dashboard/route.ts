import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Estatísticas gerais
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM funcionarios) as "totalFuncionarios",
        (SELECT AVG(salario) FROM funcionarios) as "mediaSalarial",
        (SELECT COUNT(*) FROM departamentos) as "totalDepartamentos",
        (SELECT COUNT(*) FROM funcionarios WHERE data_contratacao >= NOW() - INTERVAL '30 days') as "contratacoesRecentes"
    `)

    const stats = statsResult.rows[0]

    // Distribuição por departamento
    const departamentosResult = await query(`
      SELECT 
        d.nome as name,
        COUNT(f.id) as value
      FROM departamentos d
      LEFT JOIN funcionarios f ON d.id = f.departamento_id
      GROUP BY d.nome
      ORDER BY d.nome
    `)

    // Distribuição salarial por mês (últimos 6 meses)
    const salariosResult = await query(`
      SELECT 
        TO_CHAR(date_trunc('month', data_contratacao), 'Mon') as name,
        EXTRACT(MONTH FROM data_contratacao) as month_num,
        ROUND(AVG(salario)::numeric, 2) as total
      FROM funcionarios
      WHERE data_contratacao >= NOW() - INTERVAL '6 months'
      GROUP BY date_trunc('month', data_contratacao), EXTRACT(MONTH FROM data_contratacao)
      ORDER BY month_num
    `)

    return NextResponse.json({
      totalFuncionarios: Number.parseInt(stats.totalFuncionarios),
      mediaSalarial: Number.parseFloat(stats.mediaSalarial),
      totalDepartamentos: Number.parseInt(stats.totalDepartamentos),
      contratacoesRecentes: Number.parseInt(stats.contratacoesRecentes),
      distribuicaoDepartamentos: departamentosResult.rows,
      distribuicaoSalarial: salariosResult.rows,
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      {
        totalFuncionarios: 0,
        mediaSalarial: 0,
        totalDepartamentos: 0,
        contratacoesRecentes: 0,
        distribuicaoDepartamentos: [],
        distribuicaoSalarial: [],
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
