import { CheckCircle2, Circle, PawPrint } from "lucide-react";
import { MobileShell } from "./MobileShell";
import { PageHeader, PrimaryButton, Row } from "./ScreenPrimitives";

export type InformationScreenProps = { title: string; subtitle?: string; items: Array<{ title: string; description?: string }>; button?: string; onBack?: () => void; onAction?: () => void };

export function InformationScreen({ title, subtitle, items, button, onBack, onAction }: InformationScreenProps) {
  return <MobileShell><PageHeader title={title} subtitle={subtitle} onBack={onBack} /><div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#e6fffa] text-[#002045]"><PawPrint size={35} /></div><div className="space-y-3">{items.map((item, index) => <Row key={item.title} title={item.title} description={item.description} trailing={index === 0 ? <CheckCircle2 className="text-[#35ba8d]" size={20} /> : <Circle className="text-[#b5c3cf]" size={20} />} />)}</div>{button && <div className="mt-7"><PrimaryButton onClick={onAction}>{button}</PrimaryButton></div>}</MobileShell>;
}
