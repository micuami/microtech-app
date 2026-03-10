"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Phone, 
  Cpu, FileText, CheckCircle, Loader2, Clock, Lock 
} from 'lucide-react';

export default function SchedulePage() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [ticketId, setTicketId] = useState('');
  
  // Stări noi pentru verificarea autentificării
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: 'Laptop', 
    date: '',
    issue: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Verificăm dacă utilizatorul este logat asincron
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('clientToken');
      const name = localStorage.getItem('clientName');

      if (token) {
        setIsLoggedIn(true);
        // Dacă știm cum îl cheamă, îi completăm automat numele în formular!
        if (name) {
          setFormData(prev => ({ ...prev, name: name }));
        }
      }
      
      setIsChecking(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const token = localStorage.getItem('clientToken');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setTicketId(data.ticket_id);
        setStatus('success');
      } else {
        setStatus('error');
        console.error("Eroare la crearea tichetului:", await res.text());
      }
    } catch (err) {
      console.error("Eroare de conexiune la server:", err);
      setStatus('error');
    }
  };

  // --- ECRAN DE ÎNCĂRCARE (cât verificăm token-ul) ---
  if (isChecking) {
    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );
  }

  // --- ECRAN PENTRU UTILIZATORI NELOGAȚI ---
  if (!isLoggedIn) {
      return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px]"></div>
                
                <div className="bg-slate-800/50 p-4 rounded-full mb-6 border border-slate-700">
                    <Lock size={32} className="text-slate-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Acces Restricționat</h2>
                <p className="text-slate-400 mb-8">
                    Pentru a putea înregistra o programare în service, trebuie să te autentifici în contul tău de client.
                </p>
                
                <div className="flex flex-col w-full gap-3">
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-lg font-bold transition-colors">
                        Autentificare
                    </Link>
                    <Link href="/register" className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-lg font-bold border border-slate-700 transition-colors">
                        Creare Cont Nou
                    </Link>
                </div>
                
                <Link href="/" className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Înapoi
                </Link>
            </div>
        </div>
      );
  }

  // --- ECRAN DE SUCCES ---
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[50px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-green-500/10 p-4 rounded-full mb-6 border border-green-500/20">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Programare Confirmată!</h2>
            <p className="text-slate-400 mb-6">
              Te așteptăm la service. Un coleg te va contacta în scurt timp pentru confirmarea orei exacte.
            </p>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-full mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Număr Tichet</p>
              <p className="text-2xl font-mono text-blue-400 font-bold tracking-wider">{ticketId}</p>
            </div>

            <Link 
              href="/profile"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold w-full transition-colors block mb-3"
            >
              Vezi în Profilul Meu
            </Link>
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">
              Înapoi la Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULARUL PRINCIPAL ---
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500 selection:text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="group flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-blue-500 transition-all text-xs font-bold uppercase tracking-wide"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Înapoi
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Programează o vizită</h1>
            <p className="text-sm text-slate-400">Completează formularul pentru a aduce echipamentul în service.</p>
          </div>
        </div>

        {status === 'error' && (
           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm text-center">
             A apărut o eroare la salvarea programării. Te rugăm să încerci din nou sau să ne suni.
           </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Nume Complet
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="ex: Ion Popescu"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={14} /> Telefon
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="07xx xxx xxx"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu size={14} /> Tip Dispozitiv
                </label>
                <select 
                  name="device" 
                  value={formData.device}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="PC Desktop">PC Desktop / Workstation</option>
                  <option value="Imprimantă">Imprimantă</option>
                  <option value="Consolă">Consolă (PS/Xbox)</option>
                  <option value="Altul">Altul</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Data Preferată
                </label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Descrierea Problemei
              </label>
              <textarea 
                name="issue" 
                value={formData.issue}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Descrie scurt ce simptome are echipamentul (ex: nu pornește, ecran albastru, face zgomot...)"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
              ></textarea>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 items-start">
              <Clock className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-slate-300">
                <span className="text-blue-400 font-bold block mb-1">Program Service: Luni - Vineri (09:00 - 18:00)</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> Procesare...
                </>
              ) : (
                'Trimite Programarea'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}