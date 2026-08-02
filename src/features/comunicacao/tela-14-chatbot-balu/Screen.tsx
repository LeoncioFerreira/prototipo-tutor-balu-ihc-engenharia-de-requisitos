import { useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { createChatSession } from "./matcher";
import { demoPets } from "../../../data/demo-pets";

type ChatMessage = { author: "bot" | "user"; text: string; kind?: string };

const initialMessages: ChatMessage[] = [
  {
    author: "bot",
    text: "Olá! Sou o Balu, seu assistente virtual. Estou aqui para ajudar com o Balu. O que você quer saber?",
  },
];

export function ChatbotBaluScreen({
  onBack,
  onNavigate = () => undefined,
}: {
  onBack: () => void;
  onNavigate?: (destination: MainDestination) => void;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const chatSession = useRef(createChatSession(demoPets[0]));
  const messagesRef = useRef<HTMLElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const messageList = messagesRef.current;
    if (messageList) messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const input = messageInputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }, [message]);

  const sendMessage = (text: string) => {
    const question = text.trim();
    if (!question) return;
    const normalizedQuestion = question
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
    if (
      /^(clear|limpar|limpar conversa|limpar conversa toda|comecar de novo|reiniciar conversa)$/.test(
        normalizedQuestion,
      )
    ) {
      chatSession.current = createChatSession(demoPets[0]);
      setMessages(initialMessages);
      setMessage("");
      if (messageInputRef.current) messageInputRef.current.style.height = "56px";
      return;
    }
    const reply = chatSession.current.reply(question);
    setMessages((current) => [
      ...current,
      { author: "user", text: question },
      { author: "bot", text: reply.text, kind: reply.kind },
    ]);
    setMessage("");
    if (messageInputRef.current) messageInputRef.current.style.height = "56px";
  };

  return (
    <MobileShell active="chat" onNavigate={onNavigate}>
      <div className="chatbot-screen" data-figma-node="66:2">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <img src="/assets/figma/chat/balu-avatar.png" alt="" />
          <div>
            <h1>Conversa com Balu</h1>
            <p>Online</p>
          </div>
        </header>

        <section className="chatbot-screen__messages" aria-live="polite" ref={messagesRef}>
          {messages.map(({ author, text, kind }, index) => (
            <p
              key={`${author}-${index}`}
              className={`${author === "user" ? "is-user" : "is-bot"} ${kind?.startsWith("emergency") ? "is-emergency" : ""}`}
            >
              {text}
            </p>
          ))}
        </section>

        <section className="chatbot-screen__controls" aria-label="Controles da conversa">
          <aside className="chatbot-screen__warning">
            <span aria-hidden="true">
              <TriangleAlert size={21} strokeWidth={2.25} />
            </span>
            <p>
              A assistente virtual não substitui uma consulta. Se os sintomas persistirem por 24h,
              agende um atendimento profissional.
            </p>
          </aside>

          <div className="chatbot-screen__chips">
            <button
              type="button"
              className="is-emergency"
              onClick={() => sendMessage("emergência")}
            >
              Acionar Emergência
            </button>
            <button type="button" onClick={() => sendMessage("dicas de saúde")}>
              Dicas de Saúde
            </button>
            <button type="button" onClick={() => sendMessage("remédio")}>
              Remédios
            </button>
          </div>

          <form
            className="chatbot-screen__input"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(message);
            }}
          >
            <textarea
              aria-label="Mensagem"
              ref={messageInputRef}
              rows={1}
              placeholder="Escreva sua mensagem..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                if (event.ctrlKey) setMessage((current) => `${current}\n`);
                else sendMessage(message);
              }}
            />
            <button type="submit" aria-label="Enviar mensagem">
              <img src="/assets/figma/chat/send.svg" alt="" />
            </button>
          </form>
        </section>
      </div>
    </MobileShell>
  );
}
