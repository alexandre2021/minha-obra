import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ObraContext = createContext();

const initialFallbackData = {
  info: {
    nome: "Nova Obra",
    endereco: "Endereço não informado",
    proprietario: "Proprietário não informado",
    engenheiro: "Responsável não informado",
    arquiteto: "Arquiteto não informado",
    dataInicio: new Date().toISOString().split('T')[0],
    dataPrevistaFim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    orcamentoTotal: 0,
    areaConstruida: 0,
    status: "Em Andamento"
  },
  etapas: []
};

export const ObraProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Nota: Com autenticação, o ideal é carregar dados com base no usuário,
    // não mais do localStorage. Manteremos por enquanto para não quebrar o app.
    const saved = localStorage.getItem('minhaobra_relational_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialFallbackData;
  });
  const [obras, setObras] = useState([]);
  const [obraAtualId, setObraAtualId] = useState(() => {
    const savedId = localStorage.getItem('minhaobra_obra_id');
    return savedId || null;
  });

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [supabaseConectado, setSupabaseConectado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Pega a sessão inicial e o perfil do usuário
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);
        await carregarDadosDoSupabase();
      } else {
        setCarregando(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);
        await carregarDadosDoSupabase();
      } else {
        setProfile(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Carregar tabelas relacionais do Supabase
  const carregarDadosDoSupabase = async (idAtivo = obraAtualId) => {
    try {
      const { data: dbObras, error: errObras } = await supabase
        .from('obras')
        .select('*')
        .order('nome', { ascending: true });

      if (errObras) {
        console.warn("Aguardando criação das tabelas no SQL Editor...");
        setSupabaseConectado(false);
        setCarregando(false);
        return;
      }

      const listaObras = (dbObras || []).map((obra) => ({
        id: obra.id,
        nome: obra.nome,
        endereco: obra.endereco,
        status: obra.status
      }));
      setObras(listaObras);
      
      const obraIdValida = idAtivo && listaObras.some(o => o.id === idAtivo) 
        ? idAtivo 
        : listaObras[0]?.id;

      if (!obraIdValida) {
        setData(initialFallbackData);
        setCarregando(false);
        setSupabaseConectado(true);
        return;
      }
      
      if (idAtivo !== obraIdValida) {
        setObraAtualId(obraIdValida);
        localStorage.setItem('minhaobra_obra_id', obraIdValida);
      }

      const { data: dbObra, error: errObra } = await supabase
        .from('obras')
        .select('*')
        .eq('id', obraIdValida)
        .single();

      if (errObra && errObra.code !== 'PGRST116') {
        console.warn("Aguardando criação das tabelas no SQL Editor...");
        setSupabaseConectado(false);
        setCarregando(false);
        return;
      }

      const { data: dbEtapas } = await supabase
        .from('etapas')
        .select('*, subtarefas(*, tarefa_observacoes(*))')
        .eq('obra_id', obraIdValida)
        .order('ordem', { ascending: true });

      if (dbObra) {
        const infoFormatada = {
          nome: dbObra.nome,
          endereco: dbObra.endereco || "Endereço não informado",
          proprietario: dbObra.proprietario || "Proprietário não informado",
          proprietario_email: dbObra.proprietario_email || "",
          engenheiro: dbObra.engenheiro || "Responsável não informado",
          arquiteto: dbObra.arquiteto || "Arquiteto não informado",
          dataInicio: dbObra.data_inicio,
          dataPrevistaFim: dbObra.data_prevista_fim,
          orcamentoTotal: parseFloat(dbObra.orcamento_total || 0),
          areaConstruida: parseFloat(dbObra.area_construida || 0),
          status: dbObra.status
        };

        const etapasFormatadas = (dbEtapas || []).map(e => {
          const subtarefasOrdenadas = (e.subtarefas || [])
            .map(s => ({
              id: s.id,
              titulo: s.titulo,
              concluida: s.concluida,
              ordem: typeof s.ordem === 'number' ? s.ordem : 0,
              observacoes: (s.tarefa_observacoes || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
              executor: s.executor || ''
            }))
            .sort((a, b) => (a.ordem - b.ordem) || (a.id - b.id));

          const concluidas = subtarefasOrdenadas.filter(s => s.concluida).length;
          const total = subtarefasOrdenadas.length;
          const progressoCalculado = total > 0 ? Math.round((concluidas / total) * 100) : 0;

          return {
            id: e.id,
            nome: e.nome,
            progresso: progressoCalculado,
            status: e.status,
            dataInicio: e.data_inicio,
            dataFim: e.data_fim,
            responsavel: e.responsavel || 'Responsável não informado',
            valorPlanejado: parseFloat(e.valor_planejado || 0),
            valorRealizado: parseFloat(e.valor_realizado || 0),
            subtarefas: subtarefasOrdenadas
          };
        });

        const novoEstado = {
          info: infoFormatada,
          etapas: etapasFormatadas,
        };

        setData(novoEstado);
        localStorage.setItem('minhaobra_relational_data', JSON.stringify(novoEstado));
        setSupabaseConectado(true);
      }
    } catch (err) {
      console.warn("Aguardando criação das tabelas relacionais no Supabase...");
      setSupabaseConectado(false);
    } finally {
      setCarregando(false);
    }
  };

  const selecionarObra = async (id) => {
    if (!id) return;
    setObraAtualId(id);
    localStorage.setItem('minhaobra_obra_id', id);
    await carregarDadosDoSupabase(id);
  };

  const criarObra = async (dadosNovaObra) => {
    const nome = (dadosNovaObra.nome || '').trim();
    if (!nome) return null;

    const novoId = `obra_${Date.now()}`;

    try {
      const { data: obraCriada, error } = await supabase.from('obras').insert({
          id: novoId,
          owner_id: session.user.id, // Associa a obra ao usuário que a está criando
          nome,
          endereco: dadosNovaObra.endereco,
          proprietario: dadosNovaObra.proprietario || null,
          proprietario_email: dadosNovaObra.proprietarioEmail || null,
          engenheiro: dadosNovaObra.engenheiro || null,
          arquiteto: dadosNovaObra.arquiteto || 'Arquiteto não informado',
          data_inicio: new Date().toISOString().split('T')[0],
          data_prevista_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: dadosNovaObra.status || 'Planejamento',
          area_construida: parseFloat(dadosNovaObra.areaConstruida || 0),
          orcamento_total: parseFloat(dadosNovaObra.orcamentoTotal || 0)
        }).select().single();

      if (error || !obraCriada) {
        console.error("Falha ao criar nova obra no Supabase:", error);
        return null;
      }

      await selecionarObra(obraCriada.id);
      return obraCriada.id;
    } catch (error) {
      console.error("Erro inesperado ao criar obra:", error);
      return null;
    }
  };

  const removerObra = async (obraId) => {
    if (!obraId) return;

    const novasObras = obras.filter(o => o.id !== obraId);
    setObras(novasObras);

    if (obraAtualId === obraId) {
      const proximaObraId = novasObras.length > 0 ? novasObras[0].id : null;
      if (proximaObraId) {
        await selecionarObra(proximaObraId);
      } else {
        setData(initialFallbackData);
        setObraAtualId(null);
        localStorage.removeItem('minhaobra_obra_id');
        localStorage.removeItem('minhaobra_relational_data');
      }
    }

    if (supabaseConectado) {
      const { error } = await supabase.from('obras').delete().eq('id', obraId);
      if (error) {
        console.error("Falha ao remover obra:", error);
        await carregarDadosDoSupabase(obraAtualId);
      }
    }
  };

  useEffect(() => {
    const setup = async () => {
      if (obraAtualId) {
        // Remove todos os canais existentes para garantir um estado limpo antes de criar um novo.
        const canaisAtuais = supabase.getChannels();
        if (canaisAtuais.length > 0) {
          await Promise.all(canaisAtuais.map(c => supabase.removeChannel(c)));
        }

        // Cria e configura o novo canal
        const channel = supabase.channel(`schema_db_changes_for_${obraAtualId}`);
        
        // Configura os listeners ANTES de fazer o subscribe
        const onChanges = () => carregarDadosDoSupabase(obraAtualId);
        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'obras' }, onChanges)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'etapas' }, onChanges)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'subtarefas' }, onChanges)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefa_observacoes' }, onChanges)
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
    setup();
  }, [obraAtualId, supabaseConectado]);

  const atualizarEtapaProgresso = async (etapaId, novoProgresso, novoStatus) => {
    let status = "Não Iniciada";
    if (novoProgresso === 100) status = "Concluído";
    else if (novoProgresso > 0) status = "Em Andamento";

    if (supabaseConectado) {
      await supabase.from('etapas').update({ status: novoStatus || status }).eq('id', etapaId);
    }
  };

  const adicionarObservacao = async (subtarefaId, texto, imagensUrls = []) => {
    if (!subtarefaId || (!texto.trim() && imagensUrls.length === 0)) return;

    const observacaoTemporaria = {
      id: Date.now(),
      subtarefa_id: subtarefaId,
      texto,
      imagens_urls: imagensUrls,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      etapas: prev.etapas.map(e => ({
        ...e,
        subtarefas: e.subtarefas.map(s => s.id === subtarefaId ? { ...s, observacoes: [observacaoTemporaria, ...s.observacoes] } : s)
      }))
    }));

    if (supabaseConectado) {
      await supabase.from('tarefa_observacoes').insert({ subtarefa_id: subtarefaId, texto, imagens_urls: imagensUrls });
    }
  };

  const uploadImagemTarefa = async (subtarefaId, file) => {
    if (!file || !subtarefaId) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${subtarefaId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('imagens').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from('imagens').getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      return null;
    }
  };

  const adicionarEtapa = async (novaEtapa) => {
    const etapaTemporaria = {
      id: Date.now(),
      nome: novaEtapa.nome,
      progresso: 0,
      status: 'Não Iniciada',
      dataInicio: novaEtapa.dataInicio,
      dataFim: novaEtapa.dataFim,
      responsavel: novaEtapa.responsavel,
      valorPlanejado: novaEtapa.valorPlanejado,
      subtarefas: []
    };

    setData(prev => ({ ...prev, etapas: [...prev.etapas, etapaTemporaria] }));

    if (supabaseConectado) {
      const novaOrdem = data.etapas.length;
      const { data: etapaCriada, error: errorEtapa } = await supabase.from('etapas').insert({
        obra_id: obraAtualId,
        nome: novaEtapa.nome,
        status: 'Não Iniciada',
        data_inicio: novaEtapa.dataInicio,
        data_fim: novaEtapa.dataFim,
        responsavel: novaEtapa.responsavel,
        valor_planejado: novaEtapa.valorPlanejado,
        ordem: novaOrdem
      }).select().single();

      if (errorEtapa) {
        console.error("Falha ao adicionar etapa:", errorEtapa);
        setData(prev => ({ ...prev, etapas: prev.etapas.filter(e => e.id !== etapaTemporaria.id) }));
        return;
      }
      
      await carregarDadosDoSupabase(obraAtualId);
    }
  };

  const removerEtapa = async (etapaId) => {
    setData(prev => ({
      ...prev,
      etapas: prev.etapas.filter(e => e.id !== etapaId)
    }));

    if (supabaseConectado) {
      await supabase.from('etapas').delete().eq('id', etapaId);
    }
  };

  const editarEtapa = async (etapaId, dados) => {
    let novoStatus = '';

    setData(prev => ({
      ...prev,
      etapas: prev.etapas.map((e) => {
        if (e.id !== etapaId) return e;

        const etapaAtualizada = { ...e, ...dados };

        if (etapaAtualizada.progresso === 100) {
          novoStatus = "Concluído";
        } else if (etapaAtualizada.progresso > 0 || etapaAtualizada.valorRealizado > 0) {
          novoStatus = "Em Andamento";
        } else {
          novoStatus = "Não Iniciada";
        }

        return { ...etapaAtualizada, status: novoStatus };
      })
    }));

    if (supabaseConectado) {
      const dadosParaAtualizar = { ...dados, status: novoStatus };
      delete dadosParaAtualizar.dataInicio; // Renomeado para data_inicio
      delete dadosParaAtualizar.dataFim; // Renomeado para data_fim
      delete dadosParaAtualizar.valorPlanejado; // Renomeado para valor_planejado
      delete dadosParaAtualizar.valorRealizado; // Renomeado para valor_realizado

      await supabase.from('etapas').update({ 
        ...dadosParaAtualizar,
        data_inicio: dados.dataInicio,
        data_fim: dados.dataFim,
        valor_planejado: dados.valorPlanejado,
        valor_realizado: dados.valorRealizado
       }).eq('id', etapaId);
    }
  };

  const adicionarSubtarefa = async (etapaId, dadosNovaTarefa) => {
    const { titulo, executor } = dadosNovaTarefa;
    const etapaTarget = data.etapas.find(e => e.id === etapaId);
    const ordem = (etapaTarget?.subtarefas?.length ?? 0) + 1;
    const subtarefaTemporaria = {
      id: Date.now(), 
      titulo, 
      executor,
      concluida: false, 
      ordem, 
      observacoes: [],
    }

    setData(prev => ({
      ...prev,
      etapas: prev.etapas.map(e => e.id === etapaId ? {
        ...e,
        subtarefas: [...e.subtarefas, subtarefaTemporaria]
      } : e)
    }));

    if (supabaseConectado) {
      try {
        const { data: novaSubtarefaSalva, error } = await supabase.from('subtarefas').insert({ 
          etapa_id: etapaId, 
          titulo, 
          concluida: false, 
          executor,
          ordem, 
        }).select().single();

        if (error) {
          console.warn('Não foi possível salvar a nova subtarefa no Supabase:', error);
          setData(prev => ({
            ...prev,
            etapas: prev.etapas.map(e => e.id === etapaId ? { ...e, subtarefas: e.subtarefas.filter(s => s.id !== subtarefaTemporaria.id) } : e)
          }));
        } else {
          setData(prev => ({
            ...prev,
            etapas: prev.etapas.map(e => e.id === etapaId ? { ...e, subtarefas: e.subtarefas.map(s => s.id === subtarefaTemporaria.id ? { ...s, ...novaSubtarefaSalva, observacoes: [] } : s) } : e)
          }));
        }
      } catch (error) {
        console.warn('Falha ao salvar subtarefa no Supabase:', error);
      }
    }
  };
  const removerSubtarefa = async (etapaId, subtarefaId) => {
    let etapaAtualizadaParaDb = {};

    setData(prev => {
      const novasEtapas = prev.etapas.map(e => {
        if (e.id !== etapaId) return e;

        const subtarefasRestantes = e.subtarefas
          .filter(s => s.id !== subtarefaId)
          .map((sub, index) => ({ ...sub, ordem: index + 1 }));

        const concluidas = subtarefasRestantes.filter(s => s.concluida).length;
        const total = subtarefasRestantes.length;
        const novoProgresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

        let novoStatus;
        if (total === 0) { // Se não há mais tarefas, a etapa volta a ser "Não Iniciada"
          novoStatus = "Não Iniciada";
        } else if (novoProgresso === 100) {
          novoStatus = "Concluído";
        } else if (novoProgresso > 0 || e.valorRealizado > 0) {
          novoStatus = "Em Andamento";
        } else {
          novoStatus = "Não Iniciada";
        }
        
        const etapaAtualizada = { 
          ...e, 
          subtarefas: subtarefasRestantes,
          progresso: novoProgresso,
          status: novoStatus
        };

        etapaAtualizadaParaDb = { status: novoStatus, progresso: novoProgresso };
        return etapaAtualizada;
      });

      return { ...prev, etapas: novasEtapas };
    });

    if (supabaseConectado) {
      try {
        await supabase.from('subtarefas').delete().eq('id', subtarefaId);
        await supabase.from('etapas').update(etapaAtualizadaParaDb).eq('id', etapaId);
      } catch (error) {
        console.warn('Falha ao remover subtarefa no Supabase:', error);
      }
    }
  };

  const reordenarSubtarefas = async (etapaId, subtarefaIdOrigem, subtarefaIdDestino) => {
    if (!etapaId || !subtarefaIdOrigem || !subtarefaIdDestino || subtarefaIdOrigem === subtarefaIdDestino) return;

    const etapaTarget = data.etapas.find(e => e.id === etapaId);
    if (!etapaTarget) return;

    const subtarefas = [...etapaTarget.subtarefas];
    const fromIndex = subtarefas.findIndex(s => s.id === subtarefaIdOrigem);
    const toIndex = subtarefas.findIndex(s => s.id === subtarefaIdDestino);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const [itemMovido] = subtarefas.splice(fromIndex, 1);
    subtarefas.splice(toIndex, 0, itemMovido);

    const subtarefasReordenadas = subtarefas.map((sub, index) => ({ ...sub, ordem: index + 1 }));

    setData(prev => ({
      ...prev,
      etapas: prev.etapas.map(e => e.id === etapaId ? { ...e, subtarefas: subtarefasReordenadas } : e)
    }));

    if (supabaseConectado) {
      for (const [index, sub] of subtarefasReordenadas.entries()) {
        const { error } = await supabase.from('subtarefas').update({ ordem: index + 1 }).eq('id', sub.id);

        if (error) {
          console.warn('Não foi possível salvar a nova ordem das subtarefas no Supabase:', error);
          break;
        }
      }
    }
  };

  const atualizarSubtarefa = async (etapaId, subtarefaId, dadosAtualizados) => {
    const etapaTarget = data.etapas.find(e => e.id === etapaId);
    if (!etapaTarget) return;

    const subTarget = etapaTarget.subtarefas.find(s => s.id === subtarefaId);
    if (!subTarget) return;
    
    const novoStatusSub = dadosAtualizados.concluida ?? subTarget.concluida;
    
    setData(prev => ({
      ...prev,
      etapas: prev.etapas.map(e => e.id === etapaId ? { ...e, subtarefas: e.subtarefas.map((s) => s.id === subtarefaId ? { ...s, ...dadosAtualizados } : s) } : e)
    }));

    if (supabaseConectado) {
      await supabase.from('subtarefas').update(dadosAtualizados).eq('id', subtarefaId);
    }
  };

  const toggleSubtarefa = async (etapaId, subtarefaId) => {
    setData(prevData => {
      const novasEtapas = prevData.etapas.map(etapa => {
        if (etapa.id !== etapaId) return etapa;

        const novasSubtarefas = etapa.subtarefas.map(sub => 
          sub.id === subtarefaId ? { ...sub, concluida: !sub.concluida } : sub
        );

        const concluidas = novasSubtarefas.filter(s => s.concluida).length;
        const total = novasSubtarefas.length;
        const novoProgressoEtapa = total > 0 ? Math.round((concluidas / total) * 100) : 0;
      
        let novoStatusEtapa = 'Não Iniciada';
        if (novoProgressoEtapa === 100) {
          novoStatusEtapa = 'Concluído';
        } else if (novoProgressoEtapa > 0) {
          novoStatusEtapa = 'Em Andamento';
        }

        const subOriginal = etapa.subtarefas.find(s => s.id === subtarefaId);
        if (subOriginal) {
          supabase.from('subtarefas').update({ concluida: !subOriginal.concluida }).eq('id', subtarefaId).then();
        }
        if (etapa.status !== novoStatusEtapa) {
          supabase.from('etapas').update({ status: novoStatusEtapa }).eq('id', etapaId).then();
        }

        return { ...etapa, subtarefas: novasSubtarefas, progresso: novoProgressoEtapa, status: novoStatusEtapa };
      });

      return {
        ...prevData,
        etapas: novasEtapas
      };
    });
  };

  const atualizarInfoObra = async (novasInfos) => {
    const prev = { ...data, info: { ...data.info, ...novasInfos } };
    setData(prev);

    if (supabaseConectado) {
      await supabase.from('obras').update({
        nome: novasInfos.nome,
        endereco: novasInfos.endereco,
        proprietario: novasInfos.proprietario,
        proprietario_email: novasInfos.proprietario_email,
        engenheiro: novasInfos.engenheiro,
        arquiteto: novasInfos.arquiteto,
        status: novasInfos.status,
        area_construida: parseFloat(novasInfos.areaConstruida || 0),
        orcamento_total: parseFloat(
          String(novasInfos.orcamentoTotal || '0')
            .replace(/\./g, '') // Remove o separador de milhar (ponto)
            .replace(',', '.') // Troca o separador decimal (vírgula) por ponto
        )
      }).eq('id', obraAtualId);
    }
  };

  const convidarProprietario = async (email, obraId) => {
    console.log('🚀 ENVIANDO CONVITE:', {
      email,
      timestamp: new Date().toISOString()
    });
    try {
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: {
          email: email.trim(),
          obra_id: obraId
        },
      });
  
      console.log('EDGE DATA:', data);
      console.log('EDGE ERROR:', error);
  
      if (error) {
        if (error.context) {
          try {
            const errorBody = await error.context.json();
            console.error('ERRO REAL DA EDGE FUNCTION:', errorBody);
          } catch (e) {
            console.error('Não foi possível ler o corpo do erro:', e);
          }
        }
      
        throw error;
      }
  
      // Atualiza o e-mail do proprietário na tabela de obras
      const { error: updateError } = await supabase
        .from('obras')
        .update({ proprietario_email: email.trim() })
        .eq('id', obraId);
  
      if (updateError) throw updateError;
  
      return { data, error: null };
  
    } catch (error) {
      console.error("Erro ao invocar a função de convite:", error);
      return { data: null, error };
    }
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    // O listener onAuthStateChange cuidará de limpar a sessão e o perfil.
  };

  const resetarDados = () => {
    if (window.confirm("Deseja atualizar dados?")) {
      carregarDadosDoSupabase();
    }
  };

  const progressoGlobal = data.etapas.length > 0
    ? Math.round(data.etapas.reduce((acc, etapa) => acc + etapa.progresso, 0) / data.etapas.length)
    : 0;

  return (
    <ObraContext.Provider value={{
      info: data.info,
      etapas: data.etapas,
      obras,
      obraAtualId,
      progressoGlobal,
      supabaseConectado,
      carregando,
      session,
      profile,
      atualizarEtapaProgresso,
      atualizarSubtarefa,
      adicionarEtapa,
      removerEtapa,
      editarEtapa,
      adicionarObservacao,
      uploadImagemTarefa,
      adicionarSubtarefa,
      removerSubtarefa,
      reordenarSubtarefas,
      toggleSubtarefa,
      atualizarInfoObra,
      selecionarObra,
      criarObra,
      removerObra,
      resetarDados,
      signOutUser,
      convidarProprietario
    }}>
      {children}
    </ObraContext.Provider>
  );
};

export const useObra = () => useContext(ObraContext);
