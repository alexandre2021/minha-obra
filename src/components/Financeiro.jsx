import React, { useState } from 'react';
import { useObra } from '../context/ObraContext';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Filter, 
  FileText, 
  Search,
  Building,
  Tag,
  Calendar,
  X
} from 'lucide-react';

export const Financeiro = () => {
  const { 
    despesas, 
    orcamentoCategorias, 
    totalGasto, 
    totalPendente, 
    saldoOrcamento, 
    adicionarDespesa, 
    removerDespesa,
    etapas,
    info,
    subtarefaBudgetSummary
  } = useObra();

  const [modalAberto, setModalAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [busca, setBusca] = useState('');

  // Form State
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: '',
    categoria: 'Geral',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    fornecedor: '',
    status: 'Pago',
    comprovante: 'recibo_anexo.pdf',
    etapaId: '',
    etapaNome: '',
    subtarefaId: '',
    subtarefaTitulo: ''
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const categoriasList = Array.from(
    new Set([
      ...despesas.map((d) => d.categoria).filter(Boolean),
      ...Object.keys(orcamentoCategorias || {}).filter((cat) => {
        if (!cat || cat === 'Projetos & Taxas') return false;
        const valorOrcado = Number(orcamentoCategorias[cat] || 0);
        return valorOrcado > 0 || despesas.some((d) => d.categoria === cat);
      })
    ])
  );

  if (categoriasList.length === 0) {
    categoriasList.push('Geral');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaDespesa.descricao || !novaDespesa.valor) return;

    adicionarDespesa({
      ...novaDespesa,
      valor: parseFloat(novaDespesa.valor)
    });

    setNovaDespesa({
      descricao: '',
      categoria: categoriasList[0] || 'Geral',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      fornecedor: '',
      status: 'Pago',
      comprovante: 'recibo_anexo.pdf',
      etapaId: '',
      etapaNome: '',
      subtarefaId: '',
      subtarefaTitulo: ''
    });
    setModalAberto(false);
  };

  // Filtragem de despesas
  const despesasFiltradas = despesas.filter(d => {
    const matchStatus = filtroStatus === 'Todos' || d.status === filtroStatus;
    const matchBusca = d.descricao.toLowerCase().includes(busca.toLowerCase()) || 
                       d.fornecedor.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner & Budget Summary */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-500" />
            Controle Financeiro & Orçamento da Obra
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gestão detalhada de compras, notas fiscais, recibos e medições de mão de obra.
          </p>
        </div>

        <button 
          onClick={() => setModalAberto(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Lançar Nova Despesa
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Pago (Realizado)</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{formatCurrency(totalGasto)}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Aguardando Pagamento</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{formatCurrency(totalPendente)}</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Saldo do Orçamento</p>
            <p className="text-xl font-bold text-blue-400 mt-0.5">{formatCurrency(saldoOrcamento)}</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subtask Budget Summary */}
      {subtarefaBudgetSummary.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Planejamento e execução por etapa e subtarefa
          </h3>

          <div className="space-y-4">
            {etapas.map((etapa) => {
              const itensDaEtapa = subtarefaBudgetSummary.filter((item) => item.etapaId === etapa.id);
              const valorPlanejadoEtapa = itensDaEtapa.reduce((acc, item) => acc + (item.valorPlanejado || 0), 0);
              const valorRealizadoEtapa = itensDaEtapa.reduce((acc, item) => acc + (item.valorRealizado || 0), 0);
              const percentualEtapa = valorPlanejadoEtapa > 0
                ? Math.min(100, Math.round((valorRealizadoEtapa / valorPlanejadoEtapa) * 100))
                : 0;
              const saldoEtapa = valorPlanejadoEtapa - valorRealizadoEtapa;

              return (
                <div key={etapa.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{etapa.nome}</p>
                      <p className="text-[11px] text-slate-400">{itensDaEtapa.length} subtarefas vinculadas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Etapa • Realizado / Planejado</p>
                      <p className="text-sm font-bold text-amber-400">{formatCurrency(valorRealizadoEtapa)} / {formatCurrency(valorPlanejadoEtapa)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Execução da etapa</span>
                      <span>{percentualEtapa}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${percentualEtapa > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, percentualEtapa)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Saldo da etapa</span>
                    <span className={saldoEtapa >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatCurrency(saldoEtapa)}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {itensDaEtapa.length > 0 ? itensDaEtapa.map((item) => {
                      const saldo = (item.valorPlanejado || 0) - (item.valorRealizado || 0);
                      return (
                        <div key={`${item.etapaId}-${item.subtarefaId}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-white">{item.subtarefaTitulo}</p>
                              <p className="text-[11px] text-slate-400">{item.etapaNome}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500">Realizado / Planejado</p>
                              <p className="text-sm font-bold text-amber-400">{formatCurrency(item.valorRealizado || 0)} / {formatCurrency(item.valorPlanejado || 0)}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Execução: {item.percentual}%</span>
                            <span className={saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}>Saldo: {formatCurrency(saldo)}</span>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="rounded-lg border border-dashed border-slate-800 p-3 text-sm text-slate-400">
                        Nenhuma subtarefa com orçamento vinculado nesta etapa.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Buscar por descrição ou fornecedor..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-800">
                <th className="p-4">Descrição</th>
                <th className="p-4">Vínculo</th>
                <th className="p-4">Fornecedor</th>
                <th className="p-4">Data</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {despesasFiltradas.map((despesa) => (
                <tr key={despesa.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-slate-100">{despesa.descricao}</td>
                  <td className="p-4 text-slate-300">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px]">
                      {despesa.subtarefaTitulo ? `${despesa.etapaNome || 'Etapa'} • ${despesa.subtarefaTitulo}` : (despesa.etapaNome || despesa.categoria || 'Sem vínculo')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{despesa.fornecedor || '-'}</td>
                  <td className="p-4 text-slate-400">{despesa.data}</td>
                  <td className="p-4 font-bold text-white">{formatCurrency(despesa.valor)}</td>
                  <td className="p-4">
                    {despesa.status === 'Pago' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] uppercase">
                        Pago
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px] uppercase">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => removerDespesa(despesa.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Excluir Lançamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {despesasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Nenhuma despesa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançar Nova Despesa */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Nova Despesa / Lançamento</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Descrição do Item / Serviço</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Compra de 50 sacos de cimento" 
                  value={novaDespesa.descricao}
                  onChange={(e) => setNovaDespesa({ ...novaDespesa, descricao: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoria</label>
                  <select 
                    value={novaDespesa.categoria}
                    onChange={(e) => setNovaDespesa({ ...novaDespesa, categoria: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    {categoriasList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="0.00" 
                    value={novaDespesa.valor}
                    onChange={(e) => setNovaDespesa({ ...novaDespesa, valor: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fornecedor / Favorecido</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Depósito ConstruMais" 
                    value={novaDespesa.fornecedor}
                    onChange={(e) => setNovaDespesa({ ...novaDespesa, fornecedor: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data</label>
                  <input 
                    type="date" 
                    value={novaDespesa.data}
                    onChange={(e) => setNovaDespesa({ ...novaDespesa, data: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vincular a uma subtarefa do cronograma</label>
                <select
                  value={novaDespesa.etapaId}
                  onChange={(e) => {
                    const etapaSelecionada = etapas.find((etapa) => etapa.id === Number(e.target.value));
                    setNovaDespesa({
                      ...novaDespesa,
                      etapaId: e.target.value,
                      etapaNome: etapaSelecionada?.nome || '',
                      subtarefaId: '',
                      subtarefaTitulo: ''
                    });
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Sem vínculo com etapa</option>
                  {etapas.map((etapa) => (
                    <option key={etapa.id} value={etapa.id}>{etapa.nome}</option>
                  ))}
                </select>
              </div>

              {novaDespesa.etapaId && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subtarefa relacionada</label>
                  <select
                    value={novaDespesa.subtarefaId}
                    onChange={(e) => {
                      const subtarefaSelecionada = etapas
                        .find((etapa) => etapa.id === Number(novaDespesa.etapaId))
                        ?.subtarefas?.find((sub) => String(sub.id) === e.target.value);

                      setNovaDespesa({
                        ...novaDespesa,
                        subtarefaId: e.target.value,
                        subtarefaTitulo: subtarefaSelecionada?.titulo || ''
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Selecione uma subtarefa</option>
                    {etapas
                      .find((etapa) => etapa.id === Number(novaDespesa.etapaId))
                      ?.subtarefas?.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.titulo}</option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">Status do Pagamento</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Pago"
                      checked={novaDespesa.status === 'Pago'}
                      onChange={() => setNovaDespesa({ ...novaDespesa, status: 'Pago' })}
                      className="accent-amber-500"
                    />
                    <span>Pago</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Pendente"
                      checked={novaDespesa.status === 'Pendente'}
                      onChange={() => setNovaDespesa({ ...novaDespesa, status: 'Pendente' })}
                      className="accent-amber-500"
                    />
                    <span>Pendente</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
