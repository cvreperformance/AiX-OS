"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Am €300,000. Ar trebui să cumpăr acum?",
  "Compară Pipera cu Floreasca ca investiție.",
  "Care e yield-ul mediu în Herăstrău?",
  "Ce zonă are cea mai mare apreciere în București?",
  "Explică-mi impactul ROBOR asupra pieței.",
];

function generateResponse(input: string): string {
  const q = input.toLowerCase();

  // 300K logic
  if (q.includes("300") || q.includes("cumpăr") || q.includes("cumpar")) {
    return `Pe baza condițiilor actuale de piață (ROBOR ~6.85%, inflație ~5%):

• Cu €300K poți accesa segmentul mid-premium (€250K–€350K)
• Zone recomandate: Herăstrău, Pipera, Corbeanca
• Strategie: buy & hold 5–7 ani

AiX OS Insight: piața este stabilă, cu oportunități selective.`;
  }

  // Pipera vs Floreasca
  if (q.includes("pipera") && q.includes("floreasca")) {
    return `Pipera vs Floreasca — AiX OS:

• Pipera: yield 5–7%, mai bun pentru cashflow
• Floreasca: premium, stabilitate, apreciere lentă
• Concluzie: Pipera = investiție, Floreasca = wealth preservation`;
  }

  // Yield Herastrau
  if (q.includes("yield") || q.includes("herăstrău") || q.includes("herastrau")) {
    return `Herăstrău Yield:

• 5.5% – 7.5% mediu
• Airbnb: până la 10–12%
• Zonă premium cu cerere constantă expat/corporate`;
  }

  // ROBOR
  if (q.includes("robor")) {
    return `ROBOR impact:

• Nivel actual ~6.85%
• Credite ipotecare ~9–10% total
• Piață: cumpărătorii cash au avantaj major

AiX OS: semnal neutru spre pozitiv pe termen scurt.`;
  }

  return `Sunt AiX OS Advisor.

Pentru analiză reală spune-mi:
• bugetul tău
• zona
• scop (investiție / locuire)

sau alege o sugestie de mai sus.`;
}

export default function AiAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bună. Sunt AiX OS Advisor.\n\nÎți pot analiza investiții imobiliare, randamente, zone și piața din România.\n\nCu ce vrei să începem?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const response = generateResponse(msg);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response },
    ]);

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 flex flex-col min-h-[calc(100vh-8rem)]">
      <PageHeader
        badge="AI Advisor"
        title="Consilierul Tău de Investiții"
        subtitle="Analiză imobiliară, ROI, zone, credite și oportunități AiX OS"
      />

      <div className="flex-1 flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : ""
              }`}
            >
              {m.role === "assistant" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-amber-400" />
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-amber-500/10 text-zinc-200 border border-amber-500/20"
                    : "bg-zinc-800/50 text-zinc-300"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-zinc-800/50 text-sm text-zinc-500">
                Analizez piața...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Întreabă AiX OS..."
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-amber-500 px-4 py-3 text-black disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-600 text-center mt-4">
        AiX OS Advisor (demo logic engine)
      </p>
    </div>
  );
}