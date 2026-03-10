import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermeniPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold">
          <ArrowLeft size={16} /> Înapoi
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <FileText className="text-blue-400" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Termeni și Condiții</h1>
        </div>

        <div className="space-y-8 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introducere</h2>
            <p>
              Acest document stabilește termenii și condițiile de utilizare a platformei web Microtech și a serviciilor oferite de <strong>MICROTECH SRL</strong>, cu sediul în <strong>Sos. Bucuresti Bl. 45/4D Sc. E Ap. 13</strong>, înregistrată la Registrul Comerțului sub nr. <strong>J52/365/2003</strong>, CUI <strong>15813443</strong>.
              Prin programarea unei reparații sau crearea unui cont, ești de acord cu acești termeni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Servicii și Diagnosticare</h2>
            <p className="mb-2">
              Microtech oferă servicii de diagnosticare, reparații hardware, instalare software și mentenanță IT. 
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Timpul de reparație estimat este orientativ și depinde de disponibilitatea pieselor de schimb.</li>
              <li>Ne rezervăm dreptul de a refuza reparația echipamentelor care prezintă daune severe sau intervenții neautorizate anterioare.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Contul de Utilizator</h2>
            <p>
              Pentru a vizualiza istoricul programărilor, utilizatorii trebuie să își creeze un cont gratuit. Ești responsabil pentru păstrarea confidențialității parolei. Microtech nu îți va cere niciodată parola contului prin email sau telefon.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Garanție</h2>
            <p>
              Oferim garanție pentru componentele hardware noi instalate, conform producătorului (de obicei 12-24 luni). Garanția se anulează dacă echipamentul prezintă șocuri fizice, contact cu lichide sau sigilii rupte după ridicarea din service.
            </p>
          </section>

          <div className="border-t border-slate-800 pt-6 mt-8 text-sm text-slate-500">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
          </div>
        </div>
      </div>
    </div>
  );
}