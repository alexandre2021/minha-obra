-- Script SQL de Inicialização do ObraMaster no Supabase
-- Script SQL de Inicialização do Mais Obra no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com/dashboard/project/leaifcptyahjaytjpdyr/sql)

-- 1. Criar tabela de estado da obra
CREATE TABLE IF NOT EXISTS public.obras_state (
  id TEXT PRIMARY KEY DEFAULT 'main_obra',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar segurança a nível de linha (RLS)
ALTER TABLE public.obras_state ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso Público (Anon) para leitura e escrita
CREATE POLICY "Permitir leitura publica" 
ON public.obras_state FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Permitir insercao publica" 
ON public.obras_state FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualizacao publica" 
ON public.obras_state FOR UPDATE 
TO anon, authenticated 
USING (true);

-- 4. Habilitar Realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.obras_state;
