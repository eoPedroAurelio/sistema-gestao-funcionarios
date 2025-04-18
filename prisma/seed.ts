import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create departments
  const departments = await Promise.all([
    prisma.departamento.upsert({
      where: { id: "11111111-1111-1111-1111-111111111111" },
      update: {},
      create: {
        id: "11111111-1111-1111-1111-111111111111",
        nome: "TI",
        orcamento: 850000.0,
        localizacao: "São Paulo - SP",
        dataCriacao: new Date("2020-01-10"),
      },
    }),
    prisma.departamento.upsert({
      where: { id: "22222222-2222-2222-2222-222222222222" },
      update: {},
      create: {
        id: "22222222-2222-2222-2222-222222222222",
        nome: "Marketing",
        orcamento: 450000.0,
        localizacao: "São Paulo - SP",
        dataCriacao: new Date("2020-02-15"),
      },
    }),
    prisma.departamento.upsert({
      where: { id: "33333333-3333-3333-3333-333333333333" },
      update: {},
      create: {
        id: "33333333-3333-3333-3333-333333333333",
        nome: "Vendas",
        orcamento: 650000.0,
        localizacao: "Rio de Janeiro - RJ",
        dataCriacao: new Date("2020-03-05"),
      },
    }),
  ])

  console.log("Created departments:", departments)

  // Create supervisors
  const supervisors = await Promise.all([
    prisma.funcionario.upsert({
      where: { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
      update: {},
      create: {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        nome: "Carlos Mendes",
        email: "carlos.mendes@empresa.com",
        cpf: "111.222.333-44",
        cargo: "Gerente de TI",
        salario: 12000.0,
        dataContratacao: new Date("2020-01-15"),
        departamentoId: "11111111-1111-1111-1111-111111111111",
      },
    }),
    prisma.funcionario.upsert({
      where: { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
      update: {},
      create: {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        nome: "Fernanda Souza",
        email: "fernanda.souza@empresa.com",
        cpf: "222.333.444-55",
        cargo: "Gerente de Marketing",
        salario: 11000.0,
        dataContratacao: new Date("2020-02-20"),
        departamentoId: "22222222-2222-2222-2222-222222222222",
      },
    }),
  ])

  console.log("Created supervisors:", supervisors)

  // Create employees
  const employees = await Promise.all([
    prisma.funcionario.upsert({
      where: { id: "dddddddd-dddd-dddd-dddd-dddddddddddd" },
      update: {},
      create: {
        id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        nome: "João Silva",
        email: "joao.silva@empresa.com",
        cpf: "123.456.789-00",
        cargo: "Desenvolvedor Full Stack",
        salario: 6500.0,
        dataContratacao: new Date("2023-04-15"),
        departamentoId: "11111111-1111-1111-1111-111111111111",
        supervisorId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    }),
    prisma.funcionario.upsert({
      where: { id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee" },
      update: {},
      create: {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
        nome: "Maria Oliveira",
        email: "maria.oliveira@empresa.com",
        cpf: "987.654.321-00",
        cargo: "Analista de Marketing",
        salario: 4800.0,
        dataContratacao: new Date("2023-04-22"),
        departamentoId: "22222222-2222-2222-2222-222222222222",
        supervisorId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      },
    }),
  ])

  console.log("Created employees:", employees)

  // Create profiles
  const profiles = await Promise.all([
    prisma.perfil.upsert({
      where: { funcionarioId: "dddddddd-dddd-dddd-dddd-dddddddddddd" },
      update: {},
      create: {
        funcionarioId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        idade: 32,
        endereco: "Rua das Flores, 123, Jardim Primavera, São Paulo - SP, CEP: 01234-567",
        telefone: "(11) 98765-4321",
        genero: "Masculino",
        estadoCivil: "Casado",
      },
    }),
    prisma.perfil.upsert({
      where: { funcionarioId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee" },
      update: {},
      create: {
        funcionarioId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
        idade: 28,
        endereco: "Av. Paulista, 1000, Bela Vista, São Paulo - SP, CEP: 01310-100",
        telefone: "(11) 91234-5678",
        genero: "Feminino",
        estadoCivil: "Solteiro",
      },
    }),
  ])

  console.log("Created profiles:", profiles)

  // Create job history
  const jobHistory = await Promise.all([
    prisma.historicoCargo.create({
      data: {
        funcionarioId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        cargoAnterior: "Desenvolvedor Front-end",
        novoCargo: "Desenvolvedor Full Stack",
        dataAlteracao: new Date("2023-01-15"),
        motivo: "Promoção",
        aprovadoPor: "Carlos Mendes",
      },
    }),
    prisma.historicoCargo.create({
      data: {
        funcionarioId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        cargoAnterior: "Desenvolvedor Júnior",
        novoCargo: "Desenvolvedor Front-end",
        dataAlteracao: new Date("2022-07-10"),
        motivo: "Promoção",
        aprovadoPor: "Carlos Mendes",
      },
    }),
  ])

  console.log("Created job history:", jobHistory)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
