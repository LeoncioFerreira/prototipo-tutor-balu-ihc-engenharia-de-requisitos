import { ExperienceScreen } from "../tela-04-escolha-experiencia/Screen";
export function TraditionalExperienceScreen({ onComplete }: { onComplete?: () => void }) {
  return <ExperienceScreen selectedChoice="traditional" onComplete={() => onComplete?.()} />;
}
