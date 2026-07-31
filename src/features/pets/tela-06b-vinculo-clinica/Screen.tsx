import { InformationScreen } from "../../../components/ui/InformationScreen";
export function ClinicLinkScreen() {
  return (
    <InformationScreen
      title="Vínculo com clínica"
      subtitle="Conecte o Balu à clínica veterinária"
      items={[{ title: "Clínica Vet Mais", description: "Aguardando aprovação" }]}
      button="Enviar solicitação"
    />
  );
}
