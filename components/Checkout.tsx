import React, { useState, useEffect } from 'react';
import { X, Truck, CreditCard, CheckCircle, ChevronRight, ChevronLeft, Package, ShieldCheck, Banknote, User } from 'lucide-react';
import { CartItem } from '../types';
// Busca esto al principio y agrega la última línea:
interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onOrderComplete: (data: any) => void; // <--- Agrega esto
}


type Step = 'shipping' | 'payment' | 'review' | 'success';
type ShippingMethod = 'standard' | 'express';
type PaymentMethod = 'card' | 'transfer';
// Cambia la línea de inicio por esta:

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, onClearCart, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Form States
  const [shippingData, setShippingData] = useState({
    fullName: '',
    cedula: '',
    address: '',
    city: '',
    method: 'standard' as ShippingMethod
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingData.method === 'express' ? 10 : 0;
  const total = subtotal + shippingCost;

  // Validation
  const isShippingValid = shippingData.fullName.trim() !== '' && 
                          shippingData.cedula.trim() !== '' && 
                          shippingData.address.trim() !== '' && 
                          shippingData.city.trim() !== '';

  // Handlers
  const handleNextStep = () => {
    if (currentStep === 'shipping') {
      if (isShippingValid) setCurrentStep('payment');
    }
    else if (currentStep === 'payment') setCurrentStep('review');
  };

  const handlePrevStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
  };
const handlePlaceOrder = async () => { // Añadimos 'async'
    setIsLoading(true);
    
    try {
      // PREPARAR LOS DATOS PARA NEON
      const customerData = {
  cedula: shippingData.cedula, // <--- Enviamos la cédula real
  name: shippingData.fullName,
  email: `${shippingData.fullName.toLowerCase().replace(' ', '.')}@example.com`,
  phone: "0424-0000000",
  address: `${shippingData.address}, ${shippingData.city}`
};

await onOrderComplete(customerData); // LLAMADA REAL A LA NUBE
      // Si todo sale bien, mostramos el éxito
      const randomId = `ZT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(randomId);
      setCurrentStep('success');
      // onClearCart(); // Ya lo hace handlePurchaseComplete en App.tsx
    } catch (err) {
      alert("Error al conectar con la base de datos de Neon");
    } finally {
      setIsLoading(false);
    }
  };

  // Render Helpers
  const renderStepIndicator = () => {
    const steps = [
      { id: 'shipping', label: 'Envío', icon: Truck },
      { id: 'payment', label: 'Pago', icon: CreditCard },
      { id: 'review', label: 'Confirmar', icon: ShieldCheck },
    ];

    return (
      <div className="flex justify-between items-center mb-8 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > idx || currentStep === 'success';
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isActive || isCompleted ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-bold ${isActive || isCompleted ? 'text-cyan-400' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // ---------------- VIEW: SUCCESS ----------------
  if (currentStep === 'success') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">¡Orden Recibida!</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">
          Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.
        </p>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm mb-8 text-center">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Número de Pedido</p>
          <p className="text-2xl font-mono font-bold text-cyan-400 tracking-widest">{orderId}</p>
        </div>

        <button 
          onClick={onClose}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  // ---------------- VIEW: MAIN CHECKOUT ----------------
  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-sm flex justify-center overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-950 min-h-screen md:min-h-0 md:my-10 md:rounded-3xl border border-slate-800 shadow-2xl flex flex-col relative animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur z-20 md:rounded-t-3xl">
          <h2 className="text-xl font-bold text-white">Finalizar Compra</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-6 md:p-8">
          {renderStepIndicator()}

          {/* STEP 1: SHIPPING */}
          {currentStep === 'shipping' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-white mb-4">Datos de Envío</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                
                {/* Nuevo Campo: Cédula de Identidad */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Cédula de Identidad <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={shippingData.cedula}
                    onChange={(e) => setShippingData({...shippingData, cedula: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="V-12.345.678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Dirección de Entrega <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={shippingData.address}
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Calle, Número, Apto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ciudad <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={shippingData.city}
                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Ej: El Tigre"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-white mb-3">Método de Envío</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${shippingData.method === 'standard' ? 'bg-cyan-900/10 border-cyan-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="hidden" 
                      checked={shippingData.method === 'standard'}
                      onChange={() => setShippingData({...shippingData, method: 'standard'})}
                    />
                    <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                      {shippingData.method === 'standard' && <div className="w-3 h-3 bg-cyan-500 rounded-full" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">Estándar</div>
                      <div className="text-xs text-green-400">Gratis (3-5 días)</div>
                    </div>
                  </label>

                  <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${shippingData.method === 'express' ? 'bg-cyan-900/10 border-cyan-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      className="hidden" 
                      checked={shippingData.method === 'express'}
                      onChange={() => setShippingData({...shippingData, method: 'express'})}
                    />
                    <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                      {shippingData.method === 'express' && <div className="w-3 h-3 bg-cyan-500 rounded-full" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">Express</div>
                      <div className="text-xs text-cyan-400">+$10.00 (24h)</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {currentStep === 'payment' && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-white mb-4">Método de Pago</h3>
              
              {/* Tabs */}
              <div className="flex bg-slate-900 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-white'}`}
                >
                  Tarjeta de Crédito
                </button>
                <button 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'transfer' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-white'}`}
                >
                  Pago Móvil / Transferencia
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-start mb-8">
                      <CreditCard className="w-8 h-8 text-cyan-400" />
                      <span className="font-mono text-slate-500">DEBIT</span>
                    </div>
                    <div className="mb-4">
                      <p className="font-mono text-xl text-white tracking-widest">**** **** **** 4242</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Titular</p>
                        <p className="text-sm text-white font-bold">{shippingData.fullName || 'TU NOMBRE'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Expira</p>
                        <p className="text-sm text-white font-bold">12/28</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Número de Tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Expiración (MM/YY)</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Banknote className="w-6 h-6 text-green-400" />
                    <h4 className="font-bold text-white">Datos para Transferencia</h4>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span>Banco:</span>
                      <span className="font-bold text-white">Banco Nacional</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span>Teléfono:</span>
                      <span className="font-bold text-white">0412-555-9988</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span>RIF / ID:</span>
                      <span className="font-bold text-white">J-12345678-9</span>
                    </div>
                    <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-slate-400">
                      * Realiza el pago y confirma la orden. Te contactaremos para validar el comprobante.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 'review' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Resumen de Datos del Cliente (Incluyendo Cédula) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                 <h4 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Datos del Cliente
                 </h4>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Nombre:</span>
                        <span className="text-white font-medium">{shippingData.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Cédula:</span>
                        <span className="text-white font-medium">{shippingData.cedula}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Dirección:</span>
                        <span className="text-white font-medium text-right max-w-[200px] truncate">{shippingData.address}, {shippingData.city}</span>
                    </div>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h3>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-md p-1">
                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        <div className="text-xs text-slate-500">Cant: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 font-mono">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-b border-slate-800">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Envío ({shippingData.method === 'express' ? 'Express' : 'Estándar'})</span>
                  <span className={shippingData.method === 'express' ? 'text-white' : 'text-green-400'}>
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {paymentMethod === 'card' && (
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Método de Pago</span>
                    <span className="text-white flex items-center gap-1"><CreditCard className="w-3 h-3" /> Tarjeta</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <span className="text-lg font-bold text-white">Total a Pagar</span>
                <span className="text-2xl font-bold text-cyan-400 font-mono">${total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 sticky bottom-0 z-20 md:rounded-b-3xl">
          <div className="flex gap-4">
            {currentStep !== 'shipping' && (
              <button 
                onClick={handlePrevStep}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {currentStep === 'review' ? (
              <button 
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>Confirmar Pedido <CheckCircle className="w-5 h-5" /></>
                )}
              </button>
            ) : (
              <button 
                onClick={handleNextStep}
                disabled={currentStep === 'shipping' && !isShippingValid}
                className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Siguiente <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;