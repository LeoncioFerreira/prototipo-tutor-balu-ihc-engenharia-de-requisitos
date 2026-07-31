import { MobileShell } from "../../../components/ui/MobileShell";
export function CommunitiesScreen() {
  return (
    <MobileShell>
      <h1 className="text-xl font-extrabold">Comunidades</h1>
      <p className="mt-1 text-sm text-[#6b8297]">Encontre tutores e troque experiências.</p>
      <input
        className="mt-5 h-11 w-full rounded-full border border-[#dce6ef] bg-white px-4 text-sm"
        placeholder="Buscar comunidades"
      />
      <h2 className="mt-6 text-base font-bold">Comunidades em destaque</h2>
      <div className="mt-3 space-y-4">
        {[
          ["Clube dos Caramelos", "2,4 mil membros", "Dicas, rotina e cuidado com caramelos"],
          ["Gateiros unidos", "1,8 mil membros", "Histórias e cuidados para gatos"],
        ].map(([title, members, text]) => (
          <article key={title} className="rounded-[18px] border border-[#e2e8f0] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e6fffa] text-xl">
                🐾
              </span>
              <div>
                <b>{title}</b>
                <p className="text-xs text-[#6b8297]">{members}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#4a5568]">{text}</p>
            <button className="mt-4 rounded-full bg-[#002045] px-4 py-2 text-xs font-bold text-white">
              Entrar no clube
            </button>
          </article>
        ))}
      </div>
    </MobileShell>
  );
}
