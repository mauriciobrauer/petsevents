import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function ConfirmationDialog({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}: ConfirmationDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-orange-500" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`
        relative w-full max-w-md mx-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        <div className={`
          ${getBackgroundColor()}
          border rounded-2xl shadow-2xl p-6 backdrop-blur-sm
          text-center bg-white/95
        `}>
          {/* Close button */}
          <button
            onClick={onClose}
            className={`
              absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors
              ${getTextColor()} opacity-60 hover:opacity-100
            `}
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          {/* Title */}
          <h3 className={`text-xl font-bold ${getTextColor()} mb-3`}>
            {title}
          </h3>
          
          {/* Message */}
          {message && (
            <p className={`text-sm ${getTextColor()} opacity-80 mb-6 leading-relaxed`}>
              {message}
            </p>
          )}
          
          {/* Button */}
          <Button
            onClick={onClose}
            className={`w-full ${getButtonColor()} rounded-lg`}
          >
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
