import React, { useState, useEffect } from 'react';
import { supabase } from '../context/ObraContext';
import { Building2, KeyRound, Eye, EyeOff } from 'lucide-react';

export const DefinirSenha = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Lê o token da URL de forma síncrona na primeira renderização
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    const type = params.get('type');

    if (type === 'recovery' && token) {
      setAccessToken(token);
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
    } else {
      setError('Link inválido ou expirado. Por favor, solicite um novo convite.');
    }
    window.location.hash = ''; // Limpa o hash para evitar re-processamento
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!accessToken) {
      setError('Token de acesso não encontrado. O link pode ter expirado.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Usa o updateUser para definir a nova senha. O token já foi setado no `useEffect`.
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(`Erro ao definir a senha: ${updateError.message}`);
    } else {
      setMessage('Senha definida com sucesso! Você será redirecionado em breve.');
      // Redireciona para a página principal após um pequeno atraso
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
            <Building2 className="w-10 h-10 text-slate-950" />
          </div>
        </div>
        <div className="glass-card bg-slate-900/80 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Defina sua Senha</h1>
            <p className="text-slate-400 text-sm mt-2">Crie uma senha segura para acessar a plataforma Mais Obra.</p>
          </div>

          {message ? (
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nova Senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirme a Nova Senha"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {error && <p className="text-red-400 text-center text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || !accessToken}
                className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Senha e Acessar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};