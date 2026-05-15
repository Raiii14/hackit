import { FormEvent, useState } from "react";
import { Bot, Loader2, MessageCircle, Send } from "lucide-react";
import type { EvaluationResult, LoanInputs } from "../App";
import {
  askLoanWiseAi,
  isLoanWiseChatConfigured,
  type ChatMessage,
} from "../utils/loanwiseChat";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Textarea } from "./ui/textarea";

interface Props {
  inputs: LoanInputs;
  result: EvaluationResult;
  contextLabel?: string;
}

const STARTERS = [
  "Why is this result risky?",
  "Explain my projected cash.",
  "What should I ask the lender?",
];

export function LoanWiseChat({ inputs, result, contextLabel = "current result" }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = isLoanWiseChatConfigured && draft.trim() && !isLoading;

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setIsLoading(true);

    try {
      const reply = await askLoanWiseAi({
        message: trimmed,
        history: messages,
        inputs,
        result,
      });
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="bg-white"
          style={{ borderColor: "#bfdbfe", color: "#1d4ed8" }}
        >
          <MessageCircle size={17} />
          Ask AI
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Bot size={18} />
            LoanWise AI
          </DrawerTitle>
          <DrawerDescription>
            Explains the {contextLabel}. Prototype only, not financial advice.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!isLoanWiseChatConfigured && (
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <p style={{ color: "#991b1b", fontSize: "0.82rem" }}>
                AI is not configured. Add `VITE_SUPABASE_URL` and the legacy anon JWT
                (`VITE_SUPABASE_ANON_KEY`, starts with eyJ) in `Frontend/.env.local`.
              </p>
            </div>
          )}

          {messages.length === 0 && (
            <div className="space-y-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                <p style={{ color: "#1e3a8a", fontSize: "0.84rem", lineHeight: 1.5 }}>
                  Ask about the current numbers. The AI receives only the loan inputs and
                  computed result shown on this screen.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    disabled={!isLoanWiseChatConfigured || isLoading}
                    onClick={() => void sendMessage(starter)}
                    className="rounded-full px-3 py-1.5 text-left"
                    style={{
                      border: "1px solid #dbeafe",
                      color: "#1d4ed8",
                      fontSize: "0.76rem",
                      background: "white",
                      opacity: isLoanWiseChatConfigured ? 1 : 0.55,
                    }}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={isUser ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className="max-w-[88%] rounded-xl px-3 py-2"
                    style={{
                      backgroundColor: isUser ? "#2563eb" : "#f8fafc",
                      color: isUser ? "white" : "#111827",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                      fontSize: "0.84rem",
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2" style={{ color: "#64748b", fontSize: "0.82rem" }}>
                <Loader2 size={15} className="animate-spin" />
                Thinking through your result...
              </div>
            )}

            {error && (
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <p style={{ color: "#991b1b", fontSize: "0.82rem" }}>{error}</p>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              value={draft}
              disabled={!isLoanWiseChatConfigured || isLoading}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask why the result is green, yellow, or red..."
              rows={3}
            />
            <Button
              type="submit"
              disabled={!canSend}
              className="w-full"
              style={{ backgroundColor: "#2563eb", color: "white" }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
