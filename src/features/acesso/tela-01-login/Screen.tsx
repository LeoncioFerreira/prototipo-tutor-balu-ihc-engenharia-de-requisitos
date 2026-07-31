type Props = { onEnter: () => void };

export function LoginScreen({ onEnter }: Props) {
  return <section className="min-h-screen bg-white px-5 pt-10 text-[#183a78]">
    <header className="space-y-1"><h1 className="text-2xl font-extrabold">Entrar no Balu</h1><p className="text-sm font-medium text-[#4a5568]">Acompanhe a saúde do seu pet com segurança</p></header>
    <div className="flex h-40 items-center justify-center"><img className="h-32 w-auto object-contain" src="/assets/figma/logo-balu.png" alt="Balu" /></div>
    <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); onEnter(); }}>
      <strong className="block text-sm">Login</strong>
      <label className="block text-xs font-semibold text-[#4a5568]">E-mail<input className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal" placeholder="voce@email.com" type="email" /></label>
      <label className="block text-xs font-semibold text-[#4a5568]">Senha<input className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-sm font-normal" placeholder="Digite sua senha" type="password" /></label>
      <button className="h-14 w-full rounded-[28px] bg-[#183a78] text-base font-extrabold text-white shadow-lg" type="submit">Entrar</button>
    </form>
    <p className="mt-5 text-sm text-[#4a5568]">Não tem conta? <button className="font-bold text-[#183a78]">Criar conta</button></p>
    <div className="my-5 flex items-center gap-4 text-xs font-extrabold text-[#4a5568]"><i className="h-px flex-1 bg-[#dfe5ec]" />OU<i className="h-px flex-1 bg-[#dfe5ec]" /></div>
    <button className="mb-3 h-14 w-full rounded-[18px] border border-[#b2f5ea] text-left pl-14 font-semibold shadow-sm">Continuar com Google</button>
    <button className="h-14 w-full rounded-[18px] border border-[#b2f5ea] text-left pl-14 font-semibold shadow-sm">Continuar com Apple</button>
  </section>;
}
