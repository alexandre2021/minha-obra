import React from 'react';
import { useObra } from '../context/ObraContext';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  ArrowUpRight,
  PlusCircle,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const Dashboard = ({ setAbaAtiva }) => {
  const { 
    info, 
    etapas, 
    despesas, 
    orcamentoCategorias = {}, 
    totalGasto, 
    totalPendente, 
    saldoOrcamento, 
    progressoGlobal 
  } = useObra();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Dados para o gráfico de Custos por Categoria
  const categoriaData = Object.keys(orcamentoCategorias).map(cat => {
    const orcado = orcamentoCategorias[cat] || 0;
    const gasto = despesas
      .filter(d => d.categoria === cat && d.status === 'Pago')
      .reduce((acc, curr) => acc + curr.valor, 0);
    return {
      categoria: cat,
      Orçado: orcado,
      Gasto: gasto
    };
  });

  // Dados para o gráfico de Pizza do Progresso das Etapas
  const statusEtapasData = [
    { name: 'Concluído', value: etapas.filter(e => e.status === 'Concluído').length, color: '#10b981' },
    { name: 'Em Andamento', value: etapas.filter(e => e.status === 'Em Andamento').length, color: '#f59e0b' },
    { name: 'Não Iniciada', value: etapas.filter(e => e.status === 'Não Iniciada').length, color: '#475569' },
  ];

  // Alertas inteligentes
  const etapasEmAndamento = etapas.filter(e => e.status === 'Em Andamento');
  const despesasPendentes = despesas.filter(d => d.status === 'Pendente');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Orçamento Total */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orçamento Previsto</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{formatCurrency(info.orcamentoTotal)}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Custo Média/m²:</span>
            <span className="font-semibold text-slate-200">{formatCurrency(info.orcamentoTotal / info.areaConstruida)}</span>
          </div>
        </div>

        {/* Card 2: Total Realizado */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pago (Realizado)</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{formatCurrency(totalGasto)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Comprometido do Total:</span>
            <span className="font-semibold text-emerald-400">
              {((totalGasto / info.orcamentoTotal) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 3: Saldo Disponível */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo em Orçamento</p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{formatCurrency(saldoOrcamento)}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Aguardando Pagamento:</span>
            <span className="font-semibold text-amber-300">{formatCurrency(totalPendente)}</span>
          </div>
        </div>

        {/* Card 4: Progresso Físico */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progresso Global</p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{progressoGlobal}%</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressoGlobal}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Charts & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart: Financial Breakdown by Category */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart className="w-5 h-5 text-amber-500" />
                Orçado vs. Gasto Realizado por Categoria
              </h2>
              <p className="text-xs text-slate-400">Comparativo financeiro das principais frentes da obra</p>
            </div>
            <button 
              onClick={() => setAbaAtiva('financeiro')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Ver Finanças <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriaData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="categoria" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Bar dataKey="Orçado" fill="#334155" radius={[4, 4, 0, 0]} name="Orçado" />
                <Bar dataKey="Gasto" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel: Active Steps & Status */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Etapas Ativas
              </h2>
              <button 
                onClick={() => setAbaAtiva('cronograma')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver Cronograma <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {etapasEmAndamento.map((etapa) => (
                <div key={etapa.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-200">{etapa.nome}</span>
                    <span className="text-xs font-bold text-amber-400">{etapa.progresso}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${etapa.progresso}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Resp: {etapa.responsavel}</span>
                    <span>Até: {etapa.dataFim}</span>
                  </div>
                </div>
              ))}

              {etapasEmAndamento.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Nenhuma etapa em andamento no momento.</p>
              )}
            </div>
          </div>

          {/* Rapid Status distribution */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumo do Cronograma</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
                <p className="text-lg font-bold text-emerald-400">{etapas.filter(e => e.status === 'Concluído').length}</p>
                <p className="text-[10px] text-emerald-300">Concluídas</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                <p className="text-lg font-bold text-amber-400">{etapas.filter(e => e.status === 'Em Andamento').length}</p>
                <p className="text-[10px] text-amber-300">Andamento</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 p-2 rounded-xl">
                <p className="text-lg font-bold text-slate-300">{etapas.filter(e => e.status === 'Não Iniciada').length}</p>
                <p className="text-[10px] text-slate-400">Pendentes</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Grid: Intelligent Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Pending Payments & Critical Alerts */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Alertas & Pagamentos Pendentes
          </h2>

          <div className="space-y-3">
            {despesasPendentes.map((despesa) => (
              <div key={despesa.id} className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{despesa.descricao}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Fornecedor: {despesa.fornecedor} | Vencimento: {despesa.data}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400">{formatCurrency(despesa.valor)}</span>
                  <span className="block text-[10px] uppercase font-bold text-amber-500/80">Pendente</span>
                </div>
              </div>
            ))}

            {despesasPendentes.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Sem contas pendentes no momento. Tudo em dia!</p>
            )}
          </div>
        </div>

        {/* Right: Quick Action Shortcuts */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-amber-500" />
              Ações Rápidas
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setAbaAtiva('financeiro')}
                className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all hover:border-amber-500/40 group"
              >
                <DollarSign className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Lançar Despesa</p>
                <p className="text-xs text-slate-400">Registrar novo pagamento</p>
              </button>

              <button 
                onClick={() => setAbaAtiva('diario')}
                className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all hover:border-amber-500/40 group"
              >
                <FileText className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Novo Diário</p>
                <p className="text-xs text-slate-400">Registrar fotos & rotina</p>
              </button>

              <button 
                onClick={() => setAbaAtiva('cronograma')}
                className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all hover:border-amber-500/40 group"
              >
                <Clock className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Atualizar Etapa</p>
                <p className="text-xs text-slate-400">Modificar progresso físico</p>
              </button>

              <button 
                onClick={() => setAbaAtiva('materiais')}
                className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all hover:border-amber-500/40 group"
              >
                <Layers className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Pedir Material</p>
                <p className="text-xs text-slate-400">Adicionar à lista de compras</p>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
