import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useObra } from '../context/ObraContext';
import { 
  CheckSquare, 
  HardHat,
  Square, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Percent,
  DollarSign,
  Plus,
  Trash2,
  Pencil,
  X,
  Sliders,
  GripVertical,
  FileText,
  MessageSquarePlus,
  UploadCloud,
  Scale,
  TrendingDown, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const Cronograma = () => {
  const { 
    etapas, 
    atualizarEtapaProgresso, 
    toggleSubtarefa, 
    adicionarEtapa,
    removerEtapa,
    editarEtapa,
    adicionarSubtarefa,
    adicionarObservacao,
    removerSubtarefa,
    reordenarSubtarefas,
    atualizarSubtarefa,
    uploadImagemTarefa,
    progressoGlobal,
    resetarDados
  } = useObra();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val || 0));
  };

  const formatarDataBR = (dataString) => {
    if (!dataString || !/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
      return 'Data indefinida';
    }
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}-${mes}-${ano}`;
  };

  const [etapaAberta, setEtapaAberta] = useState(4);
  const [modalNovaEtapa, setModalNovaEtapa] = useState(false);
  const [etapaEditando, setEtapaEditando] = useState(null);
  const [novaSubtarefa, setNovaSubtarefa] = useState({}); // Alterado para objeto
  const [subtaskEmArraste, setSubtaskEmArraste] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState({ etapaId: null, subtarefaId: null }); // Para o modal de detalhes da tarefa
  const [subtarefaEditando, setSubtarefaEditando] = useState(null); // Para o modal de edição de subtarefa
  const [uploading, setUploading] = useState(false);
  const [editandoSubtarefaDados, setEditandoSubtarefaDados] = useState({ titulo: '', executor: '' });
  const [arquivoParaUpload, setArquivoParaUpload] = useState(null);
  const [modalConfirmacao, setModalConfirmacao] = useState({
    aberto: false,
    titulo: '',
    mensagem: '',
    onConfirm: () => {},
  });
  const [valorPlanejadoDisplay, setValorPlanejadoDisplay] = useState('');
  const [valorRealizadoDisplay, setValorRealizadoDisplay] = useState('');
  
  useEffect(() => {
    const shouldLockScroll = modalNovaEtapa || Boolean(etapaEditando) || Boolean(modalDetalhes.etapaId) || Boolean(subtarefaEditando) || modalConfirmacao.aberto;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalNovaEtapa, etapaEditando, modalDetalhes, modalConfirmacao.aberto]);

  // Form State Nova Etapa
  const [formEtapa, setFormEtapa] = useState({
    nome: '',
    responsavel: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    valorPlanejado: ''
  });

  // Form State Editar Etapa
  const [formEdicao, setFormEdicao] = useState({
    nome: '',
    responsavel: '',
    dataInicio: '',
    dataFim: '',
    valorPlanejado: ''
  });

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined || valor === '') return '';
    const numero = Number(valor);
    if (isNaN(numero)) return '';
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const converterParaNumero = (valor) => {
    if (!valor) return 0;
    return parseFloat(
      String(valor)
        .replace(/\./g, '')
        .replace(',', '.')
    ) || 0;
  };


  const toggleAccordion = (id) => {
    setEtapaAberta(etapaAberta === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Concluído':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Concluído</span>;
      case 'Em Andamento':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Em Andamento</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700">Não Iniciada</span>;
    }
  };

  const handleCriarEtapa = (e) => {
    e.preventDefault();
    if (!formEtapa.nome) return;

    adicionarEtapa({
      nome: formEtapa.nome,
      responsavel: formEtapa.responsavel,
      dataInicio: formEtapa.dataInicio,
      dataFim: formEtapa.dataFim,
      valorPlanejado: parseFloat(formEtapa.valorPlanejado || 0)
    });

    setFormEtapa({
      nome: '',
      responsavel: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      valorPlanejado: ''
    });
    setModalNovaEtapa(false);
  };

  const handleAbrirEditar = (etapa, e) => {
    e.stopPropagation();
    setEtapaEditando(etapa);
    setFormEdicao({
      nome: etapa.nome,
      responsavel: etapa.responsavel === 'Responsável não informado' ? '' : etapa.responsavel,
      dataInicio: etapa.dataInicio || '',
      dataFim: etapa.dataFim || '',
      // Os valores numéricos são mantidos aqui, mas os displays são atualizados
    });
    setValorPlanejadoDisplay(formatarValor(etapa.valorPlanejado));
    setValorRealizadoDisplay(formatarValor(etapa.valorRealizado));
  };

  const handleAbrirEditarSubtarefa = (sub) => {
    setSubtarefaEditando(sub);
    setEditandoSubtarefaDados({ titulo: sub.titulo, executor: sub.executor || '' });
  };


  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    if (!etapaEditando || !formEdicao.nome) return;

    editarEtapa(etapaEditando.id, {
      nome: formEdicao.nome,
      responsavel: formEdicao.responsavel,
      dataInicio: formEdicao.dataInicio,
      dataFim: formEdicao.dataFim,
      valorPlanejado: converterParaNumero(valorPlanejadoDisplay),
      valorRealizado: converterParaNumero(valorRealizadoDisplay)
    });

    setEtapaEditando(null);
  };

  const handleAbrirObservacoes = (etapaId, sub) => {
    setModalDetalhes({ etapaId, subtarefaId: sub.id });
    setNovaObservacao({ texto: '', arquivos: [] }); // Limpa o formulário ao abrir
    // setEditandoSubtarefaDados({ titulo: sub.titulo, executor: sub.executor || '' }); // Não mais necessário aqui
  };

  const handleSalvarObservacao = async () => {
    if (!subtarefaModal) return;
    const { texto, arquivos } = novaObservacao;
    if (!texto.trim() && arquivos.length === 0) return;

    let urls = [];
    setUploading(true);

    if (arquivos.length > 0) {
      for (const arquivo of arquivos) {
        // Passa o ID da subtarefa para a função de upload
        const url = await uploadImagemTarefa(subtarefaModal.id, arquivo);
        if (url) {
          urls.push(url);
        }
      }
    }

    await adicionarObservacao(subtarefaModal.id, texto, urls);

    setUploading(false);
    setNovaObservacao({ texto: '', arquivos: [] }); // Limpa o formulário
  };

  const handleSalvarEdicaoSubtarefa = async (e) => {
    e.preventDefault();
    if (!subtarefaEditando) return;
    await atualizarSubtarefa(
      subtarefaEditando.etapa_id, // etapa_id está na subtarefa
      subtarefaEditando.id,
      editandoSubtarefaDados
    );
    setSubtarefaEditando(null); // Fecha o modal após salvar
  };


  const handleAddSubInLine = (etapaId) => {
    const dadosTarefa = novaSubtarefa[etapaId] || {};
    const titulo = dadosTarefa.titulo || '';
    if (!titulo.trim()) return;

    adicionarSubtarefa(etapaId, { titulo: titulo.trim(), executor: dadosTarefa.executor || '' });
    setNovaSubtarefa({ ...novaSubtarefa, [etapaId]: { titulo: '', executor: '' } });
  };

  const handleDragStart = (etapaId, subtarefaId, event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${etapaId}:${subtarefaId}`);
    setSubtaskEmArraste({ etapaId, subtarefaId });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDropSubtask = (etapaId, subtarefaIdDestino) => {
    if (!subtaskEmArraste || subtaskEmArraste.etapaId !== etapaId) return;

    reordenarSubtarefas(etapaId, subtaskEmArraste.subtarefaId, subtarefaIdDestino);
    setSubtaskEmArraste(null);
  };

  const handleDeletarEtapa = (etapa, e) => {
    e.stopPropagation();
    setModalConfirmacao({
      aberto: true,
      titulo: 'Confirmar Exclusão de Etapa',
      mensagem: `Tem certeza que deseja excluir a etapa "${etapa.nome}"? Todas as suas tarefas e observações serão perdidas permanentemente.`,
      onConfirm: () => {
        removerEtapa(etapa.id);
        setModalConfirmacao({ aberto: false, titulo: '', mensagem: '', onConfirm: () => {} });
      }
    });
  };

  // Encontra a subtarefa atual para o modal de detalhes
  const subtarefaModal = modalDetalhes.etapaId && modalDetalhes.subtarefaId
    ? etapas.find(e => e.id === modalDetalhes.etapaId)?.subtarefas.find(s => s.id === modalDetalhes.subtarefaId)
    : null;
  
  // Estado local para o campo de nova observação, dentro do escopo do componente
  const [novaObservacao, setNovaObservacao] = useState({ texto: '', arquivos: [] });


  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner / Header Cronograma */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-500" />
            Cronograma
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Crie, renomeie, edite ou remova etapas e acompanhe a execução de suas tarefas.
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">

          <button 
            onClick={() => setModalNovaEtapa(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nova Etapa
          </button>
        </div>
      </div>

      {/* Timeline Steps List */}
      <div className="space-y-4">
        {etapas.map((etapa, index) => {
          const isExpanded = etapaAberta === etapa.id;
          const concluidasSub = etapa.subtarefas.filter(s => s.concluida).length;

          return (
            <div 
              key={etapa.id} 
              className={`glass-card rounded-2xl transition-all border ${
                isExpanded ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-800'
              }`}
            >
              {/* Etapa Header Bar */}
              <div 
                onClick={() => toggleAccordion(etapa.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-800/40 rounded-2xl transition-colors"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className={`p-2.5 rounded-xl text-xs font-black flex items-center justify-center min-w-10 h-10 ${
                    etapa.status === 'Concluído' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : etapa.status === 'Em Andamento'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {index + 1}º
                  </div>

                  <div>
                    {/* Linha 1: Nome */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-white">{etapa.nome}</h3>
                    </div>

                    {/* Linha 2: Status e Badges Financeiros */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
                      {getStatusBadge(etapa.status)}
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <DollarSign className="w-3 h-3" /> Planejado: {formatCurrency(etapa.valorPlanejado)}
                      </span>
                      {etapa.subtarefas.length > 0 && (
                        <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                          etapa.valorRealizado === 0
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : etapa.valorRealizado > etapa.valorPlanejado 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {etapa.valorRealizado === 0 ? <DollarSign className="w-3 h-3" /> :
                          etapa.valorRealizado > etapa.valorPlanejado ? <TrendingDown className="w-3 h-3" /> : 
                          <TrendingUp className="w-3 h-3" />}
                          Realizado: {formatCurrency(etapa.valorRealizado)}
                        </span>
                      )}
                    </div>

                    {/* Linha 3: Detalhes Operacionais */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" />{formatarDataBR(etapa.dataInicio)} até {formatarDataBR(etapa.dataFim)}</span>
                      <span className="flex items-center gap-1"><HardHat className="w-3.5 h-3.5 text-slate-500" />{etapa.responsavel}</span>
                      {etapa.subtarefas.length > 0 && (
                        <span className={`flex items-center gap-1 font-semibold ${
                          etapa.status === 'Concluído' ? 'text-emerald-400' :
                          etapa.status === 'Em Andamento' ? 'text-amber-400' :
                          'text-slate-400'
                        }`}>
                          <CheckSquare className={`w-3.5 h-3.5 ${
                            etapa.status === 'Concluído' ? 'text-emerald-500' :
                            etapa.status === 'Em Andamento' ? 'text-amber-500' :
                            'text-slate-500'
                          }`} />
                          {concluidasSub}/{etapa.subtarefas.length} tarefas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar + Controls */}
                <div className="flex items-center gap-4 self-end md:self-center w-full md:w-auto justify-between md:justify-end">
                  {/* Actions (Editar + Excluir) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAbrirEditar(etapa, e)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                      title="Editar dados desta Etapa (Nome, Responsável, Datas)"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDeletarEtapa(etapa, e)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Excluir esta Etapa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-amber-500" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion Content (Subtasks & Adjuster) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-950/40 rounded-b-2xl animate-fade-in">

                  {/* Checklist de Subtarefas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Tarefas
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      {etapa.subtarefas.map((sub) => {
                        const estaArrastando = subtaskEmArraste?.etapaId === etapa.id && subtaskEmArraste?.subtarefaId === sub.id;

                        return (
                          <div 
                            key={sub.id} 
                            draggable
                            onDragStart={(event) => handleDragStart(etapa.id, sub.id, event)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDropSubtask(etapa.id, sub.id)}
                            className={`p-3 rounded-xl border transition-all ${
                              sub.concluida 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            } ${estaArrastando ? 'opacity-60 ring-2 ring-amber-500/50' : ''}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-start gap-2 flex-1">
                                <GripVertical className="w-3.5 h-3.5 text-slate-500 cursor-grab mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={sub.concluida}
                                      onChange={() => toggleSubtarefa(etapa.id, sub.id)}
                                      className="form-checkbox h-4 w-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500"
                                    />
                                    <span className={`text-xs font-medium ${sub.concluida ? 'line-through text-slate-400' : 'text-white'}`}>
                                      {sub.titulo}
                                    </span>
                                  </div>
                                  {sub.executor && (
                                    <div className="flex items-center gap-1 text-slate-500 text-[10px] font-medium mt-1">
                                      <User className="w-2.5 h-2.5" /> {sub.executor}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center">
                                <button
                                  onClick={() => handleAbrirEditarSubtarefa(sub)}
                                  className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                                  title="Editar Tarefa"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleAbrirObservacoes(etapa.id, sub)}
                                  className="relative p-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors ml-1"
                                  title="Ver/Adicionar Observações e Anexos"
                                >
                                  <MessageSquarePlus className="w-3.5 h-3.5" />
                                  {sub.observacoes.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                                      {sub.observacoes.length}
                                    </span>
                                  )}
                                </button>
                                <button 
                                  onClick={() => setModalConfirmacao({
                                    aberto: true,
                                    titulo: 'Confirmar Exclusão de Tarefa',
                                    mensagem: `Tem certeza que deseja excluir a tarefa "${sub.titulo}"?`,
                                    onConfirm: () => {
                                      removerSubtarefa(etapa.id, sub.id);
                                      setModalConfirmacao({ aberto: false, titulo: '', mensagem: '', onConfirm: () => {} });
                                    }
                                  })}
                                  className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors ml-1"
                                  title="Remover Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inline Add Subtask */}
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 max-w-xl">
                      <input 
                        type="text" 
                        placeholder="Nova tarefa"
                        value={novaSubtarefa[etapa.id]?.titulo || ''}
                        onChange={(e) => setNovaSubtarefa(prev => ({ ...prev, [etapa.id]: { ...prev[etapa.id], titulo: e.target.value } }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubInLine(etapa.id)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Executor (opcional)"
                        value={novaSubtarefa[etapa.id]?.executor || ''}
                        onChange={(e) => setNovaSubtarefa(prev => ({ ...prev, [etapa.id]: { ...prev[etapa.id], executor: e.target.value } }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubInLine(etapa.id)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button 
                        onClick={() => handleAddSubInLine(etapa.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal Nova Etapa */}
      {modalNovaEtapa && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Criar Nova Etapa do Cronograma
              </h3>
              <button onClick={() => setModalNovaEtapa(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarEtapa} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome da Etapa <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Instalação de Esquadrias e Vidros" 
                  value={formEtapa.nome}
                  onChange={(e) => setFormEtapa({ ...formEtapa, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Responsável</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Mestre de Obras" 
                    value={formEtapa.responsavel}
                    onChange={(e) => setFormEtapa({ ...formEtapa, responsavel: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valor Planejado (R$)<span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 15000.00" 
                    value={formEtapa.valorPlanejado}
                    onChange={(e) => setFormEtapa({ ...formEtapa, valorPlanejado: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Início</label>
                  <input 
                    type="date" 
                    value={formEtapa.dataInicio}
                    onChange={(e) => setFormEtapa({ ...formEtapa, dataInicio: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Término</label>
                  <input 
                    type="date" 
                    value={formEtapa.dataFim}
                    onChange={(e) => setFormEtapa({ ...formEtapa, dataFim: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-3">* Campos obrigatórios</p>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setModalNovaEtapa(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!formEtapa.nome || parseFloat(formEtapa.valorPlanejado || 0) <= 0}
                  >
                    Criar Etapa
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Editar Etapa */}
      {etapaEditando && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Editar Etapa do Cronograma
              </h3>
              <button onClick={() => setEtapaEditando(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome da Etapa <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formEdicao.nome}
                  onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Responsável</label>
                <input 
                  type="text" 
                  value={formEdicao.responsavel}
                  onChange={(e) => setFormEdicao({ ...formEdicao, responsavel: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valor Planejado (R$)</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    value={valorPlanejadoDisplay}
                    onChange={(e) => {
                      const limpo = e.target.value.replace(/[^\d,.]/g, '');
                      setValorPlanejadoDisplay(limpo);
                    }}
                    onBlur={() => {
                      setValorPlanejadoDisplay(
                        formatarValor(converterParaNumero(valorPlanejadoDisplay))
                      );
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                {etapaEditando.subtarefas.length > 0 && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Valor Realizado (R$)</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      value={valorRealizadoDisplay}
                      onChange={(e) => {
                        const limpo = e.target.value.replace(/[^\d,.]/g, '');
                        setValorRealizadoDisplay(limpo);
                      }}
                      onBlur={() => {
                        setValorRealizadoDisplay(
                          formatarValor(converterParaNumero(valorRealizadoDisplay))
                        );
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Início</label>
                  <input 
                    type="date" 
                    value={formEdicao.dataInicio}
                    onChange={(e) => setFormEdicao({ ...formEdicao, dataInicio: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Término</label>
                  <input 
                    type="date" 
                    value={formEdicao.dataFim}
                    onChange={(e) => setFormEdicao({ ...formEdicao, dataFim: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-3">* Campos obrigatórios</p>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEtapaEditando(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Observações da Tarefa */}
      {subtarefaModal && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Observações
              </h3>
              <button onClick={() => setModalDetalhes({ etapaId: null, subtarefaId: null })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Formulário para adicionar nova observação */}
              <div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="block text-slate-300 font-bold">Adicionar Nova Observação</label>
                  <textarea 
                    rows="3"
                    placeholder="Adicione notas, problemas encontrados, soluções, etc." 
                    value={novaObservacao.texto}
                    onChange={(e) => setNovaObservacao(prev => ({ ...prev, texto: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                  
                  {/* Preview das imagens a serem enviadas */}
                  <div className="grid grid-cols-4 gap-2">
                    {novaObservacao.arquivos.map((arquivo, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img src={URL.createObjectURL(arquivo)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={() => setNovaObservacao(prev => ({ ...prev, arquivos: prev.arquivos.filter((_, i) => i !== index) }))}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="upload-imagem" className="cursor-pointer flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-2">
                      <UploadCloud className="w-4 h-4" /> Anexar Imagem
                    </label>
                    <input 
                      id="upload-imagem"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setNovaObservacao(prev => ({ ...prev, arquivos: [...prev.arquivos, ...e.target.files] }))}
                    />
                    <button 
                      onClick={handleSalvarObservacao} 
                      disabled={uploading}
                      className="flex-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 disabled:bg-slate-600"
                    >
                      {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div> : <MessageSquarePlus className="w-4 h-4" />}
                      {uploading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Histórico de Observações */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-slate-300 font-bold">Histórico</h4>
                {subtarefaModal.observacoes.length > 0 ? (
                  subtarefaModal.observacoes.map(obs => (
                    <div key={obs.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                      <p className="text-slate-200 text-xs whitespace-pre-wrap">{obs.texto}</p>
                      
                      {/* Galeria de imagens da observação */}
                      {obs.imagens_urls && obs.imagens_urls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/50">
                          {obs.imagens_urls.map((url, index) => (
                            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="relative group aspect-square">
                              <img src={url} alt={`Anexo ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-slate-700" />
                            </a>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] text-slate-500 mt-1 text-right">
                        {new Date(obs.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center text-xs py-4">Nenhuma observação adicionada ainda.</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setModalDetalhes({ etapaId: null, subtarefaId: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Editar Tarefa */}
      {subtarefaEditando && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Editar Tarefa
              </h3>
              <button onClick={() => setSubtarefaEditando(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicaoSubtarefa} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título da Tarefa</label>
                <input
                  type="text"
                  required
                  value={editandoSubtarefaDados.titulo}
                  onChange={(e) => setEditandoSubtarefaDados(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Executor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Nome do executor"
                  value={editandoSubtarefaDados.executor}
                  onChange={(e) => setEditandoSubtarefaDados(prev => ({ ...prev, executor: e.target.value }))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubtarefaEditando(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmação Genérico */}
      {modalConfirmacao.aberto && createPortal(
        <div className="fixed inset-0 z-[1000001] bg-[#020617] flex items-center justify-center p-4">
          <div className="relative z-[1000002] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {modalConfirmacao.titulo}
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                {modalConfirmacao.mensagem}
              </p>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setModalConfirmacao({ aberto: false, titulo: '', mensagem: '', onConfirm: () => {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={modalConfirmacao.onConfirm} 
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
