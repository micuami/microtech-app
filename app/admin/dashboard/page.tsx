"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cpu, Users, Calendar, CheckCircle, Clock,
  XCircle, Search, LogOut, FileText
} from 'lucide-react';
import './dashboard.css'; // <-- Importă fișierul de stiluri

// Interfața TypeScript pentru a defini cum arată datele unui tichet
interface Ticket {
  id: string;
  name: string;
  device: string;
  issue: string;
  date: string;
  status: string;
  phone: string;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  // Acesta va folosi automat link-ul de Render pe Vercel, sau Localhost pe PC-ul tău
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- 1. VERIFICARE AUTENTIFICARE (Protecția paginii) ---
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Dacă nu are token, îl trimitem forțat la pagina de login
      router.push('/admin');
    }
  }, [router]);

  // --- 2. PRELUAREA DATELOR DE LA BACKEND LA MONTARE ---
  useEffect(() => {
    fetch(`${API_URL}/api/tickets`)
      .then(res => res.json())
      .then(data => {
        // Presupunând că backend-ul returnează: { "tickets": [...] }
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Eroare la preluarea tichetelor:", err);
        setLoading(false);
      });
  }, [API_URL]);

  // Calcularea statisticilor
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'Pending').length,
    completed: tickets.filter(t => t.status === 'Completed').length,
  };

  // --- 3. SCHIMBAREA STATUSULUI CĂTRE BACKEND ---
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Dacă serverul confirmă, actualizăm și interfața
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error("Eroare la schimbarea statusului:", err);
    }
  };

  // --- 4. ȘTERGEREA UNUI TICHET CĂTRE BACKEND ---
  const handleDelete = async (id: string) => {
    if(confirm('Sigur vrei să ștergi acest tichet?')) {
      try {
        const res = await fetch(`${API_URL}/api/tickets/${id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
           // Dacă serverul confirmă ștergerea, îl scoatem din listă vizual
           setTickets(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        console.error("Eroare la ștergerea tichetului:", err);
      }
    }
  };

  // --- 5. FUNCȚIA DE DECONECTARE ---
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('adminToken'); // Ștergem "cheia"
    router.push('/admin'); // Trimitem adminul înapoi la poartă (Login)
  };

  // Filtrarea vizuală a tichetelor (bara de căutare)
  const filteredTickets = tickets.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">

      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
            <div className="sidebar-logo">
                <Cpu size={20} />
            </div>
            <span className="sidebar-title">
                ADMIN<span>PANEL</span>
            </span>
        </div>

        <nav className="sidebar-nav">
            <NavItem active icon={<FileText size={18}/>} text="Programări" />
            <NavItem icon={<Users size={18}/>} text="Clienți" />
            <NavItem icon={<Calendar size={18}/>} text="Calendar" />
        </nav>

        {/* Butonul de Deconectare Securizat */}
        <button 
            onClick={handleLogout} 
            className="logout-btn" 
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', fontSize: 'inherit', fontFamily: 'inherit' }}
        >
            <LogOut size={18} /> Deconectare
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">

        {/* HEADER */}
        <div className="header">
            <div>
                <h1>Dashboard Programări</h1>
                <p>Gestionează tichetele de service.</p>
            </div>
            
            <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Caută după nume sau ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
            <StatCard title="Total Tichete" value={stats.total} icon={<FileText color="#60a5fa" />} />
            <StatCard title="În Așteptare" value={stats.pending} icon={<Clock color="#facc15" />} />
            <StatCard title="Finalizate" value={stats.completed} icon={<CheckCircle color="#4ade80" />} />
        </div>

        {/* TABEL */}
        <div className="table-wrapper">
            {loading ? (
                <div className="empty-state">Se preiau datele de pe server...</div>
            ) : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID Tichet</th>
                                <th>Client</th>
                                <th>Problema / Device</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="ticket-id">{ticket.id}</td>
                                    <td>
                                        <div className="table-text-main">{ticket.name}</div>
                                        <div className="table-text-sub">{ticket.phone}</div>
                                    </td>
                                    <td>
                                        <div>{ticket.device}</div>
                                        <div className="table-text-sub">{ticket.issue}</div>
                                    </td>
                                    <td>{ticket.date}</td>
                                    <td>
                                        <StatusBadge status={ticket.status} />
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {ticket.status !== 'Completed' && (
                                                <button
                                                    onClick={() => handleStatusChange(ticket.id, 'Completed')}
                                                    title="Marchează Finalizat"
                                                    className="btn-action btn-complete"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(ticket.id)}
                                                title="Șterge"
                                                className="btn-action btn-delete"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredTickets.length === 0 && !loading && (
                        <div className="empty-state">
                            Nu am găsit niciun tichet conform căutării.
                        </div>
                    )}
                </>
            )}
        </div>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon, text, active = false }: { icon: React.ReactNode, text: string, active?: boolean }) {
    return (
        <div className={`nav-item ${active ? 'active' : ''}`}>
            {icon}
            <span>{text}</span>
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="stat-card">
            <div>
                <p className="stat-title">{title}</p>
                <p className="stat-value">{value}</p>
            </div>
            <div className="stat-icon-wrapper">
                {icon}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const statusClassMap: Record<string, string> = {
        'Pending': 'badge-pending',
        'In Progress': 'badge-progress',
        'Completed': 'badge-completed',
    };
    
    const className = statusClassMap[status] || '';
    
    return (
        <span className={`badge ${className}`}>
            {status}
        </span>
    );
}