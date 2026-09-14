import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { LanguageToggle } from "./LanguageToggle";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  detectDisease,
  fileToBase64,
  streamChat,
  type Message,
} from "@/lib/krishi-api";
import { detectLang } from "@/hooks/useSpeech";

const uid = () => Math.random().toString(36).slice(2, 11);

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export function ChatPanel({ lang, setLang }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labels = t[lang];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streamingId, analyzing]);

  const send = useCallback(
    async (text: string) => {
      // Auto-detect language from message; fall back to UI lang
      const detected = detectLang(text);
      const useLang: Lang = detected || lang;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        lang: useLang,
      };
      const assistantId = uid();
      setMessages((prev) => [...prev, userMsg]);
      setStreamingId(assistantId);

      // Build history for API (exclude image-only & disease cards content)
      const history = [...messages, userMsg]
        .filter((m) => m.content)
        .map((m) => ({ role: m.role, content: m.content }));

      let acc = "";
      try {
        await streamChat({
          messages: history,
          language: useLang,
          onDelta: (chunk) => {
            acc += chunk;
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === assistantId);
              if (!exists) {
                return [
                  ...prev,
                  { id: assistantId, role: "assistant", content: acc, lang: useLang },
                ];
              }
              return prev.map((m) =>
                m.id === assistantId ? { ...m, content: acc } : m,
              );
            });
          },
          onDone: () => setStreamingId(null),
        });
      } catch (e: any) {
        setStreamingId(null);
        const msg = e?.message || "Something went wrong";
        toast.error(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    },
    [messages, lang],
  );

  const sendImage = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: labels.diagnosePrompt,
        imageUrl: url,
        lang,
      };
      setMessages((prev) => [...prev, userMsg]);
      setAnalyzing(true);
      try {
        const { base64, mimeType } = await fileToBase64(file);
        const result = await detectDisease(base64, mimeType, lang);
        const pct = Math.round(result.confidence);
        const summary =
          lang === "hi"
            ? `${result.crop} में ${result.disease} (विश्वसनीयता ${pct}%)। ${result.description}`
            : lang === "pa"
              ? `${result.crop} ਵਿੱਚ ${result.disease} (ਭਰੋਸਾ ${pct}%)। ${result.description}`
              : `Detected ${result.disease} on ${result.crop} with ${pct}% confidence. ${result.description}`;
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: summary,
            lang,
            imageUrl: url,
            disease: result,
          },
        ]);
      } catch (e: any) {
        toast.error(e?.message || "Disease detection failed");
      } finally {
        setAnalyzing(false);
      }
    },
    [lang, labels],
  );

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card/80 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold leading-tight">
              {labels.appName}
            </h2>
            <p className="text-xs text-muted-foreground leading-tight">{labels.tagline}</p>
          </div>
        </div>
        <LanguageToggle lang={lang} onChange={setLang} />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {empty && (
          <div className="mx-auto max-w-md text-center pt-6 animate-fade-up">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold">{labels.welcomeTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{labels.welcomeBody}</p>
            <div className="mt-5 grid gap-2">
              {labels.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground/90 transition-smooth hover:border-primary/40 hover:bg-secondary hover:shadow-soft"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            message={m}
            uiLang={lang}
            isStreaming={m.id === streamingId}
          />
        ))}

        {analyzing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Sprout className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-2.5 shadow-soft flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{labels.analyzing}</span>
            </div>
          </div>
        )}

        {streamingId && !messages.find((m) => m.id === streamingId) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Sprout className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-2.5 shadow-soft flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{labels.thinking}</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur p-3 sm:p-4">
        <ChatInput
          lang={lang}
          onSend={send}
          onSendImage={sendImage}
          disabled={!!streamingId || analyzing}
        />
      </div>
    </div>
  );
}
