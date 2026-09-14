import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

// Browser SpeechRecognition shim
type SR = any;
const getSR = (): SR | null => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const isSpeechRecognitionSupported = () => !!getSR();

export function useSpeechRecognition(lang: Lang) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) {
      setError("not-supported");
      return;
    }
    try {
      const rec = new SR();
      rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
      rec.continuous = false;
      rec.interimResults = true;

      let finalText = "";
      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const txt = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += txt;
          else interim += txt;
        }
        setTranscript((finalText + interim).trim());
      };
      rec.onerror = (e: any) => {
        setError(e.error || "error");
        setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.onstart = () => {
        setError(null);
        setTranscript("");
        setListening(true);
      };
      recRef.current = rec;
      rec.start();
    } catch (err) {
      setError("error");
      setListening(false);
    }
  }, [lang]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {}
    setListening(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { listening, transcript, error, start, stop, setTranscript };
}

// Voice synthesis
export function speak(text: string, lang: Lang, onEnd?: () => void, onStart?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utter.rate = 1;
  utter.pitch = 1;
  // Try to pick a matching voice
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang?.toLowerCase().startsWith(lang === "hi" ? "hi" : "en"));
  if (match) utter.voice = match;
  utter.onstart = () => onStart?.();
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Heuristic: detect Devanagari (Hindi) or Gurmukhi (Punjabi) script
export function detectLang(text: string): Lang {
  if (!text) return "en";
  const gurmukhi = (text.match(/[\u0A00-\u0A7F]/g) || []).length;
  if (gurmukhi >= 2) return "pa";
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  return devanagari >= 2 ? "hi" : "en";
}
