-- ===============================================================
-- SCRIPT SQL: MODELO RELACIONAL COMPLETO - MINHA OBRA (SUPABASE)
-- Execute este script no SQL Editor do seu projeto Supabase
-- https://supabase.com/dashboard/project/leaifcptyahjaytjpdyr/sql
-- ===============================================================

-- 1. Limpeza de tabelas anteriores (se existirem)
-- Garante que começaremos com uma estrutura limpa.
-- A partir de agora, usaremos comandos que não destroem os dados,
-- como CREATE TABLE IF NOT EXISTS e ALTER TABLE.

-- 2. Tabela Principal da Obra
CREATE TABLE IF NOT EXISTS public.obras (
  id TEXT PRIMARY KEY DEFAULT 'obra_principal',
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  proprietario TEXT,
  engenheiro TEXT,
  arquiteto TEXT,
  data_inicio DATE,
  data_prevista_fim DATE,
  orcamento_total NUMERIC(12, 2) DEFAULT 0,
  area_construida NUMERIC(8, 2) DEFAULT 0,
  status TEXT DEFAULT 'Em Andamento',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Etapas do Cronograma
CREATE TABLE IF NOT EXISTS public.etapas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  obra_id TEXT REFERENCES public.obras(id) ON DELETE CASCADE DEFAULT 'obra_principal',
  ordem INT DEFAULT 1,
  nome TEXT NOT NULL,
  status TEXT DEFAULT 'Não Iniciada',
  data_inicio DATE,
  data_fim DATE,
  responsavel TEXT,
  valor_planejado NUMERIC(12, 2) DEFAULT 0,
  valor_realizado NUMERIC(12, 2) DEFAULT 0
);

-- 4. Tabela de Subtarefas (Checklist por Etapa)
CREATE TABLE IF NOT EXISTS public.subtarefas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  etapa_id BIGINT REFERENCES public.etapas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  ordem INT DEFAULT 0,
  progresso INT DEFAULT 0,
  executor TEXT
);

-- 5. Tabela de Observações por Tarefa (Histórico)
CREATE TABLE IF NOT EXISTS public.tarefa_observacoes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subtarefa_id BIGINT REFERENCES public.subtarefas(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  imagens_urls TEXT[] DEFAULT '{}',
  autor TEXT, -- Opcional: para futuras implementações de usuário
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===============================================================
-- HABILITAR SEGURANÇA E POLÍTICAS DE ACESSO (RLS)
-- ===============================================================

ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefa_observacoes ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas antes de criar novas para evitar conflitos
DROP POLICY IF EXISTS "Acesso Total para usuários autenticados" ON public.obras;
DROP POLICY IF EXISTS "Acesso Total para usuários autenticados" ON public.etapas;
DROP POLICY IF EXISTS "Acesso Total para usuários autenticados" ON public.subtarefas;
DROP POLICY IF EXISTS "Acesso Total para usuários autenticados" ON public.tarefa_observacoes;

-- Políticas de Acesso para usuários autenticados
CREATE POLICY "Acesso Total para usuários autenticados" ON public.obras FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total para usuários autenticados" ON public.etapas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total para usuários autenticados" ON public.subtarefas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total para usuários autenticados" ON public.tarefa_observacoes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===============================================================
-- POLÍTICAS DE ACESSO PARA O STORAGE (IMAGENS)
-- Permite que usuários autenticados façam upload, visualizem e deletem arquivos no bucket 'imagens'.
-- ===============================================================
DROP POLICY IF EXISTS "Permitir acesso total para usuários autenticados" ON storage.objects;
CREATE POLICY "Permitir acesso total para usuários autenticados" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'imagens') WITH CHECK (bucket_id = 'imagens');

-- Adiciona as tabelas à publicação de tempo real se ainda não estiverem lá.
-- Usamos um bloco DO para evitar erros caso a publicação já contenha as tabelas.
DO $$
BEGIN
  -- Tenta adicionar as tabelas. Se já forem membros, a operação é ignorada.
  ALTER PUBLICATION supabase_realtime ADD TABLE public.obras, public.etapas, public.subtarefas, public.tarefa_observacoes;
EXCEPTION
  -- Ignora o erro se as tabelas já forem membros da publicação.
  WHEN duplicate_object THEN
    RAISE NOTICE 'Tabelas já são membros da publicação supabase_realtime.';
END $$;
