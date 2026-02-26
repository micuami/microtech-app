"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Cpu, Wrench, Disc, Printer, Shield, HardDrive, 
  Phone, Clock, Zap 
} from 'lucide-react';

export default function MicrotechHome() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-slate-800 bg-[#0a0f1c]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              MICRO<span className="text-blue-500">TECH</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#services" className="hover:text-blue-400 transition-colors">Servicii</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>

          <Link 
            href="/diagnosis" // Link către pagina ta cu AI
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Zap size={16} />
            AI DIAGNOSTIC
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Service IT
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Reparații Calculatoare <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Rapid & Profesionist
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Soluții complete sub același acoperiș: fie că ai nevoie de o simplă instalare de sistem, consumabile pentru imprimantă sau reparații hardware complexe, noi avem expertiza necesară.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/diagnosis"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <Zap size={20} />
              Diagnostichează cu AI
            </Link>
            <Link 
              href="/schedule"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Programează o vizită
            </Link>
          </div>
        </div>
      </section>

      

      {/* --- SERVICES GRID --- */}
      <section id="services" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Serviciile Noastre</h2>
            <p className="text-slate-400">Soluții complete pentru echipamentele tale IT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Hardware */}
            <ServiceCard 
              icon={<Wrench className="text-blue-400" size={24} />}
              title="Reparații Hardware"
              desc="Diagnostice și înlocuire componente defecte (Sursă, Placă Video, RAM). Reparații pe placa de bază."
            />

            {/* Service 2: Windows */}
            <ServiceCard 
              icon={<Disc className="text-purple-400" size={24} />}
              title="Instalare Software"
              desc="Instalare Windows 10/11 cu licență, drivere actualizate și pachet de programe esențiale."
            />

            {/* Service 3: Tonere (Cerinta Ta) */}
            <ServiceCard 
              icon={<Printer className="text-cyan-400" size={24} />}
              title="Reîncărcare Tonere"
              desc="Serviciu rapid de reîncărcare cartușe și tonere pentru imprimante laser și inkjet. Calitate garantată."
            />

            {/* Service 4: Devirusare */}
            <ServiceCard 
              icon={<Shield className="text-green-400" size={24} />}
              title="Devirusare & Securitate"
              desc="Curățare completă de malware, spyware și instalare soluții antivirus performante."
            />

            {/* Service 5: Mentenanta */}
            <ServiceCard 
              icon={<Cpu className="text-amber-400" size={24} />}
              title="Curățare & Mentenanță"
              desc="Schimbare pastă termoconductoare, curățare praf profesională pentru a preveni supraîncălzirea."
            />

            {/* Service 6: Data Recovery */}
            <ServiceCard 
              icon={<HardDrive className="text-red-400" size={24} />}
              title="Recuperare Date"
              desc="Recuperăm date pierdute de pe HDD-uri defecte, SSD-uri sau stick-uri USB corupte."
            />

          </div>
        </div>
      </section>

      {/* --- FOOTER / CONTACT --- */}
      <footer id="contact" className="bg-[#05080f] pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded">
                <Cpu size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                MICRO<span className="text-blue-500">TECH</span>
                </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
                Partenerul tău de încredere pentru orice problemă IT. 
                Suntem dedicați calității și transparenței în reparații.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                    <Phone className="text-blue-500 shrink-0" size={18} />
                    <span>07xx.xxx.xxx</span>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="text-blue-500 shrink-0" size={18} />
                    <span>Luni - Vineri: 09:00 - 18:00</span>
                </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
             <h3 className="text-white font-bold mb-6">Link-uri Utile</h3>
             <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/diagnosis" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">AI Diagnostic Tool</Link></li>
             </ul>
          </div>

        </div>
        
        <div className="text-center border-t border-slate-800 pt-8 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Microtech Service. Toate drepturile rezervate.
        </div>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group hover:bg-slate-800">
            <div className="mb-4 bg-slate-900 w-fit p-3 rounded-lg border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}