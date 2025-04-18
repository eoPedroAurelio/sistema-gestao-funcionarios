import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get("tipo") || "salario"

  try {
    switch (tipo) {
      case "salario": {
        // Distribuição salarial por departamento e nível
        const result = await query(`
          SELECT 
            d.nome as name,
            ROUND(AVG(CASE WHEN f.cargo LIKE '%Júnior%' OR f.cargo LIKE '%Junior%' THEN f.salario ELSE NULL END)::numeric, 2) as junior,
            ROUND(AVG(CASE WHEN f.cargo LIKE '%Pleno%' THEN f.salario ELSE NULL END)::numeric, 2) as pleno,
            ROUND(AVG(CASE WHEN f.cargo LIKE '%Sênior%' OR f.cargo LIKE '%Senior%' THEN f.salario ELSE NULL END)::numeric, 2) as senior
          FROM departamentos d
          LEFT JOIN funcionarios f ON d.id = f.departamento_id
          GROUP BY d.nome
          ORDER BY d.nome
        `)

        // Substituir NULL por 0
        const data = result.rows.map((row) => ({
          name: row.name,
          junior: row.junior ? Number.parseFloat(row.junior) : 0,
          pleno: row.pleno ? Number.parseFloat(row.pleno) : 0,
          senior: row.senior ? Number.parseFloat(row.senior) : 0,
        }))

        return NextResponse.json(data)
      }

      case "idade": {
        // Distribuição por idade
        const result = await query(`
          SELECT 
            CASE 
              WHEN p.idade BETWEEN 18 AND 25 THEN '18-25 anos'
              WHEN p.idade BETWEEN 26 AND 35 THEN '26-35 anos'
              WHEN p.idade BETWEEN 36 AND 45 THEN '36-45 anos'
              WHEN p.idade BETWEEN 46 AND 55 THEN '46-55 anos'
              ELSE '56+ anos'
            END as name,
            COUNT(*) as value
          FROM perfis p
          GROUP BY name
          ORDER BY name
        `)

        return NextResponse.json(
          result.rows.map((row) => ({
            name: row.name,
            value: Number.parseInt(row.value),
          })),
        )
      }

      case "crescimento": {
        // Crescimento de funcionários por mês (últimos 6 meses)
        const result = await query(`
          WITH months AS (
            SELECT generate_series(
              date_trunc('month', NOW()) - interval '5 months',
              date_trunc('month', NOW()),
              interval '1 month'
            ) as month
          )
          SELECT 
            TO_CHAR(months.month, 'Mon') as name,
            COUNT(f.id) as employees
          FROM months
          LEFT JOIN funcionarios f ON 
            f.data_contratacao <= months.month + interval '1 month' - interval '1 day'
          GROUP BY months.month, name
          ORDER BY months.month
        `)

        return NextResponse.json(
          result.rows.map((row) => ({
            name: row.name,
            employees: Number.parseInt(row.employees),
          })),
        )
      }

      case "orcamento": {
        // Orçamento por departamento
        const result = await query(`
          SELECT 
            d.nome as name,
            d.orcamento as budget,
            COALESCE(SUM(f.salario * 12), 0) as spent
          FROM departamentos d
          LEFT JOIN funcionarios f ON d.id = f.departamento_id
          GROUP BY d.nome, d.orcamento
          ORDER BY d.nome
        `)

        return NextResponse.json(
          result.rows.map((row) => ({
            name: row.name,
            budget: Number.parseFloat(row.budget),
            spent: Number.parseFloat(row.spent),
          })),
        )
      }

      default:
        return NextResponse.json({ error: "Tipo de relatório inválido" }, { status: 400 })
    }
  } catch (error) {
    console.error(`Erro ao buscar relatório ${tipo}:`, error)
    return NextResponse.json({ error: `Erro ao buscar relatório ${tipo}` }, { status: 500 })
  }
}
