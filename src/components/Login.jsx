import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building2, LogIn, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  return (
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

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 disabled:bg-slate-600">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div> : <LogIn className="w-5 h-5" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};