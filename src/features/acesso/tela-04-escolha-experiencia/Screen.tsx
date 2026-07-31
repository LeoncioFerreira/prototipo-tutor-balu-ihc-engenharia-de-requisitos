import { useState } from "react";
import { Check } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, PrimaryButton } from "../../../components/ui/ScreenPrimitives";

export function ExperienceScreen({
  onComplete,
  onBack,
  selectedChoice,
}: {
  onComplete?: (choice: "traditional" | "gamified") => void;
  onBack?: () => void;
  selectedChoice?: "traditional" | "gamified";
}) {
  const [choice, setChoice] = useState<"traditional" | "gamified" | null>(selectedChoice ?? null);
  const options = [
    {
      id: "gamified" as const,
      title: "Experiência gamificada",
      text: "Ganhe XP, suba de nível e transforme a rotina em conquistas.",
    },
    {
      id: "traditional" as const,
      title: "Experiência tradicional",
      text: "Acompanhe a rotina do seu pet de forma simples e direta.",
    },
  ];
  return (
    <MobileShell>
      <PageHeader
        title="Como você quer acompanhar?"
        subtitle="Você pode mudar essa escolha quando quiser."
        onBack={onBack}
      />
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={choice === option.id}
            onClick={() => !selectedChoice && setChoice(option.id)}
            className={`relative w-full rounded-3xl border-2 p-5 text-left ${choice === option.id ? "border-[#35ba8d] bg-[#e6fffa]" : "border-[#dce6ef] bg-white"}`}
          >
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl">
              {option.id === "gamified" ? "🏆" : "✓"}
            </span>
            <b className="block text-[16px]">{option.title}</b>
            <small className="mt-2 block leading-5 text-[#6b8297]">{option.text}</small>
            {choice === option.id && (
              <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[#35ba8d] text-white">
                <Check size={16} />
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-7">
        <PrimaryButton onClick={() => choice && onComplete?.(choice)}>Continuar</PrimaryButton>
      </div>
    </MobileShell>
  );
}
