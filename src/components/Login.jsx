import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../context/ObraContext';
import { Building2, LogIn, Eye, EyeOff, Mail, X } from 'lucide-react';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetView, setShowResetView] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Falha no login. Verifique seu e-mail e senha.');
      console.error('Login error:', error.message);
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    setResetLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin,
    });

    if (resetError) {
      setResetError('Falha ao enviar e-mail. Verifique o endereço e tente novamente.');
    } else {
      setResetMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }

    setResetLoading(false);
  };

  return (
    <>
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full glass-card bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="inline-block p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 text-slate-950 font-bold mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Mais Obra</h1>
          <p className="text-slate-400 mt-1">Acesse para gerenciar suas obras.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 text-xs">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1 text-xs">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-amber-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowResetView(true)}
              className="text-xs text-amber-400 hover:text-amber-300 hover:underline"
            >
              Esqueci a senha
            </button>
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 disabled:bg-slate-600">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div> : <LogIn className="w-5 h-5" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>

    {showResetView && createPortal(
      <div className="fixed inset-0 z-[1000000] bg-[#020617] flex items-center justify-center p-4">
        <div className="relative z-[1000001] glass-card bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-8 space-y-6 animate-fade-in text-left shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              Recuperar Senha
            </h3>
            <button onClick={() => setShowResetView(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {resetMessage ? (
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
              {resetMessage}
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400">
                Digite seu e-mail para receber as instruções de como redefinir sua senha.
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">E-mail</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {resetError && <p className="text-xs text-red-400 text-center">{resetError}</p>}

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowResetView(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">
                    Cancelar
                  </button>
                  <button type="submit" disabled={resetLoading} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:bg-slate-600">
                    {resetLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  );
};