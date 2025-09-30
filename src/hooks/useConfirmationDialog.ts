import { useState, useCallback } from 'react';

export interface ConfirmationDialogOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationDialogOptions>({
    type: 'info',
    title: '',
    message: '',
    autoClose: true,
    duration: 3000
  });

  const showDialog = useCallback((dialogOptions: ConfirmationDialogOptions) => {
    setOptions(dialogOptions);
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, autoClose = true, duration = 3000) => {
    showDialog({ type: 'success', title, message, autoClose, duration });
  }, [showDialog]);

  const showError = useCallback((title: string, message?: string, autoClose = true, duration = 3000) => {
    showDialog({ type: 'error', title, message, autoClose, duration });
  }, [showDialog]);

  const showInfo = useCallback((title: string, message?: string, autoClose = true, duration = 3000) => {
    showDialog({ type: 'info', title, message, autoClose, duration });
  }, [showDialog]);

  const showWarning = useCallback((title: string, message?: string, autoClose = true, duration = 3000) => {
    showDialog({ type: 'warning', title, message, autoClose, duration });
  }, [showDialog]);

  return {
    isOpen,
    options,
    showDialog,
    hideDialog,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
