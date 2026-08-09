import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Clock3, Copy, KeyRound, UserPlus, X } from "lucide-react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

export type SharedCareChoice = "invite" | "later" | "code";

export function SharedCareActions({
  value,
  onChange,
  inviteButtonRef,
}: {
  value: SharedCareChoice | null;
  onChange: (choice: SharedCareChoice) => void;
  inviteButtonRef: RefObject<HTMLButtonElement>;
}) {
  const { showToast } = useErrorFeedback();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const codeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  const closeInvite = useCallback(() => {
    setIsInviteOpen(false);
    inviteButtonRef.current?.focus();
  }, [inviteButtonRef]);

  useEffect(() => {
    if (!isInviteOpen) return;
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeInvite();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeInvite, isInviteOpen]);

  const trapDialogFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"),
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const cancelCode = () => {
    setIsCodeOpen(false);
    setCode("");
    setCodeError(null);
    window.requestAnimationFrame(() => codeButtonRef.current?.focus());
  };

  const validateCode = () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setCodeError("Informe o código da família.");
      showToast("Corrija o código da família para continuar.");
      codeInputRef.current?.focus();
      return;
    }
    if (normalized !== "BALU-4821") {
      setCodeError("Código da família inválido.");
      showToast("Corrija o código da família para continuar.");
      codeInputRef.current?.focus();
      return;
    }

    setCodeError(null);
    setIsCodeOpen(false);
    onChange("code");
  };

  return (
    <>
      <div className="register-pet-screen__shared-intro">
        <img src="/assets/figma/access/shared-care.svg" alt="" />
        <div>
          <strong>Vincular outros tutores</strong>
          <p>Escolha como deseja configurar o cuidado compartilhado deste pet.</p>
        </div>
      </div>

      <div
        className="register-pet-screen__shared-actions"
        role="group"
        aria-label="Ações de cuidado compartilhado"
      >
        <ActionButton
          buttonRef={inviteButtonRef}
          icon={<UserPlus aria-hidden="true" size={20} />}
          title="Convidar tutor"
          description="Gere um código para compartilhar com outro cuidador."
          selected={value === "invite"}
          onClick={() => setIsInviteOpen(true)}
        />
        <ActionButton
          icon={<Clock3 aria-hidden="true" size={20} />}
          title="Adicionar depois"
          description="Continue agora e convide alguém quando quiser."
          selected={value === "later"}
          onClick={() => {
            setIsCodeOpen(false);
            setCodeError(null);
            onChange("later");
          }}
        />
        <ActionButton
          buttonRef={codeButtonRef}
          icon={<KeyRound aria-hidden="true" size={20} />}
          title="Entrar com código"
          description="Vincule o pet a uma família já existente."
          selected={value === "code"}
          onClick={() => {
            setIsCodeOpen(true);
            window.requestAnimationFrame(() => codeInputRef.current?.focus());
          }}
        />
      </div>

      {value === "later" && (
        <p role="status" className="register-pet-screen__saved-note">
          Os dados do pet serão salvos. Você poderá convidar outro tutor depois.
        </p>
      )}

      {isCodeOpen && (
        <div className="register-pet-screen__code-panel">
          <label htmlFor="family-code">Código da família</label>
          <input
            ref={codeInputRef}
            id="family-code"
            value={code}
            placeholder="BALU-4821"
            aria-invalid={Boolean(codeError)}
            aria-describedby={codeError ? "family-code-error" : undefined}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setCodeError(null);
            }}
          />
          {codeError && (
            <small id="family-code-error" className="field-error">
              {codeError}
            </small>
          )}
          <div>
            <button type="button" onClick={validateCode}>
              Vincular família
            </button>
            <button type="button" onClick={cancelCode}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isInviteOpen && (
        <div
          className="register-pet-screen__invite-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeInvite();
          }}
        >
          <div
            className="register-pet-screen__invite-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            onKeyDown={trapDialogFocus}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="register-pet-screen__invite-close"
              aria-label="Fechar convite"
              onClick={closeInvite}
            >
              <X aria-hidden="true" size={20} />
            </button>
            <span className="register-pet-screen__invite-icon" aria-hidden="true">
              <UserPlus size={24} strokeWidth={2.2} />
            </span>
            <h2 id={dialogTitleId}>Convidar tutor</h2>
            <p id={dialogDescriptionId}>Compartilhe este código com outro cuidador.</p>
            <div className="register-pet-screen__invite-code-card">
              <span>
                <small>Código do convite</small>
                <strong className="register-pet-screen__invite-code">BALU-4821</strong>
              </span>
              <button
                ref={copyButtonRef}
                type="button"
                aria-label="Copiar código"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText("BALU-4821");
                    onChange("invite");
                    closeInvite();
                  } catch {
                    showToast("Não foi possível copiar o código.");
                  }
                }}
              >
                <Copy aria-hidden="true" size={17} />
              </button>
            </div>
            <a
              className="register-pet-screen__whatsapp"
              href="https://wa.me/?text=Convite%20Balu%20BALU-4821%20para%20acompanhar%20o%20pet"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                onChange("invite");
                closeInvite();
              }}
            >
              <img src="/assets/figma/pets/whatsapp.svg" alt="" />
              Enviar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function ActionButton({
  buttonRef,
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  buttonRef?: RefObject<HTMLButtonElement>;
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`register-pet-screen__action ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="register-pet-screen__action-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <b aria-hidden="true">{selected ? "✓" : "›"}</b>
    </button>
  );
}
