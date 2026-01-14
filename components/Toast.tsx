import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-[60] bg-slate-900 border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-lg shadow-cyan-500/10 flex items-center gap-3 animate-fade-in-up">
      <CheckCircle className="w-5 h-5 text-cyan-400" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;