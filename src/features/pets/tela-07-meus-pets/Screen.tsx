import { InformationScreen } from "../../../components/ui/InformationScreen";
export function MyPetsScreen() { return <InformationScreen title="Meus pets" subtitle="Escolha um pet para ver os cuidados" items={[{ title: "Balu", description: "Samoieda • 2 anos" }, { title: "Pipoca", description: "SRD • 4 anos" }, { title: "Pretinha", description: "SRD • 3 anos" }]} button="Adicionar pet" />; }
