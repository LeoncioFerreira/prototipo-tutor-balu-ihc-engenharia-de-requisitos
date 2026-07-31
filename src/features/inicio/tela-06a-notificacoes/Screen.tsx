import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader, Row } from "../../../components/ui/ScreenPrimitives";
export function NotificationsScreen() {
  return (
    <MobileShell>
      <PageHeader title="Notificações" subtitle="Lembretes do Balu" onBack={() => history.back()} />
      <div className="space-y-3">
        <Row title="Vermífugo Chemital" description="Hoje às 14:00" />
        <Row title="Vacina anual" description="Em 12 de agosto" />
        <Row title="Passeio diário" description="Hoje às 18:00" />
      </div>
    </MobileShell>
  );
}
