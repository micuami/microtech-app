import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold">
          <ArrowLeft size={16} /> Înapoi
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-600/20 p-2 rounded-lg border border-green-500/30">
            <Shield className="text-green-400" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Confidențialitate & Cookie</h1>
        </div>

        <div className="space-y-8 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Ce date colectăm</h2>
            <p>
              Conform normelor GDPR, colectăm doar datele strict necesare pentru a-ți putea oferi serviciile noastre de reparații IT:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Nume și Prenume:</strong> Pentru a te putea identifica la predarea/preluarea echipamentului.</li>
              <li><strong>Număr de telefon:</strong> Pentru a te contacta rapid privind statusul reparației sau costuri neprevăzute.</li>
              <li><strong>Adresa de Email:</strong> Pentru crearea contului și trimiterea confirmărilor.</li>
              <li><strong>Parola:</strong> Salvată în format criptat și complet ilizibil pentru noi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Cum folosim datele</h2>
            <p>
              Datele tale sunt folosite EXCLUSIV pentru prestarea serviciilor IT solicitate. Nu vindem, nu închiriem și nu cedăm datele tale către terți pentru marketing. Istoricul reparațiilor este păstrat pentru a-ți oferi garanție și un suport tehnic mai bun pe viitor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Politica de &quot;Cookie-uri&quot; și Stocare Locală</h2>
            <p className="mb-2">
              Acest site web a fost construit punând respectul pentru intimitatea ta pe primul loc. 
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <p className="text-sm">
                <strong>Nu folosim cookie-uri de urmărire (Tracking/Marketing).</strong><br />
                Nu avem Google Analytics, Facebook Pixel sau alte scripturi care să îți urmărească activitatea.
                Folosim exclusiv tehnologia <code>localStorage</code> din browserul tău, într-un mod strict funcțional, pentru a salva un &quot;jeton tehnic&quot; (Token) care ne permite să menținem contul tău conectat cât timp folosești site-ul.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Drepturile Tale (GDPR)</h2>
            <p>
              Conform legislației europene, ai următoarele drepturi:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Dreptul de acces:</strong> Poți vedea toate datele pe care le avem despre tine direct în &quot;Profilul Meu&quot;.</li>
              <li><strong>Dreptul de a fi uitat:</strong> Ne poți solicita ștergerea completă a contului și a istoricului tău din baza noastră de date printr-un email la <strong>terranetgr@gmail.com</strong>.</li>
              <li><strong>Dreptul la rectificare:</strong> Ne poți solicita corectarea datelor greșite.</li>
            </ul>
          </section>

          <div className="border-t border-slate-800 pt-6 mt-8 text-sm text-slate-500">
            Pentru orice întrebări legate de protecția datelor, ne poți contacta la: <strong>terranetgr@gmail.com</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}