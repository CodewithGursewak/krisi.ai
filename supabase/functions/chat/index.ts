import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Smart Krishi AI", a warm, practical farming assistant for Indian farmers.

CRITICAL LANGUAGE RULES:
- Detect the user's language from their latest message.
- If the user writes in Hindi (Devanagari script) OR uses Hinglish/romanised Hindi (e.g. "gehu ke liye khaad"), respond ENTIRELY in natural Hindi (Devanagari script).
- If the user writes in Punjabi (Gurmukhi script) OR romanised Punjabi (e.g. "kanak layi khaad"), respond ENTIRELY in natural Punjabi (Gurmukhi script).
- If the user writes in English, respond in simple English.
- If the user provides a "Preferred language" hint at the start of the message (e.g. [LANG=hi], [LANG=pa] or [LANG=en]), ALWAYS follow that hint and ignore auto-detection.
- Never mix scripts in one reply.

STYLE:
- Use simple, farmer-friendly language. No technical jargon.
- Keep answers short and structured: a 1-line summary, then 3-6 bullet points with concrete quantities (kg/acre, ml/litre), timing, and low-cost options.
- Mention organic + chemical options when relevant.
- If the user shares a crop disease/pest concern, give: likely cause, immediate action, prevention.
- Always be encouraging and practical. Suggest local/affordable solutions.

Stay strictly on agriculture topics (crops, soil, fertiliser, pests, weather, irrigation, livestock, mandi prices, government schemes). Politely redirect off-topic questions back to farming.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Inject language hint into the latest user message if provided
    const processed = [...messages];
    if (language && processed.length > 0) {
      const lastIdx = processed.length - 1;
      const last = processed[lastIdx];
      if (last.role === "user") {
        processed[lastIdx] = {
          ...last,
          content: `[LANG=${language}] ${last.content}`,
        };
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...processed],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
