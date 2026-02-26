"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        // Salvăm token-ul în localStorage pentru a-l folosi în dashboard (opțional)
        localStorage.setItem('adminToken', data.token);
        
        // Redirecționăm către dashboard
        router.push('/admin/dashboard');
      } else {
        // Dacă backend-ul dă 401 Unauthorized
        setError(true);
      }
    } catch (err) {
      console.error("Eroare de conexiune la server:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080f] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px]"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600/20 p-4 rounded-full border border-blue-500/30">
              <Lock size={32} className="text-blue-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Microtech Admin</h1>
          <p className="text-slate-400 text-center text-sm mb-8">Acces restricționat doar pentru personal.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Parola de acces"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value); 
                    setError(false);
                }}
                disabled={loading}
                className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-center tracking-widest`}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-xs animate-pulse">
                <ShieldAlert size={14} /> Parolă incorectă sau server indisponibil
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'AUTENTIFICARE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}