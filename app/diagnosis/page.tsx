"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; 
import { ArrowLeft, Send, Cpu, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PCMedic() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Salut! Descrie-mi problema pe care o ai cu PC-ul și vom încerca să îi dăm de cap împreună.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const scrollRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || input.length > 500) return;

    const newHistory = [...messages, { role: 'user', content: input }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setStatus('analyzing');

    try {
      const res = await fetch(`${API_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });
      
      // Dacă backend-ul zice că e spam (429 Too Many Requests)
      if (res.status === 429) {
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Detecție Anti-Spam: Ai trimis mesaje prea repede. Te rog să aștepți un minut înainte de a continua." }]);
        setStatus('idle');
        return;
      }

      if (!res.ok) {
         throw new Error("Eroare de la server");
      }

      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      
      if (data.status === 'solution') {
        setStatus('solved');
      } else {
        setStatus('idle');
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Eroare de conexiune la server. Te rog să încerci din nou mai târziu." }]);
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-mono p-4 flex flex-col items-center">
      
      {/* HEADER */}
      <header className="w-full max-w-2xl flex flex-wrap items-center gap-4 mb-6 border-b border-slate-700 pb-4">
        
        <Link 
            href="/" 
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-blue-500 transition-all text-xs font-bold uppercase tracking-wide mr-2"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Înapoi
        </Link>

        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg hidden sm:block">
            <Cpu size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-widest font-sans">AI Diagnostic</h1>
                <p className="text-xs text-slate-400 hidden sm:block font-sans">Asistentul virtual Microtech</p>
            </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs">
            {status === 'solved' ? (
                <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> DIAGNOSTIC FINALIZAT</span>
            ) : (
                <span className="text-blue-400 flex items-center gap-1 animate-pulse"><AlertCircle size={14}/> SE CAUTĂ SOLUȚIE</span>
            )}
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[60vh] custom-scrollbar font-sans">
          {messages.map((msg, idx) => (
            <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : msg.content.includes('⚠️') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-bl-sm'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i !== 0 ? "mt-2" : ""}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-2xl rounded-bl-sm flex items-center gap-2 text-xs text-slate-400 font-sans">
                    <Loader2 size={16} className="animate-spin text-blue-500"/> 
                    Analizez simptomele...
                </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={status === 'solved' ? "Tastează pentru a adresa o nouă întrebare..." : "Descrie simptomele echipamentului tău..."}
              disabled={loading}
              maxLength={500}
              className="flex-1 bg-slate-800 border border-slate-700 text-white p-3 pr-16 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500 font-sans"
            />
            
            {/* Contor caractere (Apare doar dacă scrie mult) */}
            {input.length > 400 && (
                <span className={`absolute right-16 top-1/2 -translate-y-1/2 text-xs font-sans ${input.length >= 500 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                    {input.length}/500
                </span>
            )}

            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[11px] font-sans text-slate-500 mt-3 text-center">
            AI poate oferi diagnostice greșite. Această conversație nu înlocuiește o constatare fizică în service.
          </p>
        </div>

      </div>
    </div>
  );
}