
  import React, { useState } from 'react';
import { X, CheckCircle, Store, Smartphone, CreditCard, Loader2 } from 'lucide-react';
import { saveOrder } from '../lib/db';
import { CartItem } from '../types'; // Asegúrate de tener tus tipos importados

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onOrderComplete?: (data: any) => void; // Lo mantenemos opcional para no romper App.tsx
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, onClearCart }) => {
  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | string | null>(null);
  
  // Estado del formulario (Solo datos de contacto)
  const [formData, setFormData] = useState({
    fullName: '',
    cedula: '',
    phone: '',
    email: '',
    paymentMethod: 'store' // 'store' | 'pago_movil'
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.cedula || !formData.phone) return;

    setLoading(true);
    try {
      // 1. Guardamos la orden y restamos inventario
      const newOrderId = await saveOrder({
        ...formData,
        total: total
      }, cartItems);
      
      // 2. Si todo sale bien, mostramos confirmación
      setOrderId(newOrderId);
      setStep('confirmation');
      onClearCart(); // Limpiamos el carrito visualmente
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'details' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Store className="text-cyan-400 w-6 h-6" /> 
                Retiro en Tienda
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Completa tus datos para reservar tu pedido. Total a pagar: <span className="text-cyan-400 font-bold">${total}</span>
              </p>
            </div>

            {/* Formulario de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Nombre Completo</label>
                <input 
                  type="text"
                  placeholder="Ej: Juan Pérez" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Cédula de Identidad</label>
                <input 
                  type="text"
                  placeholder="Ej: 28123456" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  value={formData.cedula}
                  onChange={e => setFormData({...formData, cedula: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Teléfono Celular</label>
                <input 
                  type="tel"
                  placeholder="Ej: 0414-1234567" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Correo (Opcional)</label>
                <input 
                  type="email"
                  placeholder="Ej: juan@email.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Selección de Método de Pago */}
            <div className="space-y-3 pt-2">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Método de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setFormData({...formData, paymentMethod: 'pago_movil'})}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'pago_movil' 
                    ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <div className="text-left">
                    <span className="block font-bold text-sm">Pago Móvil</span>
                    <span className="block text-xs opacity-70">Pagar ahora</span>
                  </div>
                </button>

                <button 
                  onClick={() => setFormData({...formData, paymentMethod: 'store'})}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'store' 
                    ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <div className="text-left">
                    <span className="block font-bold text-sm">Pagar en Tienda</span>
                    <span className="block text-xs opacity-70">Efectivo / Punto</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Botón de Confirmación */}
            <button 
              onClick={handleSubmit}
              disabled={loading || !formData.fullName || !formData.cedula || !formData.phone}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <> <Loader2 className="w-5 h-5 animate-spin" /> Procesando... </>
              ) : (
                'Confirmar Pedido'
              )}
            </button>
          </div>
        )}

        {/* Pantalla de Confirmación (Éxito) */}
        {step === 'confirmation' && (
          <div className="text-center py-8 animate-fade-in-up">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/20">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">¡Pedido Reservado!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Tu pedido ha sido registrado exitosamente en nuestro sistema.
            </p>
            
            <div className="bg-slate-950 p-6 rounded-2xl max-w-xs mx-auto border border-dashed border-slate-700 mb-8 relative group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <p className="text-slate-500 text-xs uppercase font-bold mb-2 tracking-widest">Tu Número de Orden</p>
              <p className="text-5xl font-mono font-bold text-cyan-400 tracking-tighter">#{orderId}</p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-sm text-blue-200 mb-8 max-w-md mx-auto">
              📸 <strong>Tip:</strong> Toma una captura de pantalla de este número. Deberás presentarlo en caja para retirar tus productos.
            </div>

            <button 
              onClick={onClose} 
              className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
            >
              Volver al Catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;