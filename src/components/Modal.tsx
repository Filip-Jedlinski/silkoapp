import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 animate-slideUp max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-4">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="sticky bottom-0 border-t border-neutral-100 px-6 py-4 bg-white">
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Potwierdzam",
  cancelText = "Anuluj",
  onConfirm,
  isDestructive = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-neutral-700 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`flex-1 ${isDestructive ? "bg-red-500 text-white hover:bg-red-600 rounded-lg px-4 py-2.5 font-medium" : "btn-primary"}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-primary-500",
  }[type];

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 max-w-lg mx-auto ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slideUp z-50`}
    >
      {message}
    </div>
  );
};
