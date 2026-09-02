import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="toast-container" style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxWidth: "380px",
      width: "100%",
      pointerEvents: "none",
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#f84464" />,
    info: <Info size={18} color="#38bdf8" />,
  };

  return (
    <div
      className="toast-item animate-slide-up"
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "12px",
        background: "rgba(20, 24, 38, 0.95)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${
          toast.type === "success"
            ? "rgba(16, 185, 129, 0.3)"
            : toast.type === "error"
            ? "rgba(248, 68, 100, 0.3)"
            : "rgba(56, 189, 248, 0.3)"
        }`,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        color: "#ffffff",
        fontSize: "0.9rem",
      }}
    >
      {icons[toast.type]}
      <span style={{ flex: 1, fontWeight: 500 }}>{toast.text}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          color: "rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
