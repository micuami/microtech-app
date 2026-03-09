"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, LogOut, Ticket, Clock, 
  CheckCircle, Loader2, Cpu, Calendar 
} from 'lucide-react';

// Definim cum arată datele primite
interface ClientTicket {
  id: string; // Acesta e ticket_id-ul gen MT-1234
  device: string;
  issue: string;
  date: string;
  status: string;
}

export default function ProfilePage() {
  const [tickets, setTickets] = useState<ClientTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 1. Verificăm dacă utilizatorul este logat
    const token = localStorage.getItem('clientToken');
    const name = localStorage.getItem('clientName');

    if (!token) {
      router.replace('/login');
      return;
    }

    // 2. Cerem tichetele de la backend (folosind token-ul ca legitimație)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    fetch(`${API_URL}/api/users/me/tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Așa demonstrăm cine suntem!
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Neautorizat");
        return res.json();
      })
      .then(data => {
        if (name) setUserName(name);
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Dacă token-ul a expirat sau e invalid, îl trimitem la login
        localStorage.removeItem('clientToken');
        router.replace('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientName');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Profil */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm font-bold">
              <ArrowLeft size={16} /> Înapoi la Acasă
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-full border border-blue-500/30">
                <User size={24} className="text-blue-500" />
              </div>
              Salut, {userName.split(' ')[0]}!
            </h1>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-all w-fit"
          >
            <LogOut size={16} /> Deconectare
          </button>
        </div>

        {/* Istoric Tichete */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <Ticket className="text-blue-400" size={20} />
            <h2 className="text-xl font-bold text-white">Istoric Programări</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-4">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              Se încarcă datele...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket size={24} className="text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nu ai nicio programare.</h3>
              <p className="text-slate-400 mb-6">Când vei avea un echipament în service, detaliile vor apărea aici.</p>
              <Link href="/schedule" className="inline-flex bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                Programează o vizită
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{ticket.id}</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cpu size={16} className="text-slate-400" /> {ticket.device}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-1">{ticket.issue}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[300px]">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={14} /> {ticket.date}
                    </div>
                    
                    <div>
                      {ticket.status === 'Completed' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">
                          <CheckCircle size={14} /> Finalizat
                        </span>
                      ) : ticket.status === 'In Progress' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
                          <Loader2 size={14} className="animate-spin" /> În Lucru
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-700 text-slate-300 border border-slate-600 rounded-full text-xs font-bold">
                          <Clock size={14} /> În Așteptare
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}