import { ExperienceScreen } from "../tela-04-escolha-experiencia/Screen";

export function TraditionalExperienceScreen({ onComplete }: { onComplete: () => void }) {
  return <ExperienceScreen initialChoice="traditional" figmaNode="393:2" onComplete={onComplete} />;
}
