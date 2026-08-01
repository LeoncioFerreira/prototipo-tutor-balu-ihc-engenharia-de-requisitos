import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

export function BackButton({ onClick, label = "Voltar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-[30px] w-5 place-items-center bg-transparent text-[#183a78]"
    >
      <ArrowLeft size={20} />
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  return (
    <header className="mb-6 flex items-start gap-3">
      {onBack && <BackButton onClick={onBack} />}
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-.04em]">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-[#4a5568]">{subtitle}</p>}
      </div>
    </header>
  );
}

export function Row({
  title,
  description,
  onClick,
  trailing,
}: {
  title: string;
  description?: string;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1">
        <b className="block text-[14px]">{title}</b>
        {description && (
          <small className="mt-0.5 block text-[12px] text-[#4a5568]">{description}</small>
        )}
      </span>
      {trailing ?? <ChevronRight size={19} className="text-[#4a5568]" />}
    </>
  );
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 text-left"
    >
      {content}
    </button>
  ) : (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4">
      {content}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-13 min-h-[52px] w-full rounded-[26px] bg-[#183a78] px-5 text-[15px] font-extrabold text-white shadow-[0_4px_12px_rgba(24,58,120,.16)]"
    >
      {children}
    </button>
  );
}
