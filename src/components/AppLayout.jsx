import React, { useState } from 'react';
import { Header } from './Header';
import { Cronograma } from './Cronograma';
import { Financeiro } from './Financeiro';
import { Dashboard } from './Dashboard';
import { Materiais } from './Materiais';
import { EquipeFornecedores } from './EquipeFornecedores';
import { DiarioObra } from './DiarioObra';
import { useObra } from '../context/ObraContext';
import { Building2 } from 'lucide-react';

export const AppLayout = () => {
  const [abaAtiva, setAbaAtiva] = useState('cronograma');
  const { obras, carregando } = useObra();

  const renderAba = () => {
    switch (abaAtiva) {
      case 'dashboard':
        return <Dashboard setAbaAtiva={setAbaAtiva} />;
      case 'cronograma':
        return <Cronograma />;
      case 'financeiro':
        return <Financeiro />;
      case 'materiais':
        return <Materiais />;
      case 'equipe':
        return <EquipeFornecedores />;
      case 'diario':
        return <DiarioObra />;
      default:
        return <Dashboard setAbaAtiva={setAbaAtiva} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header /> {/* O Header é sempre visível e lida com seu próprio estado de "sem obras" */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {carregando ? (
          <div className="flex items-center justify-center text-lg text-slate-400">
            Carregando dados...
          </div>
        ) : obras.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full mt-20 animate-fade-in">
            <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20 text-slate-950 font-bold mb-6">
              <Building2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">Bem-vindo ao Mais Obra!</h2>
            <p className="text-slate-400 mt-2 max-w-md">
              Parece que você ainda não tem nenhuma obra cadastrada.
              Clique no botão "+ Obra" no cabeçalho para começar a gerenciar seu primeiro projeto.
            </p>
          </div>
        ) : (
          // Renderiza as abas apenas se houver obras
          renderAba()
        )}
      </main>
    </div>
  );
};