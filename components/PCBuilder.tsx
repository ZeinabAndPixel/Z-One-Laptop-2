import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Save, X, Cpu, HardDrive, Zap, Box, Monitor, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { Product } from '../types';

// Mock Data specific for the Builder (to ensure we have enough parts for the demo)
const BUILDER_PARTS: Record<string, Product[]> = {
  cpu: [
    { id: 101, name: "Intel Core i9-13900K", category: "Procesador", brand: "Intel", price: 589, rating: 5, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300", specs: ["24 Cores", "5.8 GHz"] },
    { id: 102, name: "AMD Ryzen 9 7950X", category: "Procesador", brand: "AMD", price: 550, rating: 4.8, image: "https://images.unsplash.com/photo-1555618254-71a83705a1a4?auto=format&fit=crop&q=80&w=300", specs: ["16 Cores", "5.7 GHz"] },
    { id: 103, name: "Intel Core i7-13700K", category: "Procesador", brand: "Intel", price: 409, rating: 4.7, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300", specs: ["16 Cores", "5.4 GHz"] },
  ],
  mobo: [
    { id: 201, name: "ASUS ROG Maximus Z790", category: "Tarjeta Madre", brand: "Asus", price: 699, rating: 4.9, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300", specs: ["E-ATX", "DDR5", "WiFi 6E"] },
    { id: 202, name: "MSI MPG B650 Edge", category: "Tarjeta Madre", brand: "MSI", price: 289, rating: 4.5, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300", specs: ["ATX", "AM5", "PCIe 5.0"] },
  ],
  ram: [
    { id: 301, name: "Corsair Vengeance 32GB", category: "Memoria RAM", brand: "Corsair", price: 129, rating: 4.8, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=300", specs: ["DDR5", "6000MHz", "RGB"] },
    { id: 302, name: "G.Skill Trident Z5 64GB", category: "Memoria RAM", brand: "G.Skill", price: 259, rating: 5, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=300", specs: ["DDR5", "6400MHz", "Silver"] },
  ],
  gpu: [
    { id: 401, name: "NVIDIA RTX 4090 FE", category: "Tarjeta de Video", brand: "Nvidia", price: 1599, rating: 5, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300", specs: ["24GB GDDR6X", "Ada Lovelace"] },
    { id: 402, name: "ASUS TUF RTX 4070 Ti", category: "Tarjeta de Video", brand: "Asus", price: 799, rating: 4.6, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300", specs: ["12GB GDDR6X", "OC Edition"] },
  ],
  storage: [
    { id: 501, name: "Samsung 990 PRO 2TB", category: "Almacenamiento", brand: "Samsung", price: 169, rating: 4.9, image: "https://images.unsplash.com/photo-1597872250969-95a283921008?auto=format&fit=crop&q=80&w=300", specs: ["NVMe M.2", "7450 MB/s"] },
    { id: 502, name: "WD Black SN850X 1TB", category: "Almacenamiento", brand: "WD", price: 99, rating: 4.7, image: "https://images.unsplash.com/photo-1597872250969-95a283921008?auto=format&fit=crop&q=80&w=300", specs: ["NVMe M.2", "7300 MB/s"] },
  ],
  psu_case: [
    { id: 601, name: "Corsair RM1000x + 4000D", category: "Combo Case/PSU", brand: "Corsair", price: 299, rating: 4.8, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300", specs: ["1000W Gold", "Mid-Tower", "Airflow"] },
    { id: 602, name: "NZXT H9 Flow + C850", category: "Combo Case/PSU", brand: "NZXT", price: 279, rating: 4.7, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300", specs: ["850W Gold", "Dual Chamber"] },
  ]
};

const STEPS = [
  { id: 'cpu', title: 'Procesador', icon: Cpu, desc: 'El cerebro de tu computadora' },
  { id: 'mobo', title: 'Tarjeta Madre', icon: Box, desc: 'La base de conectividad' },
  { id: 'ram', title: 'Memoria RAM', icon: HardDrive, desc: 'Multitarea y velocidad' },
  { id: 'gpu', title: 'Tarjeta de Video', icon: Monitor, desc: 'Potencia gráfica pura' },
  { id: 'storage', title: 'Almacenamiento', icon: HardDrive, desc: 'Espacio para tus juegos' },
  { id: 'psu_case', title: 'Fuente & Gabinete', icon: Zap, desc: 'Energía y Estilo' },
];

interface PCBuilderProps {
  onClose: () => void;
  onAddMultipleToCart: (products: Product[]) => void;
}

const PCBuilder: React.FC<PCBuilderProps> = ({ onClose, onAddMultipleToCart }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, Product>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentStep = STEPS[currentStepIndex];
  const currentProducts = BUILDER_PARTS[currentStep.id] || [];

  const handleSelectProduct = (product: Product) => {
    setSelections(prev => ({ ...prev, [currentStep.id]: product }));
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    const parts = Object.values(selections);
    onAddMultipleToCart(parts);
    onClose();
  };

  const calculateTotal = () => {
    return Object.values(selections).reduce((sum, item) => sum + item.price, 0);
  };

  const isStepComplete = (stepId: string) => !!selections[stepId];

  // Exit Confirmation Modal
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in-up">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Estás seguro de salir?</h3>
            <p className="text-slate-400 mb-6">Perderás el progreso de tu configuración actual.</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
              >
                Continuar armando
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-xl transition-colors"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">PC Builder Studio</h2>
            <p className="text-xs text-slate-400">Arma tu equipo ideal paso a paso</p>
          </div>
        </div>
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* LEFT: Main Selection Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Progress Bar */}
          <div className="bg-slate-900/50 p-4 overflow-x-auto scrollbar-hide border-b border-slate-800">
            <div className="flex items-center min-w-max px-2">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    currentStepIndex === idx 
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                      : selections[step.id] 
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {selections[step.id] ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    <span className="text-sm font-bold whitespace-nowrap">{step.title}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${idx < currentStepIndex ? 'bg-cyan-500/30' : 'bg-slate-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{currentStep.title}</h3>
                <p className="text-slate-400">{currentStep.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProducts.map(product => {
                  const isSelected = selections[currentStep.id]?.id === product.id;
                  return (
                    <div 
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`relative group cursor-pointer bg-slate-800/40 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-row h-40 ${
                        isSelected 
                          ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-1/3 bg-slate-900 p-4 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white leading-tight mb-1">{product.name}</h4>
                            {isSelected && <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{product.specs.join(" • ")}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xl font-bold text-cyan-400">${product.price}</span>
                          <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isSelected ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-white group-hover:bg-slate-600'
                          }`}>
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Nav (Mobile/Desktop) */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
            <button 
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            
            {currentStepIndex === STEPS.length - 1 ? (
              <button 
                onClick={handleFinish}
                disabled={!isStepComplete(currentStep.id)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Terminar y Agregar <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleNext}
                disabled={!isStepComplete(currentStep.id)}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Summary Panel */}
        <div className="hidden lg:flex w-96 bg-slate-900 border-l border-slate-800 flex-col">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white mb-1">Tu Configuración</h3>
            <p className="text-sm text-slate-400">Resumen en tiempo real</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {STEPS.map(step => {
              const selectedItem = selections[step.id];
              return (
                <div key={step.id} className={`p-4 rounded-xl border transition-all ${
                  selectedItem ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-slate-900 border-slate-800 border-dashed'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <step.icon className="w-3 h-3" /> {step.title}
                  </div>
                  {selectedItem ? (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{selectedItem.name}</p>
                        <p className="text-xs text-slate-400">{selectedItem.brand}</p>
                      </div>
                      <p className="text-sm font-bold text-cyan-400">${selectedItem.price}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 italic">Pendiente de selección...</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-slate-950 border-t border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Total Estimado</span>
              <span className="text-3xl font-bold text-white font-mono">${calculateTotal().toLocaleString()}</span>
            </div>
            {currentStepIndex === STEPS.length - 1 && isStepComplete(currentStep.id) && (
              <p className="text-xs text-green-400 text-center animate-pulse">
                ¡Configuración completa! Lista para añadir al carrito.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;