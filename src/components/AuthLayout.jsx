import React from 'react';
import { useObra } from '../context/ObraContext';
import { Login } from './Login';
import { AppLayout } from './AppLayout';

export const AuthLayout = () => {
  const { session, carregando } = useObra();

  if (carregando) {
    // Você pode adicionar um spinner ou uma tela de carregamento aqui
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <AppLayout />;
};