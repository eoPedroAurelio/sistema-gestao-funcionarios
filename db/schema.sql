-- Criação das tabelas
CREATE TABLE IF NOT EXISTS departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  orcamento DECIMAL(15, 2) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  descricao TEXT,
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
