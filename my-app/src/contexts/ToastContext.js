import React, { createContext, useContext, useState } from "react";
import "./ToastContext.css";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", timeout = 3000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  };

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return <ToastContext.Provider value={{ toasts, showToast, remove }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
