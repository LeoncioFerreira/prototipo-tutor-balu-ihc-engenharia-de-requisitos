import replies from "../../../data/chatbot-responses.json";

export type ChatbotReply = { kind: "answer" | "fallback" | "urgent"; text: string };

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function findChatbotReply(question: string): ChatbotReply {
  const normalized = normalize(question);
  if (replies.urgentKeywords.some((keyword) => normalized.includes(keyword))) {
    return { kind: "urgent", text: replies.urgentReply };
  }
  const selected = replies.intents
    .map((intent) => ({ intent, score: intent.keywords.filter((keyword) => normalized.includes(keyword)).length }))
    .sort((a, b) => b.score - a.score)[0];
  return selected?.score
    ? { kind: "answer", text: selected.intent.reply }
    : { kind: "fallback", text: replies.fallbackReply };
}
