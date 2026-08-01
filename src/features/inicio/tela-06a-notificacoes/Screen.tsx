import { MobileShell } from "../../../components/ui/MobileShell";

const notifications = [
  [
    "blue",
    "Unipet deseja se vincular a ela",
    "Toque para aceitar ou recusar o vínculo da clínica com o perfil do seu pet.",
    "Novo",
    "/assets/figma/inicio/notification-clinic.svg",
    true,
  ],
  [
    "orange",
    "Vermífugo Chemital vence hoje",
    "Lembrete às 14:00 para confirmar a dose do Balu.",
    "Agora",
    "/assets/figma/inicio/notification-medicine.svg",
    false,
  ],
  [
    "blue",
    "Paulo aceitou o convite do Balu",
    "O cuidado compartilhado foi atualizado com um novo tutor.",
    "Novo",
    "/assets/figma/inicio/notification-care.svg",
    false,
  ],
  [
    "blue",
    "Passeio diário ainda não confirmado",
    "Meta diária de 20 min de caminhada segue pendente.",
    "Hoje",
    "/assets/figma/inicio/notification-care.svg",
    false,
  ],
  [
    "community",
    "Novos comentários no Clube dos Caramelos",
    "A conversa sobre a escovação do Balu recebeu novas respostas.",
    "Clube",
    "/assets/figma/inicio/notification-community.svg",
    false,
  ],
  [
    "green",
    "André confirmou a alimentação",
    "Rotina da manhã registrada para o Balu.",
    "Feito",
    "/assets/figma/inicio/notification-food.svg",
    true,
  ],
] as const;

export function NotificationsScreen({
  onBack,
  onOpenClinicLink,
}: {
  onBack: () => void;
  onOpenClinicLink: () => void;
}) {
  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <div className="notifications-screen" data-figma-node="293:2">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <h1>Notificações</h1>
        </header>
        <p className="notifications-screen__subtitle">Acompanhe alertas do Balu e da sua família</p>
        <section>
          {notifications.map(([tone, title, body, badge, asset, compact], index) => (
            <article key={title} className={`is-${tone}${compact ? " is-compact" : ""}`}>
              {index === 0 && (
                <button
                  className="notifications-screen__open"
                  type="button"
                  aria-label="Abrir solicitação de vínculo da Unipet"
                  onClick={onOpenClinicLink}
                />
              )}
              <img className="notifications-screen__icon" src={asset} alt="" />
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
              <span>{badge}</span>
              <button type="button" aria-label={`Dispensar ${title}`}>
                ×
              </button>
            </article>
          ))}
        </section>
      </div>
    </MobileShell>
  );
}
