import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Camera, ImagePlus, Plus } from "lucide-react";
import { useErrorFeedback } from "../error-feedback/ErrorFeedback";

export function PetPhotoPicker({ className = "" }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const menuTitleId = useId();
  const { showToast } = useErrorFeedback();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => addButtonRef.current?.focus());
  }, []);

  const chooseSource = (source: "gallery" | "camera") => {
    setIsMenuOpen(false);
    const input = source === "gallery" ? galleryInputRef.current : cameraInputRef.current;
    input?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Selecione um arquivo de imagem válido.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    firstActionRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu, isMenuOpen]);

  const keepFocusInMenu = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const actions = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const firstAction = actions[0];
    const lastAction = actions[actions.length - 1];

    if (event.shiftKey && document.activeElement === firstAction) {
      event.preventDefault();
      lastAction?.focus();
    } else if (!event.shiftKey && document.activeElement === lastAction) {
      event.preventDefault();
      firstAction?.focus();
    }
  };

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  return (
    <div className={className}>
      <div className="pet-photo-picker">
        <img
          src={previewUrl ?? "/assets/figma/home/11.svg"}
          alt={previewUrl ? "Foto selecionada do pet" : ""}
          className={previewUrl ? "pet-photo-picker__preview" : "pet-photo-picker__placeholder"}
        />
        <button
          ref={addButtonRef}
          type="button"
          className="pet-photo-picker__button"
          aria-label="Adicionar foto do pet"
          onClick={() => setIsMenuOpen(true)}
        >
          <Plus aria-hidden="true" size={18} strokeWidth={3} />
        </button>
        <input
          ref={galleryInputRef}
          data-testid="pet-photo-gallery-input"
          className="pet-photo-picker__input"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        <input
          ref={cameraInputRef}
          data-testid="pet-photo-camera-input"
          className="pet-photo-picker__input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
        />
      </div>

      {isMenuOpen && (
        <div
          className="pet-photo-picker__backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div
            className="pet-photo-picker__menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuTitleId}
            onKeyDown={keepFocusInMenu}
          >
            <h2 id={menuTitleId}>Adicionar foto do pet</h2>
            <button ref={firstActionRef} type="button" onClick={() => chooseSource("gallery")}>
              <ImagePlus aria-hidden="true" size={21} />
              Escolher da galeria
            </button>
            <button type="button" onClick={() => chooseSource("camera")}>
              <Camera aria-hidden="true" size={21} />
              Tirar foto
            </button>
            <button type="button" className="pet-photo-picker__cancel" onClick={closeMenu}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
