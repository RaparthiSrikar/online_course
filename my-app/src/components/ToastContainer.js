import React from "react";
import { useToast } from "../contexts/ToastContext";
import "./ToastContainer.css";

function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <div>
            <strong>{t.type}</strong>
            <div className="toast-message">{t.message}</div>
          </div>
          <button onClick={() => remove(t.id)} className="toast-dismiss">
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
