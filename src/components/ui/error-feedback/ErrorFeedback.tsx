import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ModalOptions = {
  title: string;
  message: string;
  singleLineMessage?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ErrorFeedbackContextValue = {
  showToast: (message: string, variant?: "error" | "success") => void;
  showModal: (options: ModalOptions) => void;
};

type ToastState = {
  message: string;
  variant: "error" | "success";
};

const ErrorFeedbackContext = createContext<ErrorFeedbackContextValue | null>(null);

export function ErrorFeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  const closeModal = useCallback(() => {
    setModal(null);
    previousFocusRef.current?.focus();
  }, []);

  const showToast = useCallback(
    (message: string, variant: "error" | "success" = "error") => setToast({ message, variant }),
    [],
  );
  const showModal = useCallback((options: ModalOptions) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setModal(options);
  }, []);

  const runModalAction = () => {
    modal?.action?.onClick();
    closeModal();
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4_000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!modal) return;
    dialogRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeModal, modal]);

  return (
    <ErrorFeedbackContext.Provider value={{ showToast, showModal }}>
      {children}

      {toast && (
        <div
          className={`error-feedback__toast error-feedback__toast--${toast.variant}`}
          role="alert"
        >
          <span className="error-feedback__symbol" aria-hidden="true">
            {toast.variant === "success" ? "✓" : "!"}
          </span>
          <p>{toast.message}</p>
          <button type="button" aria-label="Fechar aviso" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}

      {modal && (
        <div className="error-feedback__backdrop">
          <div
            className="error-feedback__dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={messageId}
            tabIndex={-1}
          >
            <span className="error-feedback__modal-symbol" aria-hidden="true">
              !
            </span>
            <h2 id={titleId}>{modal.title}</h2>
            <p
              className={
                modal.singleLineMessage ? "error-feedback__message--single-line" : undefined
              }
              id={messageId}
            >
              {modal.message}
            </p>
            <div className="error-feedback__actions">
              {modal.action && (
                <button className="error-feedback__confirm" type="button" onClick={runModalAction}>
                  {modal.action.label}
                </button>
              )}
              <button
                className={modal.action ? "error-feedback__dismiss" : "error-feedback__confirm"}
                type="button"
                onClick={closeModal}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorFeedbackContext.Provider>
  );
}

// O hook e o provider compartilham intencionalmente o mesmo módulo público.
// eslint-disable-next-line react-refresh/only-export-components
export function useErrorFeedback() {
  const context = useContext(ErrorFeedbackContext);
  if (!context) throw new Error("useErrorFeedback deve ser usado dentro de ErrorFeedbackProvider.");
  return context;
}
