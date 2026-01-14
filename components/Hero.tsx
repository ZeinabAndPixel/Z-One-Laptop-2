import React from 'react';
import { ChevronRight, Cpu } from 'lucide-react';

interface HeroProps {
  onOpenBuilder?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBuilder }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-xs font-bold mb-6 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          NUEVA SERIE RTX 40 YA DISPONIBLE
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Poder Sin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Límites</span>.
          <br /> Diseño Sin Rival.
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Encuentra equipos de alto rendimiento diseñados para gaming competitivo y trabajo profesional. 
          Garantía extendida y envíos a todo el país.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] flex items-center justify-center gap-2"
          >
            Ver Catálogo <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenBuilder}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 group hover:border-cyan-500/50"
          >
            Armar mi PC <Cpu className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;