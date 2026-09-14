import { useEffect, useState } from "react";
import { Sprout, User, Volume2, VolumeX } from "lucide-react";
import { speak, stopSpeaking } from "@/hooks/useSpeech";
import type { Message } from "@/lib/krishi-api";
import { t, type Lang } from "@/lib/i18n";
import { detectLang } from "@/hooks/useSpeech";
import { DiseaseCard } from "./DiseaseCard";

interface Props {
  message: Message;
  uiLang: Lang;
  isStreaming?: boolean;
}

export function ChatBubble({ message, uiLang, isStreaming }: Props) {
  const isUser = message.role === "user";
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (speaking) stopSpeaking();
    };
  }, [speaking]);

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const lang = message.lang || detectLang(message.content);
    speak(
      message.content,
      lang,
      () => setSpeaking(false),
      () => setSpeaking(true),
    );
  };

  if (isUser) {
    return (
      <div className="flex items-end gap-2 justify-end animate-fade-up">
        <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="ml-auto max-h-56 rounded-2xl rounded-br-md object-cover shadow-soft"
              loading="lazy"
            />
          )}
          {message.content && (
            <div className="rounded-2xl rounded-br-md bg-gradient-bubble-user px-4 py-2.5 text-primary-foreground shadow-soft">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {message.content}
              </p>
            </div>
          )}
        </div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 animate-fade-up">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
        <Sprout className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
        {message.disease && (
          <DiseaseCard
            data={message.disease}
            imageUrl={message.imageUrl}
            lang={message.lang || uiLang}
          />
        )}
        {message.content && (
          <div className="group rounded-2xl rounded-bl-md bg-card border border-border px-4 py-2.5 shadow-soft">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
              {message.content}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />
              )}
            </p>
            {!isStreaming && message.content && (
              <button
                type="button"
                onClick={handleSpeak}
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-smooth ${speaking ? "bg-primary text-primary-foreground speak-active" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`}
                aria-label={speaking ? "Stop speaking" : "Read aloud"}
              >
                {speaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    {t[uiLang].speaking}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    {uiLang === "hi" ? "सुनें" : uiLang === "pa" ? "ਸੁਣੋ" : "Listen"}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
