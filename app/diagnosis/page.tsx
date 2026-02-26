"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; 
import { ArrowLeft, Send, Cpu, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PCMedic() {
  // Starea pentru mesaje
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Descrie problema ta cu PC-ul și voi încerca să o diagnostichez.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, analyzing, solved
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll la ultimul mesaj
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Adăugăm mesajul utilizatorului în UI
    const newHistory = [...messages, { role: 'user', content: input }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setStatus('analyzing');

    try {
      // 2. Trimitem tot istoricul la Backend
      const res = await fetch('http://127.0.0.1:8000/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });
      
      const data = await res.json();

      // 3. Adăugăm răspunsul AI în UI
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      
      // 4. Verificăm dacă e soluție sau întrebare
      if (data.status === 'solution') {
        setStatus('solved');
      } else {
        setStatus('idle');
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection Error. Is the backend running?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-mono p-4 flex flex-col items-center">
      
      {/* HEADER */}
      <header className="w-full max-w-2xl flex flex-wrap items-center gap-4 mb-6 border-b border-slate-700 pb-4">
        
        {/* --- BUTONUL DE BACK VIZIBIL --- */}
        <Link 
            href="/" 
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-blue-500 transition-all text-xs font-bold uppercase tracking-wide mr-2"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Înapoi
        </Link>
        {/* ------------------------------- */}

        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg hidden sm:block">
            <Cpu size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-widest">PC Medic AI</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Diagnosticare automată</p>
            </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs">
            {status === 'solved' ? (
                <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> CASE CLOSED</span>
            ) : (
                <span className="text-blue-400 flex items-center gap-1 animate-pulse"><AlertCircle size={14}/> DIAGNOSTIC MODE</span>
            )}
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 w-full max-w-2xl bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[60vh] custom-scrollbar">
          {messages.map((msg, idx) => (
            <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                }`}
              >
                {/* Formatare simplă pentru liste (dacă AI dă pași) */}
                {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-700/50 p-3 rounded-lg rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 size={14} className="animate-spin"/> 
                    Analizare jurnale de sistem...
                </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={status === 'solved' ? "Tastează pentru un nou diagnostic..." : "Descrie simptomele..."}
              disabled={loading}
              className="flex-1 bg-slate-800 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 mt-2 text-center">
            AI poate greși. Verifică întotdeauna instrucțiunile hardware.
          </p>
        </div>

      </div>
    </div>
  );
}