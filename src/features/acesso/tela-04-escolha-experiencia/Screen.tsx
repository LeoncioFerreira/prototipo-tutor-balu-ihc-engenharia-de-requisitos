import { useRef, useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";
import { OnboardingProgress } from "../../../components/ui/OnboardingProgress";
import { BackButton } from "../../../components/ui/ScreenPrimitives";

type Choice = "traditional" | "gamified";

export function ExperienceScreen({
  onComplete,
  onBack,
  initialChoice,
  figmaNode = "177:57",
}: {
  onComplete?: (choice: Choice) => void;
  onBack?: () => void;
  initialChoice?: Choice;
  figmaNode?: string;
}) {
  const { showToast } = useErrorFeedback();
  const [choice, setChoice] = useState<Choice | undefined>(initialChoice);
  const [hasError, setHasError] = useState(false);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);

  const chooseExperience = (nextChoice: Choice) => {
    setChoice(nextChoice);
    setHasError(false);
  };

  return (
    <main className="experience-screen">
      <section
        className="experience-screen__canvas"
        data-experience={choice}
        data-figma-node={figmaNode}
      >
        <OnboardingProgress currentStep={3} label="Escolher experiência" />
        <header>
          {onBack && <BackButton onClick={onBack} />}
          <div>
            <h1>Escolha sua experiência</h1>
            <p>Defina como você quer acompanhar a rotina e a saúde do seu pet</p>
          </div>
        </header>

        <div className="experience-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>

        <section className="experience-screen__options">
          <h2>Como você quer usar o Balu?</h2>
          <div
            role="group"
            aria-label="Opções de experiência"
            aria-invalid={hasError}
            aria-describedby={hasError ? "experience-choice-error" : undefined}
          >
            <button
              ref={firstChoiceRef}
              type="button"
              className={choice === "traditional" ? "is-selected" : ""}
              aria-pressed={choice === "traditional"}
              onClick={() => chooseExperience("traditional")}
            >
              <strong>Tradicional</strong>
              <p>Acompanhamento direto com listas, alertas e histórico organizado.</p>
              {choice === "traditional" && (
                <div className="experience-screen__expanded-content">
                  <img src="/assets/figma/home/08.svg" alt="" aria-hidden="true" />
                  <ul>
                    <li>&bull; Foco em agilidade</li>
                    <li>&bull; Listas simples</li>
                    <li>&bull; Sem níveis ou pontuação</li>
                  </ul>
                </div>
              )}
            </button>
            <button
              type="button"
              className={choice === "gamified" ? "is-selected" : ""}
              aria-pressed={choice === "gamified"}
              onClick={() => chooseExperience("gamified")}
            >
              <span>
                <strong>Gamificada</strong>
                <b>XP</b>
              </span>
              <p>Ganhe pontos, acompanhe níveis e transforme a rotina em progresso.</p>
              {choice === "gamified" && (
                <div className="experience-screen__expanded-content">
                  <img src="/assets/figma/home/xp-level-badge.png" alt="" aria-hidden="true" />
                  <ul>
                    <li>&bull; Desafios diários</li>
                    <li>&bull; Ganhe experiência (XP)</li>
                    <li>&bull; Suba de nível cuidando do pet</li>
                  </ul>
                </div>
              )}
            </button>
          </div>
          {hasError && (
            <small id="experience-choice-error" className="experience-screen__error">
              Selecione uma experiência para continuar.
            </small>
          )}
        </section>

        <p className="experience-screen__helper">
          Você poderá revisar essa escolha depois nas configurações.
        </p>
        <button
          className="experience-screen__submit"
          type="button"
          onClick={() => {
            if (!choice) {
              setHasError(true);
              showToast("Preencha os campos obrigatórios para continuar.");
              firstChoiceRef.current?.focus();
              return;
            }
            onComplete?.(choice);
          }}
        >
          Começar jornada
        </button>
      </section>
    </main>
  );
}
