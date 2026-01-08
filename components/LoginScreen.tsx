import React, { useState } from 'react';
import { Beer, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { dataService } from '../services/dataService';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, existingUsers }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    // Regex: Apenas letras, números e underline. Sem espaços ou caracteres especiais.
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    
    if (!usernameRegex.test(username)) {
      setError('Usuário deve conter apenas letras e números (sem espaços).');
      return false;
    }
    
    if (username.length < 3) {
      setError('Usuário deve ter pelo menos 3 caracteres.');
      return false;
    }

    if (isRegistering && name.length < 2) {
      setError('Nome muito curto.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) return;

    setLoading(true);

    try {
      if (isRegistering) {
        // Register Logic
        const userExists = existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
          setError('Usuário já existe.');
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username,
          name: name || username,
          password, 
          avatar: ''
        };

        await dataService.registerUser(newUser);
        onLogin(newUser);

      } else {
        // Login Logic
        const user = existingUsers.find(
          u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );

        if (user) {
          onLogin(user);
        } else {
          setError('Usuário ou senha incorretos.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Visual */}
        <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Beer className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Cervejômetro</h1>
            <p className="text-amber-100 text-sm mt-1">O controle oficial do gole</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isRegistering ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Seu Nome (Exibido no Ranking)</label>
                <input
                  type="text"
                  required={isRegistering}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  placeholder="Carlos Silva"
                  maxLength={20}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Usuário</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                placeholder="usuario123"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                placeholder="••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg font-medium animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isRegistering ? 'Cadastrar' : 'Entrar'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setPassword('');
              }}
              className="text-sm text-slate-500 hover:text-amber-600 font-medium transition-colors"
            >
              {isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;