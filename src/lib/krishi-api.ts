import type { Lang } from "./i18n";

export type Role = "user" | "assistant";

export type DiseaseResult = {
  crop: string;
  disease: string;
  confidence: number;
  description: string;
  treatment: string[];
  severity: "low" | "medium" | "high";
};

export type Message = {
  id: string;
  role: Role;
  content: string;
  lang?: Lang;
  imageUrl?: string;
  disease?: DiseaseResult;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const DISEASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/disease-detect`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type StreamArgs = {
  messages: { role: Role; content: string }[];
  language: Lang;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
};

export async function streamChat({ messages, language, onDelta, onDone, signal }: StreamArgs) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify({ messages, language }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    let msg = "Failed to start chat.";
    try {
      const j = await resp.json();
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") {
        done = true;
        break;
      }
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }

  if (buf.trim()) {
    for (let raw of buf.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || !raw.startsWith("data: ")) continue;
      const json = raw.slice(6).trim();
      if (json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {}
    }
  }

  onDone();
}

export async function detectDisease(
  imageBase64: string,
  mimeType: string,
  language: Lang,
): Promise<DiseaseResult> {
  const resp = await fetch(DISEASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}` },
    body: JSON.stringify({ imageBase64, mimeType, language }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Disease detection failed");
  return data as DiseaseResult;
}

export function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [head, b64] = result.split(",");
      const mt = head.match(/data:(.*?);base64/)?.[1] || file.type || "image/jpeg";
      resolve({ base64: b64, mimeType: mt });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
