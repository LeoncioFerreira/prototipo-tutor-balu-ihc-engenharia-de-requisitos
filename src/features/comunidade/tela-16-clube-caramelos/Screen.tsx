import { MobileShell } from "../../../components/ui/MobileShell";
import { PageHeader } from "../../../components/ui/ScreenPrimitives";
export function CaramelClubScreen() {
  return (
    <MobileShell>
      <PageHeader
        title="Clube dos Caramelos"
        subtitle="2,4 mil membros"
        onBack={() => history.back()}
      />
      <section className="rounded-[18px] border border-[#b2f5ea] bg-[#e6fffa] p-4">
        <b>Comunidade para tutores de caramelos</b>
        <p className="mt-2 text-sm text-[#4a5568]">Compartilhe dicas, rotina e experiências.</p>
      </section>
      <h2 className="mt-6 font-bold">Publicações recentes</h2>
      <article className="mt-3 rounded-[18px] border border-[#e2e8f0] bg-white p-4">
        <b>Salomão Rodrigues</b>
        <p className="mt-2 text-sm text-[#4a5568]">
          O Balu soltou muito pelo essa semana. Quem tem uma dica de escovação?
        </p>
        <div className="mt-3 text-xs text-[#6b8297]">♡ 12 curtidas · 4 comentários</div>
      </article>
      <article className="mt-3 rounded-[18px] border border-[#e2e8f0] bg-white p-4">
        <b>Marina Alves</b>
        <p className="mt-2 text-sm text-[#4a5568]">
          Qual ração vocês têm usado para os caramelos mais ativos?
        </p>
      </article>
      <button className="mt-5 w-full rounded-full bg-[#002045] py-3 text-sm font-bold text-white">
        Criar publicação
      </button>
    </MobileShell>
  );
}
