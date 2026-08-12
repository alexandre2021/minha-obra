import React, { useState, useEffect } from 'react';
import { useObra } from '../context/ObraContext';
import { Login } from './Login';
import { AppLayout } from './AppLayout';
import { DefinirSenha } from './DefinirSenha';

export const AuthLayout = () => {
  const { session, carregando, signOutUser } = useObra();

  // Lê o hash apenas UMA vez, na primeira renderização.
  // Depois disso, mesmo que o hash seja limpo ou re-render aconteça,
  // esse valor não muda.
  const [authFlow] = useState(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get('type');
    return type === 'recovery' || type === 'invite' ? type : null;
  });

  useEffect(() => {
    if (authFlow) {
      window.history.replaceState(null, '', ' ');
    }
  }, [authFlow]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Carregando...
      </div>
    );
  }

  if (authFlow === 'recovery' || authFlow === 'invite') {
    return <DefinirSenha />;
  }

  if (!session) {
    return <Login />;
  }
  return <AppLayout />;
};