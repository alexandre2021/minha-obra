import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://leaifcptyahjaytjpdyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWlmY3B0eWFoamF5dGpwZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzAzODcsImV4cCI6MjEwMTcwNjM4N30.u0ue2jgzZ1fw6EKd_uGk_LeMPiRWHGwcoAtvcquekE0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialData = {
  info: {
    id: "obra_principal",
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
      peso: 5,
      progresso: 100,
      status: "Concluído",
      data_inicio: "2026-01-15",
      data_fim: "2026-02-10",
      responsavel: "Arq. Mariana Santos",
      subtarefas: [
        { titulo: "Projeto Arquitetônico Aprovado", concluida: true },
        { titulo: "Alvará de Construção na Prefeitura", concluida: true },
        { titulo: "Projetos Estrutural e Hidrossanitário", concluida: true }
      ]
    },
    {
      ordem: 2,
      nome: "Serviços Preliminares & Terraplenagem",
      peso: 5,
      progresso: 100,
      status: "Concluído",
      data_inicio: "2026-02-12",
      data_fim: "2026-02-28",
      responsavel: "Mestre Severino",
      subtarefas: [
        { titulo: "Limpeza do Terreno e Gabarito", concluida: true },
        { titulo: "Ligação Provisória de Água e Luz", concluida: true },
        { titulo: "Escavação e Terraplenagem", concluida: true }
      ]
    },
    {
      ordem: 3,
      nome: "Fundação & Baldrames",
      peso: 20,
      progresso: 100,
      status: "Concluído",
      data_inicio: "2026-03-01",
      data_fim: "2026-04-15",
      responsavel: "Eng. Carlos Eduardo",
      subtarefas: [
        { titulo: "Perfuração das Estacas (Brocas)", concluida: true },
        { titulo: "Armação de Aço e Concretagem", concluida: true },
        { titulo: "Impermeabilização da Viga Baldrame", concluida: true }
      ]
    },
    {
      ordem: 4,
      nome: "Alvenaria & Estrutura",
      peso: 25,
      progresso: 75,
      status: "Em Andamento",
      data_inicio: "2026-04-18",
      data_fim: "2026-06-30",
      responsavel: "Mestre Severino",
      subtarefas: [
        { titulo: "Levantamento de Paredes Térreo", concluida: true },
        { titulo: "Formas e Concretagem de Pilares/Vigas", concluida: true },
        { titulo: "Laje de Forro / Pavimento Superior", concluida: false }
      ]
    },
    {
      ordem: 5,
      nome: "Cobertura & Telhado",
      peso: 10,
      progresso: 25,
      status: "Em Andamento",
      data_inicio: "2026-07-01",
      data_fim: "2026-08-15",
      responsavel: "Marcenaria Silva",
      subtarefas: [
        { titulo: "Estrutura Metálica/Madeiramento", concluida: true },
        { titulo: "Instalação das Telhas Termoacústicas", concluida: false },
        { titulo: "Colocação de Calhas e Rufos", concluida: false }
      ]
    },
    {
      ordem: 6,
      nome: "Instalações Hidráulicas e Elétricas",
      peso: 15,
      progresso: 0,
      status: "Não Iniciada",
      data_inicio: "2026-08-16",
      data_fim: "2026-09-30",
      responsavel: "Eletro & Hidro Serviços",
      subtarefas: [
        { titulo: "Rasgo de Paredes e Tubulação Embutida", concluida: false },
        { titulo: "Passagem de Fiação e Quadro de Distribuição", concluida: false },
        { titulo: "Testes de Pressão e Estanqueidade", concluida: false }
      ]
    },
    {
      ordem: 7,
      nome: "Revestimentos & Pisos",
      peso: 12,
      progresso: 0,
      status: "Não Iniciada",
      data_inicio: "2026-09-20",
      data_fim: "2026-10-31",
      responsavel: "Acabamentos Elite",
      subtarefas: [
        { titulo: "Chapisco, Emboço e Reboco", concluida: false },
        { titulo: "Assentamento de Porcelanato e Azulejos", concluida: false },
        { titulo: "Instalação de Bancadas de Granito", concluida: false }
      ]
    },
    {
      ordem: 8,
      nome: "Pintura & Entrega Final",
      peso: 8,
      progresso: 0,
      status: "Não Iniciada",
      data_inicio: "2026-11-01",
      data_fim: "2026-11-20",
      responsavel: "Pinturas & Cia",
      subtarefas: [
        { titulo: "Massa Corrida e Lixamento", concluida: false },
        { titulo: "Pintura Externa Texturizada e Externa", concluida: false },
        { titulo: "Limpeza Pós-Obra e Vistoria Final", concluida: false }
      ]
    }
  ],
  despesas: [
    {
      descricao: "Projeto Arquitetônico e Complementares",
      categoria: "Projetos & Taxas",
      valor: 18500.00,
      data: "2026-01-20",
      fornecedor: "Arq. Mariana Santos",
      status: "Pago",
      comprovante: "recibo_projeto.pdf"
    },
    {
      descricao: "Taxa Alvará de Construção e ART CREA",
      categoria: "Projetos & Taxas",
      valor: 3450.00,
      data: "2026-02-05",
      fornecedor: "Prefeitura Municipal",
      status: "Pago",
      comprovante: "taxa_alvara.pdf"
    },
    {
      descricao: "Locação de Retroescavadeira (2 dias)",
      categoria: "Serviços Preliminares",
      valor: 4200.00,
      data: "2026-02-15",
      fornecedor: "Terraplenagem Silva",
      status: "Pago",
      comprovante: "nf_terraplenagem.pdf"
    },
    {
      descricao: "Concreto Usinado FCK 30Mpa (Fundação)",
      categoria: "Fundação",
      valor: 28400.00,
      data: "2026-03-10",
      fornecedor: "Concretix Usina",
      status: "Pago",
      comprovante: "nf_concreto.pdf"
    },
    {
      descricao: "Aço CA-50 10mm e 12mm (3 Toneladas)",
      categoria: "Fundação",
      valor: 21600.00,
      data: "2026-03-12",
      fornecedor: "Gerdau Comercial",
      status: "Pago",
      comprovante: "nf_aco.pdf"
    },
    {
      descricao: "Primeira Medição Empreiteiro (Fundação)",
      categoria: "Mão de Obra",
      valor: 35000.00,
      data: "2026-04-02",
      fornecedor: "Mestre Severino",
      status: "Pago",
      comprovante: "recibo_mao_obra_1.pdf"
    },
    {
      descricao: "Blocos Cerâmicos Vedação 14x19x29 (8.000 un)",
      categoria: "Alvenaria",
      valor: 16800.00,
      data: "2026-04-20",
      fornecedor: "Olaria Modelo",
      status: "Pago",
      comprovante: "nf_tijolos.pdf"
    },
    {
      descricao: "Segunda Medição Empreiteiro (Alvenaria 1º Pav)",
      categoria: "Mão de Obra",
      valor: 30000.00,
      data: "2026-05-15",
      fornecedor: "Mestre Severino",
      status: "Pago",
      comprovante: "recibo_mao_obra_2.pdf"
    },
    {
      descricao: "Estrutura de Madeira e Vigamento Telhado",
      categoria: "Cobertura",
      valor: 19200.00,
      data: "2026-07-05",
      fornecedor: "Madeireira São José",
      status: "Pago",
      comprovante: "nf_madeira.pdf"
    },
    {
      descricao: "Sacos de Cimento CP-II (150 sacos)",
      categoria: "Alvenaria",
      valor: 5400.00,
      data: "2026-07-18",
      fornecedor: "ConstruMais Depósito",
      status: "Pago",
      comprovante: "nf_cimento.pdf"
    },
    {
      descricao: "Entrada Telhas Termoacústicas Sanduíche",
      categoria: "Cobertura",
      valor: 14500.00,
      data: "2026-08-01",
      fornecedor: "Coberturas Premium",
      status: "Pendente",
      comprovante: "pedido_telhas.pdf"
    }
  ],
  materiais: [
    {
      nome: "Cimento CP-II Z 50kg",
      categoria: "Estrutural",
      qtd_necessaria: 350,
      qtd_comprada: 250,
      unidade: "Sacos",
      preco_medio: 36.00,
      status: "Em Uso",
      fornecedor: "ConstruMais Depósito"
    },
    {
      nome: "Aço CA-50 10mm (3/8\")",
      categoria: "Estrutural",
      qtd_necessaria: 250,
      qtd_comprada: 250,
      unidade: "Barras 12m",
      preco_medio: 58.00,
      status: "Entregue",
      fornecedor: "Gerdau Comercial"
    },
    {
      nome: "Tijolo Baiano 9 Furos 14x19x29",
      categoria: "Alvenaria",
      qtd_necessaria: 9500,
      qtd_comprada: 8000,
      unidade: "Milheiro",
      preco_medio: 2100.00,
      status: "Em Uso",
      fornecedor: "Olaria Modelo"
    },
    {
      nome: "Areia Média Lavada",
      categoria: "Agregados",
      qtd_necessaria: 45,
      qtd_comprada: 30,
      unidade: "m³",
      preco_medio: 120.00,
      status: "Em Uso",
      fornecedor: "Mineração Vale"
    },
    {
      nome: "Telha Sanduíche EPS 30mm Amber",
      categoria: "Cobertura",
      qtd_necessaria: 210,
      qtd_comprada: 0,
      unidade: "m²",
      preco_medio: 135.00,
      status: "Cotado",
      fornecedor: "Coberturas Premium"
    },
    {
      nome: "Porcelanato Polido 84x84 Retificado",
      categoria: "Acabamento",
      qtd_necessaria: 190,
      qtd_comprada: 0,
      unidade: "m²",
      preco_medio: 110.00,
      status: "Pendente",
      fornecedor: "Portobello Shop"
    }
  ],
  diario_obra: [
    {
      data: "2026-08-05",
      clima: "Ensolarado",
      temperatura: "28°C",
      efetivo: 6,
      atividades: "Concretagem dos pilares do segundo pavimento e montagem da caixa de escada. Entrega de 150 sacos de cimento.",
      ocorrencias: "Sem acidentes ou atrasos. Inspeção do engenheiro aprovou a ferragem dos pilares.",
      imagem: "/images/alvenaria.jpg"
    },
    {
      data: "2026-03-25",
      clima: "Parcialmente Nublado",
      temperatura: "24°C",
      efetivo: 8,
      atividades: "Finalização da impermeabilização das vigas baldrame com manta asfáltica. Teste de nivelamento do gabarito.",
      ocorrencias: "Chuva fraca no período da tarde não comprometeu os trabalhos de cura do concreto.",
      imagem: "/images/fundacao.jpg"
    }
  ],
  equipe: [
    {
      nome: "Severino Ramos",
      funcao: "Mestre de Obras / Empreiteiro",
      telefone: "(11) 98765-4321",
      email: "severino.obras@gmail.com",
      status: "Ativo na Obra",
      pagamento_tipo: "Por Medição / Contrato",
      valor_contrato: 120000.00,
      pago_ate_agora: 65000.00
    },
    {
      nome: "Eng. Carlos Eduardo",
      funcao: "Engenheiro Civil (RT)",
      telefone: "(11) 99123-4567",
      email: "carlos.eng@consultoria.com.br",
      status: "Visita Semanal",
      pagamento_tipo: "Mensalidade Técnica",
      valor_contrato: 25000.00,
      pago_ate_agora: 15000.00
    },
    {
      nome: "Arq. Mariana Santos",
      funcao: "Arquiteta e Designer",
      telefone: "(11) 97777-8888",
      email: "mariana@studioarq.com",
      status: "Acompanhamento",
      pagamento_tipo: "Projeto + Vistoria",
      valor_contrato: 18500.00,
      pago_ate_agora: 18500.00
    },
    {
      nome: "Marcos Instalador",
      funcao: "Eletricista & Encanador",
      telefone: "(11) 96543-2109",
      email: "marcos.eletrohidro@hotmail.com",
      status: "Aguardando Início",
      pagamento_tipo: "Por Empreitada",
      valor_contrato: 38000.00,
      pago_ate_agora: 0.00
    }
  ]
};

export async function seedRelational() {
  console.log("Iniciando inserção nas tabelas relacionais do Supabase...");

  // 1. Obra
  const { error: errObra } = await supabase.from('obras').upsert(initialData.info);
  if (errObra) return console.error("Erro em obras:", errObra.message);

  // 2. Despesas
  const despesasComObra = initialData.despesas.map(d => ({ ...d, obra_id: "obra_principal" }));
  const { error: errDespesas } = await supabase.from('despesas').insert(despesasComObra);
  if (errDespesas) console.warn("Aviso em despesas:", errDespesas.message);

  // 3. Materiais
  const matComObra = initialData.materiais.map(m => ({ ...m, obra_id: "obra_principal" }));
  const { error: errMat } = await supabase.from('materiais').insert(matComObra);
  if (errMat) console.warn("Aviso em materiais:", errMat.message);

  // 4. Diário
  const diarioComObra = initialData.diario_obra.map(d => ({ ...d, obra_id: "obra_principal" }));
  const { error: errDiario } = await supabase.from('diario_obra').insert(diarioComObra);
  if (errDiario) console.warn("Aviso em diario_obra:", errDiario.message);

  // 5. Equipe
  const equipeComObra = initialData.equipe.map(e => ({ ...e, obra_id: "obra_principal" }));
  const { error: errEquipe } = await supabase.from('equipe').insert(equipeComObra);
  if (errEquipe) console.warn("Aviso em equipe:", errEquipe.message);

  // 6. Etapas e Subtarefas
  for (const etapa of initialData.etapas) {
    const { subtarefas, ...dadosEtapa } = etapa;
    const { data: etapaInserida, error: errEtapa } = await supabase
      .from('etapas')
      .insert({ ...dadosEtapa, obra_id: "obra_principal" })
      .select()
      .single();

    if (!errEtapa && etapaInserida) {
      const subsComId = subtarefas.map(s => ({ ...s, etapa_id: etapaInserida.id }));
      await supabase.from('subtarefas').insert(subsComId);
    }
  }

  console.log("Concluído seeding relacional!");
}

seedRelational();
