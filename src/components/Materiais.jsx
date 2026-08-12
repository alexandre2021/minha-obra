import React, { useState } from 'react';
import { useObra } from '../context/ObraContext';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShoppingCart, 
  Truck, 
  X,
  Search
} from 'lucide-react';

export const Materiais = () => {
  const { materiais, adicionarMaterial, atualizarMaterialStatus } = useObra();
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');

  const [novoMat, setNovoMat] = useState({
    nome: '',
    categoria: 'Estrutural',
    qtdNecessaria: '',
    qtdComprada: 0,
    unidade: 'Sacos',
    precoMedio: '',
    status: 'Cotado',
    fornecedor: ''
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Entregue':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Entregue</span>;
      case 'Em Uso':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1"><Truck className="w-3 h-3" /> Em Uso</span>;
      case 'Cotado':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> Cotado</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Pendente</span>;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novoMat.nome || !novoMat.qtdNecessaria) return;

    adicionarMaterial({
      ...novoMat,
      qtdNecessaria: parseFloat(novoMat.qtdNecessaria),
      qtdComprada: parseFloat(novoMat.qtdComprada || 0),
      precoMedio: parseFloat(novoMat.precoMedio || 0)
    });

    setNovoMat({
      nome: '',
      categoria: 'Estrutural',
      qtdNecessaria: '',
      qtdComprada: 0,
      unidade: 'Sacos',
      precoMedio: '',
      status: 'Cotado',
      fornecedor: ''
    });
    setModalAberto(false);
  };

  const materiaisFiltrados = materiais.filter(m => 
    m.nome.toLowerCase().includes(busca.toLowerCase()) || 
    m.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            Gestão de Materiais e Suprimentos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Controle de requisição de compras, entregas e cotações de insumos da obra.
          </p>
        </div>

        <button 
          onClick={() => setModalAberto(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Adicionar Material
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Filtrar insumo ou categoria..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materiaisFiltrados.map((item) => {
          const pct = Math.round((item.qtdComprada / item.qtdNecessaria) * 100) || 0;

          return (
            <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {item.categoria}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{item.nome}</h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-xs text-slate-400">
                  Fornecedor: <span className="text-slate-200">{item.fornecedor || 'A definir'}</span>
                </p>
              </div>

              {/* Progress Quantity Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                  <span>Comprado: {item.qtdComprada} {item.unidade}</span>
                  <span>Total: {item.qtdNecessaria} {item.unidade}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mb-2">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Preço Est.: {formatCurrency(item.precoMedio)} / {item.unidade}</span>
                  <span className="font-bold text-white">Total: {formatCurrency(item.precoMedio * item.qtdNecessaria)}</span>
                </div>
              </div>

              {/* Change Status Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Alterar Status:</span>
                <select 
                  value={item.status}
                  onChange={(e) => atualizarMaterialStatus(item.id, e.target.value)}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-400 focus:outline-none"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Cotado">Cotado</option>
                  <option value="Em Uso">Em Uso</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Adicionar Material */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Novo Material de Construção</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome do Insumo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Argamassa AC-III 20kg" 
                  value={novoMat.nome}
                  onChange={(e) => setNovoMat({ ...novoMat, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoria</label>
                  <select 
                    value={novoMat.categoria}
                    onChange={(e) => setNovoMat({ ...novoMat, categoria: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Estrutural">Estrutural</option>
                    <option value="Alvenaria">Alvenaria</option>
                    <option value="Agregados">Agregados</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Instalações">Instalações</option>
                    <option value="Acabamento">Acabamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unidade</label>
                  <input 
                    type="text" 
                    placeholder="Sacos, m³, Barras, m²" 
                    value={novoMat.unidade}
                    onChange={(e) => setNovoMat({ ...novoMat, unidade: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Qtd Necessária</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Ex: 50" 
                    value={novoMat.qtdNecessaria}
                    onChange={(e) => setNovoMat({ ...novoMat, qtdNecessaria: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço Médio / Unid (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Ex: 45.00" 
                    value={novoMat.precoMedio}
                    onChange={(e) => setNovoMat({ ...novoMat, precoMedio: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Fornecedor Preferencial</label>
                <input 
                  type="text" 
                  placeholder="Ex: Depósito ConstruMais" 
                  value={novoMat.fornecedor}
                  onChange={(e) => setNovoMat({ ...novoMat, fornecedor: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
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
                  Cadastrar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
