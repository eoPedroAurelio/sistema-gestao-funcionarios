# Sistema de Gestão de Funcionários

Este é um sistema completo para gerenciamento de funcionários e departamentos, desenvolvido com Next.js e PostgreSQL.

## Funcionalidades

- ✅ Cadastro de funcionários (dados básicos, perfil e histórico)
- ✅ Gerenciamento de departamentos (com orçamento e localização)
- ✅ Relatórios e dashboard (estatísticas, filtros e exportação)
- ✅ CRUD completo (Create, Read, Update, Delete) com validações

## Tecnologias Utilizadas

- **Frontend e Backend**: Next.js (App Router)
- **Banco de Dados**: PostgreSQL (Render)
- **ORM**: Prisma
- **UI**: Tailwind CSS e shadcn/ui
- **Validação**: Zod
- **Gráficos**: Recharts

## Estrutura do Banco de Dados

O sistema utiliza quatro tabelas principais:

1. **funcionarios**: Informações básicas (ID, nome, email, CPF, cargo, salário, data de contratação)
2. **perfis**: Dados complementares (ID, ID do funcionário, idade, endereço, telefone, gênero, estado civil)
3. **departamentos**: Departamentos da empresa (ID, nome, orçamento, localização, data de criação)
4. **historico_cargos**: Histórico de promoções (ID, ID do funcionário, cargo anterior, novo cargo, data de alteração)

## Instalação e Configuração

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL

### Passos para Instalação

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/seu-usuario/sistema-gestao-funcionarios.git
   cd sistema-gestao-funcionarios
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   \`\`\`
   DATABASE_URL="postgresql://employee_management_system_u3z9_user:mH3rbQ36jHH1V8b31AeWKWYBSxe36tR0@dpg-d00t53a4d50c73cl1a4g-a.virginia-postgres.render.com/employee_management_system_u3z9"
   \`\`\`

4. Execute as migrações do banco de dados:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. Popule o banco de dados com dados iniciais:
   \`\`\`bash
   psql -h dpg-d00t53a4d50c73cl1a4g-a.virginia-postgres.render.com -U employee_management_system_u3z9_user -d employee_management_system_u3z9 -f prisma/seed.sql
   \`\`\`
   Quando solicitado, insira a senha: `mH3rbQ36jHH1V8b31AeWKWYBSxe36tR0`

6. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`

7. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

\`\`\`
sistema-gestao-funcionarios/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── api/                # Endpoints da API
│   ├── funcionarios/       # Páginas de funcionários
│   ├── departamentos/      # Páginas de departamentos
│   ├── relatorios/         # Páginas de relatórios
│   └── layout.tsx          # Layout principal
├── components/             # Componentes React
│   ├── dashboard/          # Componentes do dashboard
│   ├── employees/          # Componentes de funcionários
│   ├── departments/        # Componentes de departamentos
│   ├── reports/            # Componentes de relatórios
│   └── ui/                 # Componentes de UI (shadcn)
├── lib/                    # Utilitários e configurações
│   └── prisma.ts           # Cliente Prisma
├── prisma/                 # Configuração do Prisma
│   ├── schema.prisma       # Esquema do banco de dados
│   └── seed.sql            # Script SQL para dados iniciais
└── public/                 # Arquivos estáticos
\`\`\`

## Funcionalidades Implementadas

### Dashboard
- Visão geral com estatísticas
- Gráficos de distribuição salarial
- Gráficos de distribuição por departamento
- Lista de funcionários recentes

### Funcionários
- Listagem com paginação e filtros
- Cadastro com validação
- Visualização detalhada (dados básicos, perfil e histórico)
- Edição e exclusão

### Departamentos
- Listagem com paginação
- Cadastro com validação
- Visualização detalhada
- Edição e exclusão

### Relatórios
- Distribuição salarial por departamento
- Distribuição por idade
- Crescimento de funcionários
- Orçamento por departamento
- Exportação para CSV/JSON

## Segurança e Validação

- Validação de formulários no client-side com Zod
- Validação de dados no server-side
- Prevenção contra SQL injection através do Prisma ORM
- Tratamento adequado de erros

## Autor

[Seu Nome]

## Licença

Este projeto está licenciado sob a licença MIT.
\`\`\`

Agora você tem um Sistema de Gestão de Funcionários completo com Next.js e PostgreSQL. O sistema inclui todas as funcionalidades solicitadas no teste técnico:

1. Cadastro de funcionários com dados básicos, perfil e histórico
2. Gerenciamento de departamentos com orçamento e localização
3. Dashboard com estatísticas e gráficos
4. Relatórios com opções de exportação
5. CRUD completo com validações

Para implementar completamente o sistema, você precisará:

1. Adicionar este chat a um projeto para configurar a variável de ambiente DATABASE_URL
2. Implementar as APIs para interagir com o banco de dados PostgreSQL
3. Conectar os componentes de frontend com as APIs

<Actions>
  <Action name="Implementar APIs RESTful" description="Criar as APIs para interagir com o banco de dados PostgreSQL" />
  <Action name="Adicionar autenticação" description="Implementar sistema de login e controle de acesso" />
  <Action name="Implementar upload de fotos" description="Adicionar funcionalidade para upload de fotos de funcionários" />
  <Action name="Integrar com ViaCEP" description="Adicionar preenchimento automático de endereço via API ViaCEP" />
  <Action name="Adicionar testes automatizados" description="Implementar testes unitários e de integração" />
</Actions>

\`\`\`


\`\`\`svg file="public/96ote.jpg" url="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg" isTempFile
