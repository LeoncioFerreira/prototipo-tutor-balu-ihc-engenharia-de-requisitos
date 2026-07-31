import { MobileShell } from "../../../components/ui/MobileShell";
export function ChatbotBaluScreen() {
  return (
    <MobileShell>
      <h1 className="text-lg font-bold">Conversa com Balu</h1>
      <p className="text-xs text-[#24b09c]">Online • Assistente Virtual</p>
      <div className="mt-6 space-y-3 text-xs">
        <p className="w-3/4 rounded-2xl border border-[#b2f5ea] bg-[#e6f7f4] p-3">
          Olá! Sou o Balu, seu assistente virtual. Qual pet você quer avaliar agora?
        </p>
        <p className="ml-auto w-3/4 rounded-2xl border bg-white p-3">
          É o Bruce. Desde ontem ele está quieto e recusou a ração.
        </p>
        <p className="w-3/4 rounded-2xl border border-[#b2f5ea] bg-[#e6f7f4] p-3">
          Ele teve vômito, diarreia, febre ou dificuldade para respirar?
        </p>
      </div>
      <p className="mt-5 rounded-2xl border border-[#fed7d7] bg-[#ffebeb] p-3 text-[10px] text-[#c53030]">
        A assistente virtual não substitui uma consulta.
      </p>
      <input
        className="mt-4 h-12 w-full rounded-2xl border px-4"
        placeholder="Escreva sua mensagem..."
      />
    </MobileShell>
  );
}
