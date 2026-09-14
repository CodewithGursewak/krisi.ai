import { useState } from "react";
import { Camera, Languages, Mic, Sprout, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/krishi/ChatPanel";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import heroImage from "@/assets/krishi-hero.jpg";

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const labels = t[lang];

  const pick = (en: string, hi: string, pa: string) =>
    lang === "hi" ? hi : lang === "pa" ? pa : en;

  const features = [
    {
      icon: Languages,
      title: pick("Hindi, Punjabi & English", "हिंदी, पंजाबी और अंग्रेज़ी", "ਪੰਜਾਬੀ, ਹਿੰਦੀ ਤੇ ਅੰਗਰੇਜ਼ੀ"),
      desc: pick(
        "Chat in your language and get replies in the same language",
        "अपनी भाषा में बात करें, उसी भाषा में जवाब पाएं",
        "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗੱਲ ਕਰੋ, ਉਸੇ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਪਾਓ",
      ),
    },
    {
      icon: Mic,
      title: pick("Voice input", "आवाज़ से पूछें", "ਆਵਾਜ਼ ਨਾਲ ਪੁੱਛੋ"),
      desc: pick(
        "No typing needed — just speak naturally",
        "टाइप करने की ज़रूरत नहीं — बस बोलें",
        "ਟਾਈਪ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ — ਬਸ ਬੋਲੋ",
      ),
    },
    {
      icon: Volume2,
      title: pick("Listen to answers", "सुनकर सीखें", "ਸੁਣ ਕੇ ਸਿੱਖੋ"),
      desc: pick(
        "Hear every reply read aloud in your language",
        "हर जवाब को सुनें, पढ़ने की ज़रूरत नहीं",
        "ਹਰ ਜਵਾਬ ਸੁਣੋ, ਪੜ੍ਹਨ ਦੀ ਲੋੜ ਨਹੀਂ",
      ),
    },
    {
      icon: Camera,
      title: pick("Disease detection", "बीमारी की पहचान", "ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ"),
      desc: pick(
        "Send a photo of a sick plant and get treatment steps",
        "बीमार पौधे की फोटो भेजें, इलाज पाएं",
        "ਬਿਮਾਰ ਪੌਦੇ ਦੀ ਫੋਟੋ ਭੇਜੋ, ਇਲਾਜ ਪਾਓ",
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Indian farm landscape at sunrise"
            className="h-full w-full object-cover"
            width={1536}
            height={896}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-10 sm:pt-10 sm:pb-16">
          <nav className="flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/15 backdrop-blur ring-1 ring-primary-foreground/20">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base font-bold leading-tight">
                  {labels.appName}
                </p>
                <p className="text-xs opacity-85 leading-tight">{labels.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-background/15 backdrop-blur p-1 ring-1 ring-primary-foreground/20">
              {([["en","EN"],["hi","हिं"],["pa","ਪੰਜ"]] as const).map(([v,l]) => (
                <Button
                  key={v}
                  size="sm"
                  variant={lang === v ? "default" : "ghost"}
                  onClick={() => setLang(v)}
                  className={`h-8 rounded-full px-3 text-xs font-semibold ${lang === v ? "bg-background text-foreground hover:bg-background/90" : "text-primary-foreground hover:bg-background/20 hover:text-primary-foreground"}`}
                >
                  {l}
                </Button>
              ))}
            </div>
          </nav>

          <div className="mt-10 sm:mt-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
            <div className="text-primary-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur px-3 py-1 text-xs font-semibold ring-1 ring-primary-foreground/20">
                <Sprout className="h-3.5 w-3.5" />
                {pick("For farmers, with farmers", "किसानों के लिए, किसानों के साथ", "ਕਿਸਾਨਾਂ ਲਈ, ਕਿਸਾਨਾਂ ਨਾਲ")}
              </span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                {labels.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg opacity-90 leading-relaxed">
                {labels.heroSub}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl bg-background/10 backdrop-blur ring-1 ring-primary-foreground/15 p-3"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-background/20">
                      <f.icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-2 font-semibold text-sm">{f.title}</p>
                    <p className="mt-0.5 text-xs opacity-85 leading-snug">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat card */}
            <div className="lg:sticky lg:top-6 h-[640px] lg:h-[680px] rounded-3xl bg-background border border-border shadow-glow overflow-hidden">
              <ChatPanel lang={lang} setLang={setLang} />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {labels.appName}.{" "}
            {pick("All rights reserved.", "सभी अधिकार सुरक्षित।", "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ।")}
          </p>
          <p>
            {pick("Powered by krisi Cloud & krisi AI", "krisi Cloud और krisi AI द्वारा संचालित", "krisi Cloud ਅਤੇ krisi AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
