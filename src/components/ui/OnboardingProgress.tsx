type OnboardingProgressProps = {
  currentStep: 1 | 2 | 3;
  label: string;
};

const percentages = {
  1: 33,
  2: 67,
  3: 100,
} as const;

export function OnboardingProgress({ currentStep, label }: OnboardingProgressProps) {
  const percentage = percentages[currentStep];

  return (
    <div
      className="onboarding-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={currentStep}
    >
      <div className="onboarding-progress__meta">
        <strong>
          Etapa {currentStep} de 3: {label}
        </strong>
        <span>{percentage}%</span>
      </div>
      <div className="onboarding-progress__track" aria-hidden="true">
        <span className="onboarding-progress__fill" style={{ width: `${percentage}%` }} />
        <i className="onboarding-progress__marker" style={{ left: `calc(${percentage}% - 6px)` }} />
      </div>
    </div>
  );
}
