import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, CreditCard, Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isRegistering ? 'register' : 'login',
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        <p className="text-slate-400 text-center mb-6 text-sm">
          {isRegistering ? 'Únete a Z-One y guarda tus preferencias.' : 'Accede a tu perfil y pedidos.'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input required name="nombre" onChange={handleChange} placeholder="Nombre Completo" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input required name="cedula" onChange={handleChange} placeholder="Cédula / ID" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input required type="email" name="email" onChange={handleChange} placeholder="Correo Electrónico" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input required type="password" name="password" onChange={handleChange} placeholder="Contraseña" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
          </div>

          {isRegistering && (
            <>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input name="telefono" onChange={handleChange} placeholder="Teléfono" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input name="direccion" onChange={handleChange} placeholder="Dirección" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none" />
              </div>
            </>
          )}

          <button disabled={isLoading} type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex justify-center items-center gap-2">
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800 pt-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;