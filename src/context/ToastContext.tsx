import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast, type ToastMessage } from "../components/ui/Toast";

interface ToastContextValue {
  notify: (message: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/** Global toast notification provider. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = useCallback((message: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    setMessages((current) => [...current, { ...message, id }]);
    setTimeout(() => {
      setMessages((current) => current.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-[280px] flex-col gap-3">
        {messages.map((message) => (
          <Toast key={message.id} message={message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook to use toast notifications. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
