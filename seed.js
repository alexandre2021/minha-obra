import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Substitua pelas suas chaves do Supabase.
// É seguro mantê-las aqui para um script de desenvolvimento, mas nunca as exponha no lado do cliente em produção.
const supabaseUrl = 'https://leaifcptyahjaytjpdyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWlmY3B0eWFoamF5dGpwZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzAzODcsImV4cCI6MjEwMTcwNjM4N30.u0ue2jgzZ1fw6EKd_uGk_LeMPiRWHGwcoAtvcquekE0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const obraPrincipalId = 'obra_principal';

const dadosIniciais = {
  obra: {
    id: obraPrincipalId,
    nome: "Residência Alphaville - Casa 220m²",
    endereco: "Alameda dos Ipês, Qd. 12 Lt. 08 - Alphaville",
    proprietario: "Alexander & Família",
    engenheiro: "Eng. Carlos Eduardo (CREA 48291-D)",
    arquiteto: "Arq. Mariana Santos (CAU A9182-3)",
    data_inicio: "2026-01-15",
    data_prevista_fim: "2026-11-20",
    orcamento_total: 480000.00,
    area_construida: 220,
    status: "Em Andamento"
  },
  etapas: [
    {
      ordem: 1,
      nome: "Planejamento & Licenciamento",
      status: "Concluído",
      data_inicio: "2026-01-15",
      data_fim: "2026-02-10",
      responsavel: "Arq. Mariana Santos",
      valor_planejado: 21950.00,
      subtarefas: [
        { titulo: "Projeto Arquitetônico Aprovado", concluida: true, progresso: 100 },
        { titulo: "Alvará de Construção na Prefeitura", concluida: true, progresso: 100 },
        { titulo: "Projetos Estrutural e Hidrossanitário", concluida: true, progresso: 100 }
      ]
    },
    {
      ordem: 2,
      nome: "Serviços Preliminares & Terraplenagem",
      status: "Concluído",
      data_inicio: "2026-02-12",
      data_fim: "2026-02-28",
      responsavel: "Mestre Severino",
      valor_planejado: 15000.00,
      subtarefas: [
        { titulo: "Limpeza do Terreno e Gabarito", concluida: true, progresso: 100 },
        { titulo: "Ligação Provisória de Água e Luz", concluida: true, progresso: 100 },
        { titulo: "Escavação e Terraplenagem", concluida: true, progresso: 100 }
      ]
    },
    {
      ordem: 3,
      nome: "Fundação & Baldrames",
      status: "Em Andamento",
      data_inicio: "2026-03-01",
      data_fim: "2026-04-15",
      responsavel: "Eng. Carlos Eduardo",
      valor_planejado: 60000.00,
      subtarefas: [
        { titulo: "Perfuração das Estacas (Brocas)", concluida: true, progresso: 100 },
        { titulo: "Armação de Aço e Concretagem", concluida: true, progresso: 100 },
        { titulo: "Impermeabilização da Viga Baldrame", concluida: false, progresso: 0 }
      ]
    },
  ]
};

async function popularBanco() {
  console.log("Iniciando a inserção de dados no Supabase...");

  // Limpando tabelas na ordem correta para evitar erros de chave estrangeira
  console.log("Limpando tabelas existentes...");
  await supabase.from('subtarefas').delete().neq('id', 0);
  await supabase.from('etapas').delete().neq('id', 0);
  await supabase.from('obras').delete().neq('id', '0');

  // 1. Inserir a Obra Principal
  console.log("Inserindo a obra principal...");
  const { error: erroObra } = await supabase.from('obras').insert(dadosIniciais.obra);
  if (erroObra) return console.error("Erro ao inserir obra:", erroObra.message);

  // 2. Inserir Etapas e suas Subtarefas
  console.log("Inserindo etapas e subtarefas...");
  for (const etapa of dadosIniciais.etapas) {
    const { subtarefas, ...dadosEtapa } = etapa;
    
    const { data: etapaInserida, error: erroEtapa } = await supabase
      .from('etapas')
      .insert({ ...dadosEtapa, obra_id: obraPrincipalId })
      .select()
      .single();

    if (erroEtapa) {
      console.error(`Erro ao inserir etapa "${dadosEtapa.nome}":`, erroEtapa.message);
      continue; // Pula para a próxima etapa em caso de erro
    }

    if (etapaInserida && subtarefas.length > 0) {
      const subsComId = subtarefas.map(s => ({ ...s, etapa_id: etapaInserida.id }));
      await supabase.from('subtarefas').insert(subsComId);
    }
  }

  console.log("✅ Sucesso! O banco de dados foi populado com os dados iniciais.");
}

popularBanco();