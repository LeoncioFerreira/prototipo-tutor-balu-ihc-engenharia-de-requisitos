import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, Row } from "../../../components/ui/ScreenPrimitives";
export function TutorProfileScreen() {
  return (
    <MobileShell>
      <PageHeader
        title="Perfil do tutor"
        subtitle="Leôncio Ferreira"
        onBack={() => history.back()}
      />
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#b2f5ea] text-xl font-bold">
        L
      </div>
      <div className="mt-6 space-y-3">
        <Row title="Dados pessoais" description="E-mail e telefone" />
        <Row title="Preferências" description="Experiência gamificada" />
        <Row title="Notificações" description="Lembretes e alertas" />
      </div>
    </MobileShell>
  );
}
