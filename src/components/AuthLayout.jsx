import React from 'react';
import { useObra } from '../context/ObraContext';
import { Login } from './Login';
import { AppLayout } from './AppLayout';
import { DefinirSenha } from './DefinirSenha';

export const AuthLayout = () => {
  const { session, carregando, signOutUser } = useObra();

  // Verificação síncrona, fora do useEffect, para evitar race conditions.
  // Isso garante que a verificação ocorra antes do primeiro render.
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.substring(1));
  const type = params.get('type');
  const isRecovery = type === 'recovery';

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Carregando...
      </div>
    );
  }

  // Se a URL for para recuperação de senha, SEMPRE mostre a tela de definir senha,
  // independentemente de haver uma sessão temporária.
  if (isRecovery) {
    return <DefinirSenha />;
  }
  if (isRecovery) {
    return <DefinirSenha />;
  }

  if (!session) {
    return <Login />;
  }
  return <AppLayout />;
};