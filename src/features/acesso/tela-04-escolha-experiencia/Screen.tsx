import { useState } from "react";
import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";

type Choice = "traditional" | "gamified";

export function ExperienceScreen({
  onComplete,
  initialChoice,
  figmaNode = "177:57",
}: {
  onComplete?: (choice: Choice) => void;
  onBack?: () => void;
  initialChoice?: Choice;
  figmaNode?: string;
}) {
  const [choice, setChoice] = useState<Choice | undefined>(initialChoice);

  return (
    <main className="experience-screen">
      <section
        className="experience-screen__canvas"
        data-experience={choice}
        data-figma-node={figmaNode}
      >
        <OnboardingProgress currentStep={3} label="Escolher experiência" />
        <header>
          <h1>Escolha sua experiência</h1>
          <p>Defina como você quer acompanhar a rotina e a saúde do seu pet</p>
        </header>

        <div className="experience-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>

        <section className="experience-screen__options">
          <h2>Como você quer usar o Balu?</h2>
          <div>
            <button
              type="button"
              className={choice === "traditional" ? "is-selected" : ""}
              aria-pressed={choice === "traditional"}
              onClick={() => setChoice("traditional")}
            >
              <strong>Tradicional</strong>
              <p>Acompanhamento direto com listas, alertas e histórico organizado.</p>
            </button>
            <button
              type="button"
              className={choice === "gamified" ? "is-selected" : ""}
              aria-pressed={choice === "gamified"}
              onClick={() => setChoice("gamified")}
            >
              <span>
                <strong>Gamificada</strong>
                <b>XP</b>
              </span>
              <p>Ganhe pontos, acompanhe níveis e transforme a rotina em progresso.</p>
            </button>
          </div>
        </section>

        <p className="experience-screen__helper">
          Você poderá revisar essa escolha depois nas configurações.
        </p>
        <button
          className="experience-screen__submit"
          type="button"
          onClick={() => choice && onComplete?.(choice)}
        >
          Começar jornada
        </button>
      </section>
    </main>
  );
}
