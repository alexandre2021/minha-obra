import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useObra } from '../context/ObraContext';
import { 
  Building2, 
  Plus,
  Trash2,
  MapPin, 
  User, 
  HardHat, 
  ChevronDown,
  DollarSign,
  Layers,  
  Home,
  AlertTriangle,
  RotateCcw,  
  Pencil,
  X,
  LogOut,
  MailPlus
} from 'lucide-react';

export const Header = () => {
  const { info, progressoGlobal, session, profile, signOutUser, atualizarInfoObra, obras, obraAtualId, selecionarObra, criarObra, removerObra, convidarProprietario } = useObra();
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [modalObraAberto, setModalObraAberto] = useState(false);
  const [menuObrasAberto, setMenuObrasAberto] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState({
    aberto: false,
    titulo: '',
    mensagem: '',
    onConfirm: () => {},
  });
  const [orcamentoDisplay, setOrcamentoDisplay] = useState('');
  const [orcamentoNovaObraDisplay, setOrcamentoNovaObraDisplay] = useState('');
  const [modalConviteAberto, setModalConviteAberto] = useState(false);
  const [emailConvidado, setEmailConvidado] = useState('');
  const [conviteStatus, setConviteStatus] = useState({ enviando: false, erro: '', sucesso: '' });

  const [formNovaObra, setFormNovaObra] = useState({
    nome: '',
    endereco: '',
    proprietario: '',
    proprietarioEmail: '', // Novo campo
    engenheiro: '',
    arquiteto: '',
    status: 'Planejamento',
    orcamentoTotal: '',
    areaConstruida: ''
  });

  useEffect(() => {
    const shouldLockScroll = modalEditAberto || modalObraAberto || menuObrasAberto || modalConfirmacao.aberto || modalConviteAberto;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalEditAberto, modalObraAberto, menuObrasAberto, modalConfirmacao.aberto, modalConviteAberto]);

  const [formInfo, setFormInfo] = useState({
    nome: info.nome,
    endereco: info.endereco,
    proprietario: info.proprietario,
    proprietario_email: info.proprietario_email,
    engenheiro: info.engenheiro,
    arquiteto: info.arquiteto,
    status: info.status,
    areaConstruida: info.areaConstruida,
    orcamentoTotal: info.orcamentoTotal
  });

  const formatarOrcamento = (valor) => {
    if (valor === null || valor === undefined || valor === '') return '';

    const numero = Number(valor);

    if (isNaN(numero)) return '';

    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const converterOrcamentoParaNumero = (valor) => {
    if (!valor) return 0;

    return parseFloat(
      String(valor)
        .replace(/\./g, '')
        .replace(',', '.')
    ) || 0;
  };

  const handleSalvarInfo = (e) => {
    e.preventDefault();

    atualizarInfoObra({
      ...formInfo,
      areaConstruida: parseFloat(formInfo.areaConstruida || 0),
      orcamentoTotal: converterOrcamentoParaNumero(orcamentoDisplay)
    });

    setModalEditAberto(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val || 0));
  };

  const handleCriarNovaObra = async (e) => {
    e.preventDefault();
    if (!formNovaObra.nome.trim()) return;
    const novoId = await criarObra({
      ...formNovaObra,
      orcamentoTotal: converterOrcamentoParaNumero(orcamentoNovaObraDisplay)
    });

    setOrcamentoNovaObraDisplay('');
    setModalObraAberto(false);
  };

  const handleRemoverObra = async (obraId, obraNome) => {
    setModalConfirmacao({
      aberto: true,
      titulo: 'Confirmar Exclusão de Obra',
      mensagem: `Tem certeza que deseja excluir a obra "${obraNome}"? Todas as suas etapas, tarefas e dados financeiros serão perdidos permanentemente. Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        await removerObra(obraId);
        setModalConfirmacao({ aberto: false, titulo: '', mensagem: '', onConfirm: () => {} });
      }
    });
  };

  const handleEnviarConvite = async (e) => {
    e.preventDefault();
    if (!emailConvidado) return;

    setConviteStatus({ enviando: true, erro: '', sucesso: '' });
    const { error } = await convidarProprietario(emailConvidado, obraAtualId);

    if (error) {
      setConviteStatus({ enviando: false, erro: 'Falha ao enviar convite. Verifique o e-mail ou tente novamente.', sucesso: '' });
    } else {
      setConviteStatus({ enviando: false, erro: '', sucesso: `Convite enviado com sucesso para ${emailConvidado}!` });
      setTimeout(() => {
        setModalConviteAberto(false);
        setEmailConvidado('');
        setConviteStatus({ enviando: false, erro: '', sucesso: '' });
      }, 3000);
    }
  };


  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-6">
          
          {/* Coluna 1: Logo */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Building2 className="w-8 h-8" />
            </div>
          </div>

          {/* Coluna 2: Informações da Obra e Ações */}
          <div className="flex-grow">
            {obras.length > 0 && info ? (
              <div className="flex items-center gap-6">
                {/* Bloco de Informações da Obra */}
                <div>
                  {/* Linha 1: Nome e Ações */}
                  <div className="relative">
                    <button 
                      onClick={() => setMenuObrasAberto(!menuObrasAberto)}
                      className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tight hover:text-amber-400 transition-colors"
                    >
                      {info.nome}
                      <ChevronDown className={`w-5 h-5 transition-transform ${menuObrasAberto ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Menu Dropdown de Obras */}
                    {menuObrasAberto && (
                      <div className="absolute top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-[100] animate-fade-in-fast">
                        {obras.map(obra => (
                          <button
                            key={obra.id}
                            onClick={() => { selecionarObra(obra.id); setMenuObrasAberto(false); }}
                            className={`w-full text-left p-2 rounded-lg text-sm font-semibold transition-colors ${
                              obra.id === obraAtualId ? 'bg-amber-500/10 text-amber-400' : 'text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {obra.nome}
                          </button>
                        ))}
                        <div className="border-t border-slate-800 my-2"></div>
                        <button onClick={() => { setModalObraAberto(true); setMenuObrasAberto(false); }} className="w-full flex items-center gap-2 p-2 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                          <Plus className="w-4 h-4" /> Criar Nova Obra
                        </button>
                        {obras.length > 1 && (
                          <button onClick={() => { setMenuObrasAberto(false); handleRemoverObra(obraAtualId, info.nome); }} className="w-full flex items-center gap-2 p-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> Excluir Obra Atual
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Linha 2: Badges */}
                  <div className="flex items-center gap-3 flex-wrap mt-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{info.status}</span>
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      <Home className="w-3 h-3" /> Área: {info.areaConstruida > 0 ? `${info.areaConstruida} m²` : 'Não informada'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Layers className="w-3 h-3" /> Progresso: {progressoGlobal}%
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <DollarSign className="w-3 h-3" /> Orçamento: {formatCurrency(info.orcamentoTotal)}
                    </span>
                  </div>
                  {/* Linha 3: Detalhes */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{info.endereco}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" />{info.proprietario}</span>
                    <span className="flex items-center gap-1"><HardHat className="w-3.5 h-3.5 text-slate-500" />{info.engenheiro}</span>
                  </div>
                </div>

                {/* Bloco de Botões de Ação */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { 
                      setFormInfo({
                        nome: info.nome,
                        endereco: info.endereco,
                        proprietario: info.proprietario,
                        proprietario_email: info.proprietario_email,
                        engenheiro: info.engenheiro,
                        arquiteto: info.arquiteto,
                        status: info.status,
                        areaConstruida: info.areaConstruida,
                        orcamentoTotal: info.orcamentoTotal
                      }); 
                      setOrcamentoDisplay(formatarOrcamento(info.orcamentoTotal)); 
                      setModalEditAberto(true); 
                    }}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                    title="Editar Dados da Obra"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoverObra(obraAtualId, info.nome)} 
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    title="Excluir Obra Atual"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setEmailConvidado(info.proprietario_email || '');
                        setModalConviteAberto(true);
                      }}
                      className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
                      title="Convidar Proprietário para esta Obra"
                    >
                      <MailPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button onClick={() => setModalObraAberto(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2">
                <Plus className="w-5 h-5" /> Obra
              </button>
            )}
          </div>

          {/* Coluna 3: Informações do Usuário */}
          <div className="flex items-center justify-end">
            {session && (
              <div className="text-slate-400 text-xs flex items-center justify-end gap-3">
                <span className="text-slate-200 font-medium">{session.user.email}</span>
                <button 
                  onClick={signOutUser}
                  className="flex items-center gap-1.5 font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalObraAberto && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Criar Nova Obra
              </h3>
              <button onClick={() => setModalObraAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarNovaObra} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título da Obra <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Casa de Praia"
                  value={formNovaObra.nome}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Endereço Completo <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Rua das Flores, 123 - Bairro Jardim"
                  value={formNovaObra.endereco}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, endereco: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Proprietário</label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={formNovaObra.proprietario}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, proprietario: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail do Proprietário (para o convite)</label>
                <input
                  type="email"
                  placeholder="Ex: joao.silva@email.com"
                  value={formNovaObra.proprietarioEmail}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, proprietarioEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Responsável pela Obra</label>
                <input
                  type="text"
                  placeholder="Ex: Eng. Carlos Alberto"
                  value={formNovaObra.engenheiro}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, engenheiro: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Status Inicial</label>
                <select
                  value={formNovaObra.status}
                  onChange={(e) => setFormNovaObra({ ...formNovaObra, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Planejamento">Planejamento</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Pausada">Pausada</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Área (m²)</label>
                  <input
                    type="number"
                    placeholder="Ex: 220"
                    value={formNovaObra.areaConstruida}
                    onChange={(e) => setFormNovaObra({ ...formNovaObra, areaConstruida: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Orçamento Total (R$)<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="Ex: 900000.00"
                  value={orcamentoNovaObraDisplay}
                  onChange={(e) => {
                    const valor = e.target.value;
                    const limpo = valor.replace(/[^\d,.]/g, '');
                    setOrcamentoNovaObraDisplay(limpo);
                  }}
                  onBlur={() => {
                    setOrcamentoNovaObraDisplay(
                      formatarOrcamento(converterOrcamentoParaNumero(orcamentoNovaObraDisplay))
                    );
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-3">* Campos obrigatórios</p>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setModalObraAberto(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!formNovaObra.nome || !formNovaObra.endereco || converterOrcamentoParaNumero(orcamentoNovaObraDisplay) <= 0}>
                    Criar Obra
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Editar Dados Gerais da Obra */}
      {modalEditAberto && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Editar Informações da Obra
              </h3>
              <button onClick={() => setModalEditAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarInfo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título da Obra <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex.: Casa de Praia"
                  value={formInfo.nome}
                  onChange={(e) => setFormInfo({ ...formInfo, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Endereço Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formInfo.endereco}
                  onChange={(e) => setFormInfo({ ...formInfo, endereco: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Proprietário</label>
                  <input 
                    type="text" 
                    value={formInfo.proprietario}
                    onChange={(e) => setFormInfo({ ...formInfo, proprietario: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">E-mail do Proprietário</label>
                  <input
                    type="email"
                    placeholder="email.proprietario@exemplo.com"
                    value={formInfo.proprietario_email}
                    onChange={(e) => setFormInfo({ ...formInfo, proprietario_email: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Responsável</label>
                  <input 
                    type="text" 
                    value={formInfo.engenheiro}
                    onChange={(e) => setFormInfo({ ...formInfo, engenheiro: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select 
                    value={formInfo.status}
                    onChange={(e) => setFormInfo({ ...formInfo, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Planejamento">Planejamento</option>
                    <option value="Pausada">Pausada</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Área (m²)</label>
                  <input 
                    type="number" 
                    value={formInfo.areaConstruida}
                    onChange={(e) => setFormInfo({ ...formInfo, areaConstruida: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Orçamento (R$)<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={orcamentoDisplay}
                    onChange={(e) => {
                      const valor = e.target.value;

                      // Permite somente números, pontos e uma vírgula decimal
                      const limpo = valor.replace(/[^\d,.]/g, '');

                      setOrcamentoDisplay(limpo);
                    }}
                    onBlur={() => {
                      setOrcamentoDisplay(
                        formatarOrcamento(converterOrcamentoParaNumero(orcamentoDisplay))
                      );
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-3">* Campos obrigatórios</p>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setModalEditAberto(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={converterOrcamentoParaNumero(orcamentoDisplay) <= 0}
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

      {/* Modal Convidar Proprietário */}
      {modalConviteAberto && createPortal(
        <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-start justify-center p-4 pt-12 sm:pt-16">
          <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in text-left shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MailPlus className="w-5 h-5 text-blue-500" />
                Convidar Proprietário
              </h3>
              <button onClick={() => setModalConviteAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Você está convidando um proprietário para visualizar a obra: <strong className="text-white">{info.nome}</strong>. Ele receberá um e-mail para criar uma conta e acompanhar o progresso.
            </p>

            <form onSubmit={handleEnviarConvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail do Proprietário</label>
                <input
                  type="email"
                  required
                  placeholder="email.proprietario@exemplo.com"
                  value={emailConvidado}
                  onChange={(e) => setEmailConvidado(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {conviteStatus.erro && <p className="text-red-400 text-center">{conviteStatus.erro}</p>}
              {conviteStatus.sucesso && <p className="text-emerald-400 text-center">{conviteStatus.sucesso}</p>}

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalConviteAberto(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={conviteStatus.enviando} className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold disabled:bg-slate-600">
                  {conviteStatus.enviando ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
};
