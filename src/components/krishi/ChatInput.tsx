import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, Mic, MicOff, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  isSpeechRecognitionSupported,
  useSpeechRecognition,
} from "@/hooks/useSpeech";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { Waveform } from "./Waveform";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  lang: Lang;
  onSend: (text: string) => void;
  onSendImage: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({ lang, onSend, onSendImage, disabled }: Props) {
  const [value, setValue] = useState("");
  const [pendingImage, setPendingImage] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { listening, transcript, error, start, stop } = useSpeechRecognition(lang);
  const labels = t[lang];

  // Sync interim transcript into input
  useEffect(() => {
    if (transcript) setValue(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!error) return;
    if (error === "not-supported") toast.error(labels.micNotSupported);
    else if (error === "not-allowed" || error === "service-not-allowed")
      toast.error(labels.micDenied);
    else if (error !== "aborted") toast.error(labels.voiceErr);
  }, [error, labels]);

  const handleMic = () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error(labels.micNotSupported);
      return;
    }
    if (listening) stop();
    else start();
  };

  const handleSubmit = () => {
    if (pendingImage) {
      onSendImage(pendingImage.file);
      URL.revokeObjectURL(pendingImage.url);
      setPendingImage(null);
      return;
    }
    const txt = value.trim();
    if (!txt || disabled) return;
    onSend(txt);
    setValue("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (pendingImage) URL.revokeObjectURL(pendingImage.url);
    setPendingImage({ file, url: URL.createObjectURL(file) });
  };

  const removePending = () => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.url);
    setPendingImage(null);
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft p-3">
      {pendingImage && (
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-secondary p-2 animate-fade-up">
          <img
            src={pendingImage.url}
            alt="Preview"
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {pendingImage.file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === "hi" ? "भेजने के लिए तैयार" : lang === "pa" ? "ਭੇਜਣ ਲਈ ਤਿਆਰ" : "Ready to analyze"}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={removePending}
            className="h-8 w-8 shrink-0"
            aria-label={labels.cancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {listening && (
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-destructive/10 px-3 py-2 text-destructive animate-fade-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
          </span>
          <span className="text-sm font-medium">{labels.listening}</span>
          <div className="ml-auto text-destructive">
            <Waveform active bars={6} />
          </div>
        </div>
      )}

      <Textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={labels.placeholder}
        rows={1}
        className="min-h-[44px] resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0 text-base"
      />

      <div className="mt-1 flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleMic}
          className={`h-10 w-10 rounded-full ${listening ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 mic-active" : "text-muted-foreground hover:text-primary"}`}
          aria-label={listening ? "Stop recording" : "Start voice input"}
        >
          {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary"
              aria-label="Add image"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" /> {labels.upload}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => cameraInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" /> {labels.capture}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />

        <div className="flex-1" />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && !pendingImage)}
          className="h-10 rounded-full bg-gradient-primary px-5 font-semibold shadow-glow hover:opacity-95"
        >
          <Send className="mr-1.5 h-4 w-4" />
          {labels.send}
        </Button>
      </div>
    </div>
  );
}
