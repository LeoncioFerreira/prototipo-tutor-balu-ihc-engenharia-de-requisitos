import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
const controlFont = { fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' };
export function AddTutorScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("BALU-4821");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="invite-tutor-screen">
        <header className="invite-tutor-screen__header">
          <button
            className="invite-tutor-screen__back"
            type="button"
            aria-label="Voltar"
            onClick={onBack}
            style={{
              ...controlFont,
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Convidar tutor</h1>
        </header>
        <h2 className="invite-tutor-screen__subtitle">Convide outro cuidador com um código</h2>
        <div className="invite-code">
          <p>Compartilhe este código com outro cuidador para entrar na família do pet.</p>
          <b>BALU-4821</b>
          <button type="button" style={controlFont} onClick={handleCopy}>
            <Copy size={16} />
            {copied ? "Código copiado!" : "Copiar código"}
          </button>
          {copied && (
            <div style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>
              ✓ Código copiado para a área de transferência!
            </div>
          )}
        </div>
        <a
          className="whatsapp"
          href="https://wa.me/?text=Convite%20Balu%20para%20acompanhar%20o%20pet"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/assets/figma/pets/whatsapp.svg" alt="" />
          Enviar no WhatsApp
        </a>
        <section className="permissions">
          <h2>Permissões do convite</h2>
          <ul>
            <li>Ver rotina e histórico do pet</li>
            <li>Confirmar tarefas do dia</li>
            <li>Ver carteira, vacinas e medicamentos</li>
            <li className="warning">Não poderá remover o tutor principal</li>
          </ul>
        </section>
        <section className="safe-code">
          <h2>Código seguro para convite</h2>
          <p>Compartilhe o código apenas com quem fará parte do cuidado compartilhado.</p>
        </section>
        <p className="invite-tutor-screen__note">
          O tutor convidado poderá acompanhar o pet e confirmar tarefas.
        </p>
      </div>
    </MobileShell>
  );
}
