import { useCallback } from 'react';
import toastLib, { Toaster } from 'react-hot-toast';

type ToastSeverity = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ToastOptions {
  message: string;
  severity?: ToastSeverity;
}

/**
 * useToast hook — wraps react-hot-toast for a unified API
 */
export const useToast = () => {
  const toast = useCallback(({ message, severity = 'default' }: ToastOptions) => {
    switch (severity) {
      case 'success':
        toastLib.success(message);
        break;
      case 'error':
        toastLib.error(message);
        break;
      case 'info':
      case 'default':
        toastLib(message);
        break;
      case 'warning':
        toastLib(message, {
          icon: '⚠️',
        });
        break;
      default:
        toastLib(message);
    }
  }, []);

  return toast;
};

/**
 * Export Toaster so you can include it in your app root
 */
export const ToastContainer = Toaster;
