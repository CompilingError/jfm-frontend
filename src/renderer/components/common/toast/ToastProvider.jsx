import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import './ToastProvider.css';

const ToastContext = createContext(null);

const DEFAULT_DURATION = 2800;

function createToastId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title = '', message, duration = DEFAULT_DURATION }) => {
      const toastId = createToastId();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id: toastId,
          type,
          title,
          message,
        },
      ]);

      if (duration > 0) {
        window.setTimeout(() => {
          removeToast(toastId);
        }, duration);
      }

      return toastId;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      addToast,
      removeToast,

      success(message, title = '') {
        return addToast({
          type: 'success',
          title,
          message,
        });
      },

      error(message, title = '') {
        return addToast({
          type: 'error',
          title,
          message,
          duration: 4200,
        });
      },

      info(message, title = '') {
        return addToast({
          type: 'info',
          title,
          message,
        });
      },

      warning(message, title = '') {
        return addToast({
          type: 'warning',
          title,
          message,
          duration: 3600,
        });
      },
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className={`toast-message toast-${toast.type}`}
          >
            <div className="toast-icon" />

            <div className="toast-content">
              {toast.title && <strong>{toast.title}</strong>}
              <span>{toast.message}</span>
            </div>

            <button
              className="toast-close-button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ×
            </button>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

export default ToastProvider;