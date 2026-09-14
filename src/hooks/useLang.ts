import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const KEY = "krishi-lang";
const EVT = "krishi-lang-change";

const read = (): Lang => {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(KEY);
  return v === "hi" || v === "pa" || v === "en" ? v : "en";
};

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(read);

  useEffect(() => {
    const handler = () => setLangState(read());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    window.localStorage.setItem(KEY, l);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return [lang, setLang];
}
