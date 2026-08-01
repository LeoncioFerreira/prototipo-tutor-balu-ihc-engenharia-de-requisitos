import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
import type { ExperienceMode } from "../tela-06c-configuracoes-conta/Screen";

export function ExperienceSettingsScreen({
  currentExperience,
  onBack,
  onSave,
}: {
  currentExperience: ExperienceMode;
  onBack: () => void;
  onSave: (experience: ExperienceMode) => void;
}) {
  const [selection, setSelection] = useState(currentExperience);

  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <div className="experience-settings-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <div>
            <h1>Escolher experiência</h1>
            <p>Defina como você quer acompanhar a rotina e a saúde do seu pet.</p>
          </div>
        </header>

        <div className="experience-settings-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>

        <section className="experience-settings-screen__options">
          <h2>Como você quer usar o Balu?</h2>
          <div>
            <button
              type="button"
              className={selection === "traditional" ? "is-selected" : ""}
              aria-pressed={selection === "traditional"}
              onClick={() => setSelection("traditional")}
            >
              <strong>Tradicional</strong>
              <p>Acompanhamento direto com listas, alertas e histórico organizado.</p>
            </button>
            <button
              type="button"
              className={selection === "gamified" ? "is-selected" : ""}
              aria-pressed={selection === "gamified"}
              onClick={() => setSelection("gamified")}
            >
              <span>
                <strong>Gamificada</strong>
                <b>XP</b>
              </span>
              <p>Ganhe pontos, acompanhe níveis e transforme a rotina em progresso.</p>
            </button>
          </div>
        </section>

        <p className="experience-settings-screen__helper">
          Sua rotina e seus dados serão mantidos ao trocar de experiência.
        </p>
        <button
          className="experience-settings-screen__save"
          type="button"
          onClick={() => onSave(selection)}
        >
          Salvar alteração
        </button>
      </div>
    </MobileShell>
  );
}
