"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Phone, 
  Cpu, FileText, CheckCircle, Loader2, Clock 
} from 'lucide-react';

export default function SchedulePage() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [ticketId, setTicketId] = useState('');

  // Adăugăm state-uri pentru fiecare câmp din formular
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: 'Laptop', // Valoarea default din select
    date: '',
    issue: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Funcție generică pentru a actualiza state-ul când se tastează în input-uri
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Citim token-ul din browser
      const token = localStorage.getItem('clientToken');
      
      // Pregătim headerele. Dacă avem token, îl adăugăm!
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Trimitem cererea POST către backend
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setTicketId(data.ticket_id); // Preluăm ID-ul generat de server (ex: MT-4512)
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
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold w-full transition-colors"
            >
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
        
        {/* Header cu Buton Back */}
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

        {/* Mesaj de eroare */}
        {status === 'error' && (
           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm text-center">
             A apărut o eroare la salvarea programării. Te rugăm să încerci din nou sau să ne suni.
           </div>
        )}

        {/* Formular */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            
            {/* Sectiunea 1: Date Personale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nume */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Nume Complet
                </label>
                <input 
                  type="text" 
                  name="name" // Legătura cu state-ul
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="ex: Ion Popescu"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={14} /> Telefon
                </label>
                <input 
                  type="tel" 
                  name="phone" // Legătura cu state-ul
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="07xx xxx xxx"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Sectiunea 2: Detalii Tehnice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dispozitiv */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu size={14} /> Tip Dispozitiv
                </label>
                <select 
                  name="device" // Legătura cu state-ul
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

              {/* Data Dorita */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Data Preferată
                </label>
                <input 
                  type="date" 
                  name="date" // Legătura cu state-ul
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Descrierea Problemei */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Descrierea Problemei
              </label>
              <textarea 
                name="issue" // Legătura cu state-ul
                value={formData.issue}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Descrie scurt ce simptome are echipamentul (ex: nu pornește, ecran albastru, face zgomot...)"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
              ></textarea>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 items-start">
              <Clock className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-slate-300">
                <span className="text-blue-400 font-bold block mb-1">Program Service: Luni - Vineri (09:00 - 18:00)</span>
              </div>
            </div>

            {/* Buton Submit */}
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