import { useCallback, useRef, useState } from "react";
import { Loader2, Send, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lang } from "@/lib/i18n";
import { navLabels } from "@/lib/nav";
import { streamChat } from "@/lib/krishi-api";
import { detectLang, speak, stopSpeaking } from "@/hooks/useSpeech";

interface Props {
  lang: Lang;
  /** Extra instruction prepended to the user's question to focus the topic. */
  topicPrompt: string;
  suggestions: string[];
}

export function TopicPanel({ lang, topicPrompt, suggestions }: Props) {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const answerLang = useRef<Lang>(lang);
  const nav = navLabels[lang];

  const ask = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || loading) return;
      const useLang: Lang = detectLang(q) || lang;
      answerLang.current = useLang;
      setQuestion(q);
      setAnswer("");
      setInput("");
      setLoading(true);
      let acc = "";
      try {
        await streamChat({
          messages: [{ role: "user", content: `${topicPrompt}\n\n${q}` }],
          language: useLang,
          onDelta: (chunk) => {
            acc += chunk;
            setAnswer(acc);
          },
          onDone: () => setLoading(false),
        });
      } catch (e: unknown) {
        setLoading(false);
        toast.error(e instanceof Error ? e.message : "Something went wrong");
      }
    },
    [lang, loading, topicPrompt],
  );

  const toggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speak(answer, answerLang.current, () => setSpeaking(false), () => setSpeaking(true));
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-foreground/80">{nav.quick}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-smooth hover:border-primary/40 hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={nav.askPlaceholder}
          className="h-11 rounded-xl"
        />
        <Button type="submit" disabled={loading || !input.trim()} className="h-11 rounded-xl px-4">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">{nav.ask}</span>
        </Button>
      </form>

      {!question && !answer && (
        <p className="text-sm text-muted-foreground">{nav.emptyHint}</p>
      )}

      {question && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-sm font-semibold">{question}</p>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {answer || (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {question ? "…" : ""}
              </span>
            )}
          </div>
          {answer && !loading && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={toggleSpeak}
              className="mt-3 h-8 rounded-full px-3 text-xs"
            >
              {speaking ? (
                <Square className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
              <span className="ml-1.5">{speaking ? nav.stop : nav.listen}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
