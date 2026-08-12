import React, { useState } from 'react';
import { useObra } from '../context/ObraContext';
import { 
  Camera, 
  Plus, 
  Sun, 
  CloudRain, 
  Users, 
  Calendar, 
  AlertCircle,
  X,
  FileText,
  Thermometer
} from 'lucide-react';

export const DiarioObra = () => {
  const { diarioObra, adicionarDiarioObra } = useObra();
  const [modalAberto, setModalAberto] = useState(false);

  const [novoRegistro, setNovoRegistro] = useState({
    data: new Date().toISOString().split('T')[0],
    clima: 'Ensolarado',
    temperatura: '27°C',
    efetivo: 6,
    atividades: '',
    ocorrencias: '',
    imagem: '/images/alvenaria.jpg'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novoRegistro.atividades) return;

    adicionarDiarioObra({
      ...novoRegistro,
      efetivo: parseInt(novoRegistro.efetivo)
    });

    setNovoRegistro({
      data: new Date().toISOString().split('T')[0],
      clima: 'Ensolarado',
      temperatura: '27°C',
      efetivo: 6,
      atividades: '',
      ocorrencias: '',
      imagem: '/images/alvenaria.jpg'
    });
    setModalAberto(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-500" />
            Diário de Obra & Acompanhamento Fotográfico
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Registro diário de condições climáticas, equipe em campo, evolução das fases e fotos.
          </p>
        </div>

        <button 
          onClick={() => setModalAberto(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Novo Registro Diário
        </button>
      </div>

      {/* Timeline Entries */}
      <div className="space-y-6">
        {diarioObra.map((registro) => (
          <div key={registro.id} className="glass-card rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Info & Activities */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>{registro.data}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300 flex items-center gap-1.5 font-semibold">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    {registro.clima} ({registro.temperatura})
                  </span>

                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300 flex items-center gap-1.5 font-semibold">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {registro.efetivo} Trabalhadores no Canteiro
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Atividades Realizadas no Dia:
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {registro.atividades}
                </p>
              </div>

              {registro.ocorrencias && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Ocorrências & Observações da Engenharia:
                  </h4>
                  <p className="text-xs text-slate-300 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                    {registro.ocorrencias}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Site Photo Preview */}
            <div className="flex flex-col items-center justify-center">
              {registro.imagem ? (
                <div className="relative group w-full h-56 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                  <img 
                    src={registro.imagem} 
                    alt={`Foto da obra em ${registro.data}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
                    Foto Oficial do Canteiro
                  </span>
                </div>
              ) : (
                <div className="w-full h-56 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-500">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs">Sem foto anexada</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal Novo Diário */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Novo Registro de Diário de Obra</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data do Diário</label>
                  <input 
                    type="date" 
                    required
                    value={novoRegistro.data}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, data: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operários Presentes</label>
                  <input 
                    type="number" 
                    required
                    value={novoRegistro.efetivo}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, efetivo: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Condição do Tempo</label>
                  <select 
                    value={novoRegistro.clima}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, clima: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Ensolarado">Ensolarado</option>
                    <option value="Nublado">Nublado</option>
                    <option value="Chuvoso">Chuvoso</option>
                    <option value="Vento Forte">Vento Forte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Temperatura Aprox.</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 26°C"
                    value={novoRegistro.temperatura}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, temperatura: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Resumo das Atividades Executadas</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Descreva o que foi feito na obra hoje (ex: concretagem da laje, assentamento de tijolos)..." 
                  value={novoRegistro.atividades}
                  onChange={(e) => setNovoRegistro({ ...novoRegistro, atividades: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ocorrências / Observações (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Entrega de lote de tijolos; vistoria do engenheiro..." 
                  value={novoRegistro.ocorrencias}
                  onChange={(e) => setNovoRegistro({ ...novoRegistro, ocorrencias: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL da Foto da Obra</label>
                <select 
                  value={novoRegistro.imagem}
                  onChange={(e) => setNovoRegistro({ ...novoRegistro, imagem: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="/images/alvenaria.jpg">Foto 1: Alvenaria & Estrutura</option>
                  <option value="/images/fundacao.jpg">Foto 2: Fundação & Concretagem</option>
                </select>
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
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
