"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Salvăm token-ul pentru a recunoaște clientul
        localStorage.setItem('clientToken', data.token);
        localStorage.setItem('clientName', data.name);
        
        // Redirecționăm către pagina principală sau profil
        router.push('/');
      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'Email sau parolă incorecte.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Eroare de conexiune la server.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold">
          <ArrowLeft size={16} /> Înapoi la Acasă
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px]"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">Autentificare</h1>
            <p className="text-slate-400 text-sm mb-8">Bine ai revenit la Microtech!</p>

            {status === 'error' && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ion@email.com" className="w-full bg-slate-800 border border-slate-700 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parolă</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>

              <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6">
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'Intră în cont'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Nu ai cont încă? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold">Creează unul</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}