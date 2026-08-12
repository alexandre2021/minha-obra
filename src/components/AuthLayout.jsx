import React, { useEffect, useState } from 'react';
import { useObra } from '../context/ObraContext';
import { Login } from './Login';
import { AppLayout } from './AppLayout';
import { DefinirSenha } from './DefinirSenha';

export const AuthLayout = () => {
  const { session, carregando } = useObra();
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Verifica se a URL contém os parâmetros para recuperação/definição de senha
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get('type');

    if (type === 'recovery') {
      setIsRecovery(true);
    }
  }, []);

  if (carregando) {
    // Você pode adicionar um spinner ou uma tela de carregamento aqui
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Carregando...
      </div>
    );
  }

  // Se for um fluxo de recuperação/definição de senha, mostra a tela específica
  if (isRecovery) { // Remove a verificação de !session
    return <DefinirSenha />;
  }

  if (!session) {
    return <Login />;
  }

  return <AppLayout />;
};