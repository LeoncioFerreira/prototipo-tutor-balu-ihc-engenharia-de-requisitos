import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

export function PostImagePicker({
  previewUrl,
  onSelect,
  onRemove,
}: {
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const { showToast } = useErrorFeedback();
  const [menuOpen, setMenuOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const galleryButtonRef = useRef<HTMLButtonElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    galleryButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const chooseSource = (source: "gallery" | "camera") => {
    setMenuOpen(false);
    (source === "gallery" ? galleryInputRef.current : cameraInputRef.current)?.click();
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Selecione um arquivo de imagem válido.");
      return;
    }
    onSelect(file);
  };

  return (
    <section className="caramel-club-screen__post-image" aria-labelledby="post-image-title">
      <h3 id="post-image-title">Imagem da publicação</h3>
      {previewUrl ? (
        <div className="caramel-club-screen__post-image-preview">
          <img src={previewUrl} alt="Prévia da imagem da publicação" />
          <button type="button" onClick={onRemove}>
            <Trash2 aria-hidden="true" />
            Remover imagem
          </button>
        </div>
      ) : (
        <button
          ref={addButtonRef}
          className="caramel-club-screen__post-image-add"
          type="button"
          onClick={() => setMenuOpen(true)}
        >
          <ImagePlus aria-hidden="true" />
          Adicionar imagem à publicação
        </button>
      )}
      <input
        ref={galleryInputRef}
        className="caramel-club-screen__post-image-input"
        data-testid="post-image-gallery-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <input
        ref={cameraInputRef}
        className="caramel-club-screen__post-image-input"
        data-testid="post-image-camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
      />
      {menuOpen && (
        <div className="caramel-club-screen__image-menu-backdrop">
          <section
            className="caramel-club-screen__image-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <h2 id={titleId}>Adicionar imagem à publicação</h2>
            <button ref={galleryButtonRef} type="button" onClick={() => chooseSource("gallery")}>
              <ImagePlus aria-hidden="true" />
              Escolher da galeria
            </button>
            <button type="button" onClick={() => chooseSource("camera")}>
              <Camera aria-hidden="true" />
              Tirar foto
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.requestAnimationFrame(() => addButtonRef.current?.focus());
              }}
            >
              Cancelar
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
