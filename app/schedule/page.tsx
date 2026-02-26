"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Phone, 
  Cpu, FileText, CheckCircle, Loader2, Clock 
} from 'lucide-react';

export default function SchedulePage() {
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulam un request la server (aici ai lega baza de date in realitate)
    setTimeout(() => {
      setStatus('success');
      setTicketId('#MT-' + Math.floor(1000 + Math.random() * 9000)); // Generam un ID fictiv
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
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
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option>Laptop</option>
                  <option>PC Desktop / Workstation</option>
                  <option>Imprimantă</option>
                  <option>Consolă (PS/Xbox)</option>
                  <option>Altul</option>
                </select>
              </div>

              {/* Data Dorita */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Data Preferată
                </label>
                <input 
                  type="date" 
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