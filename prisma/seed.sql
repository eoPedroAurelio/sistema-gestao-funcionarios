-- Criação das tabelas
CREATE TABLE IF NOT EXISTS departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  orcamento DECIMAL(15, 2) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  salario DECIMAL(15, 2) NOT NULL,
  data_contratacao TIMESTAMP NOT NULL,
  departamento_id UUID NOT NULL,
  supervisor_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id),
  FOREIGN KEY (supervisor_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID UNIQUE NOT NULL,
  idade INTEGER NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  genero VARCHAR(50) NOT NULL,
  estado_civil VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historico_cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID NOT NULL,
  cargo_anterior VARCHAR(255) NOT NULL,
  novo_cargo VARCHAR(255) NOT NULL,
  data_alteracao TIMESTAMP NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  aprovado_por VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
);

-- Inserção de dados de exemplo
-- Departamentos
INSERT INTO departamentos (id, nome, orcamento, localizacao, data_criacao)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'TI', 850000.00, 'São Paulo - SP', '2020-01-10'),
  ('22222222-2222-2222-2222-222222222222', 'Marketing', 450000.00, 'São Paulo - SP', '2020-02-15'),
  ('33333333-3333-3333-3333-333333333333', 'Vendas', 650000.00, 'Rio de Janeiro - RJ', '2020-03-05'),
  ('44444444-4444-4444-4444-444444444444', 'RH', 350000.00, 'São Paulo - SP', '2020-03-20'),
  ('55555555-5555-5555-5555-555555555555', 'Financeiro', 400000.00, 'São Paulo - SP', '2020-04-10'),
  ('66666666-6666-6666-6666-666666666666', 'Operações', 550000.00, 'Belo Horizonte - MG', '2020-05-15');

-- Funcionários (Supervisores primeiro)
INSERT INTO funcionarios (id, nome, email, cpf, cargo, salario, data_contratacao, departamento_id, supervisor_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Carlos Mendes', 'carlos.mendes@empresa.com', '111.222.333-44', 'Gerente de TI', 12000.00, '2020-01-15', '11111111-1111-1111-1111-111111111111', NULL),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fernanda Souza', 'fernanda.souza@empresa.com', '222.333.444-55', 'Gerente de Marketing', 11000.00, '2020-02-20', '22222222-2222-2222-2222-222222222222', NULL),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ricardo Alves', 'ricardo.alves@empresa.com', '333.444.555-66', 'Gerente de Vendas', 11500.00, '2020-03-10', '33333333-3333-3333-3333-333333333333', NULL);

-- Funcionários (Subordinados)
INSERT INTO funcionarios (id, nome, email, cpf, cargo, salario, data_contratacao, departamento_id, supervisor_id)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'João Silva', 'joao.silva@empresa.com', '123.456.789-00', 'Desenvolvedor Full Stack', 6500.00, '2023-04-15', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Maria Oliveira', 'maria.oliveira@empresa.com', '987.654.321-00', 'Analista de Marketing', 4800.00, '2023-04-22', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Pedro Santos', 'pedro.santos@empresa.com', '456.789.123-00', 'Gerente de Vendas', 8200.00, '2023-05-03', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Ana Costa', 'ana.costa@empresa.com', '789.123.456-00', 'Analista de RH', 4500.00, '2023-05-10', '44444444-4444-4444-4444-444444444444', NULL),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Lucas Ferreira', 'lucas.ferreira@empresa.com', '321.654.987-00', 'Analista Financeiro', 5200.00, '2023-05-17', '55555555-5555-5555-5555-555555555555', NULL);

-- Perfis
INSERT INTO perfis (funcionario_id, idade, endereco, telefone, genero, estado_civil)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 32, 'Rua das Flores, 123, Jardim Primavera, São Paulo - SP, CEP: 01234-567', '(11) 98765-4321', 'Masculino', 'Casado'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 28, 'Av. Paulista, 1000, Bela Vista, São Paulo - SP, CEP: 01310-100', '(11) 91234-5678', 'Feminino', 'Solteiro'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 35, 'Rua Copacabana, 500, Copacabana, Rio de Janeiro - RJ, CEP: 22020-001', '(21) 99876-5432', 'Masculino', 'Casado'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 30, 'Rua Augusta, 200, Consolação, São Paulo - SP, CEP: 01305-000', '(11) 97654-3210', 'Feminino', 'Solteiro'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 27, 'Av. Rebouças, 1234, Pinheiros, São Paulo - SP, CEP: 05402-000', '(11) 95678-1234', 'Masculino', 'Solteiro');

-- Histórico de Cargos
INSERT INTO historico_cargos (funcionario_id, cargo_anterior, novo_cargo, data_alteracao, motivo, aprovado_por)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Desenvolvedor Front-end', 'Desenvolvedor Full Stack', '2023-01-15', 'Promoção', 'Carlos Mendes'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Desenvolvedor Júnior', 'Desenvolvedor Front-end', '2022-07-10', 'Promoção', 'Carlos Mendes'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Estagiário', 'Desenvolvedor Júnior', '2022-01-05', 'Efetivação', 'Fernanda Souza');
