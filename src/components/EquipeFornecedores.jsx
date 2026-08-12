import React, { useState } from 'react';
import { useObra } from '../context/ObraContext';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  HardHat, 
  DollarSign, 
  CheckCircle, 
  UserCheck, 
  X,
  Building2
} from 'lucide-react';

export const EquipeFornecedores = () => {
  const { equipe, adicionarEquipe } = useObra();
  const [modalAberto, setModalAberto] = useState(false);

  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    funcao: 'Pedreiro Especializado',
    telefone: '',
    email: '',
    status: 'Ativo na Obra',
    pagamentoTipo: 'Por Medição',
    valorContrato: '',
    pagoAteAgora: 0
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novoMembro.nome || !novoMembro.funcao) return;

    adicionarEquipe({
      ...novoMembro,
      valorContrato: parseFloat(novoMembro.valorContrato || 0),
      pagoAteAgora: parseFloat(novoMembro.pagoAteAgora || 0)
    });

    setNovoMembro({
      nome: '',
      funcao: 'Pedreiro Especializado',
      telefone: '',
      email: '',
      status: 'Ativo na Obra',
      pagamentoTipo: 'Por Medição',
      valorContrato: '',
      pagoAteAgora: 0
    });
    setModalAberto(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            Gestão de Equipe, Empreiteiros & Fornecedores
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Contatos, funções, vigência de contratos e histórico de medições de mão de obra.
          </p>
        </div>

        <button 
          onClick={() => setModalAberto(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Profissional
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipe.map((membro) => {
          const pctPago = membro.valorContrato > 0 
            ? Math.round((membro.pagoAteAgora / membro.valorContrato) * 100) 
            : 0;

          return (
            <div key={membro.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{membro.nome}</h3>
                      <span className="text-xs font-semibold text-amber-400">{membro.funcao}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {membro.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{membro.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{membro.email}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Regime: <strong className="text-slate-200">{membro.pagamentoTipo}</strong></span>
                  </div>
                </div>
              </div>

              {/* Financial progress of contract */}
              {membro.valorContrato > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                    <span className="text-slate-400">Medições Pagas:</span>
                    <span className="text-emerald-400">{formatCurrency(membro.pagoAteAgora)} de {formatCurrency(membro.valorContrato)} ({pctPago}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all" 
                      style={{ width: `${pctPago}%` }} 
                    />
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal Adicionar Profissional */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Novo Profissional / Empreiteiro</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome Completo / Empresa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João da Silva Santos" 
                  value={novoMembro.nome}
                  onChange={(e) => setNovoMembro({ ...novoMembro, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Função / Especialidade</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Eletricista, Pedreiro" 
                    value={novoMembro.funcao}
                    onChange={(e) => setNovoMembro({ ...novoMembro, funcao: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="(11) 90000-0000" 
                    value={novoMembro.telefone}
                    onChange={(e) => setNovoMembro({ ...novoMembro, telefone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail</label>
                <input 
                  type="email" 
                  placeholder="contato@profissional.com" 
                  value={novoMembro.email}
                  onChange={(e) => setNovoMembro({ ...novoMembro, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valor do Contrato (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 15000.00" 
                    value={novoMembro.valorContrato}
                    onChange={(e) => setNovoMembro({ ...novoMembro, valorContrato: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Pago até Agora (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 5000.00" 
                    value={novoMembro.pagoAteAgora}
                    onChange={(e) => setNovoMembro({ ...novoMembro, pagoAteAgora: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
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
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
