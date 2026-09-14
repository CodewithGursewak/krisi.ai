import type { Lang } from "./i18n";

export const navLabels: Record<
  Lang,
  {
    groupLabel: string;
    chat: string;
    crop: string;
    disease: string;
    weather: string;
    fertilizer: string;
    market: string;
    settings: string;
    home: string;
    ask: string;
    askPlaceholder: string;
    quick: string;
    emptyHint: string;
    listen: string;
    stop: string;
    language: string;
    languageHelp: string;
    voiceAnswers: string;
    voiceAnswersHelp: string;
    autoDetect: string;
    autoDetectHelp: string;
  }
> = {
  en: {
    groupLabel: "Menu",
    chat: "Chat Assistant",
    crop: "Crop Guide",
    disease: "Disease Detection",
    weather: "Weather Update",
    fertilizer: "Fertilizer Guide",
    market: "Market Prices",
    settings: "Settings",
    home: "Home",
    ask: "Ask",
    askPlaceholder: "Type your question...",
    quick: "Quick questions",
    emptyHint: "Pick a quick question or type your own.",
    listen: "Listen",
    stop: "Stop",
    language: "Language",
    languageHelp: "Used across the app and for voice replies.",
    voiceAnswers: "Read answers aloud automatically",
    voiceAnswersHelp: "Answers start playing as soon as they are ready.",
    autoDetect: "Auto-detect language from my messages",
    autoDetectHelp: "Reply in the language you typed or spoke in.",
  },
  hi: {
    groupLabel: "मेन्यू",
    chat: "चैट सहायक",
    crop: "फसल गाइड",
    disease: "बीमारी पहचान",
    weather: "मौसम जानकारी",
    fertilizer: "खाद गाइड",
    market: "मंडी भाव",
    settings: "सेटिंग्स",
    home: "होम",
    ask: "पूछें",
    askPlaceholder: "अपना सवाल लिखें...",
    quick: "झटपट सवाल",
    emptyHint: "कोई सवाल चुनें या खुद लिखें।",
    listen: "सुनें",
    stop: "रोकें",
    language: "भाषा",
    languageHelp: "पूरे ऐप और आवाज़ के जवाब के लिए।",
    voiceAnswers: "जवाब अपने आप सुनाएँ",
    voiceAnswersHelp: "जवाब तैयार होते ही बोलना शुरू हो जाएगा।",
    autoDetect: "मेरे संदेश से भाषा पहचानें",
    autoDetectHelp: "जिस भाषा में लिखें/बोलें, उसी में जवाब।",
  },
  pa: {
    groupLabel: "ਮੀਨੂ",
    chat: "ਚੈਟ ਸਹਾਇਕ",
    crop: "ਫ਼ਸਲ ਗਾਈਡ",
    disease: "ਬਿਮਾਰੀ ਪਛਾਣ",
    weather: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
    fertilizer: "ਖਾਦ ਗਾਈਡ",
    market: "ਮੰਡੀ ਭਾਅ",
    settings: "ਸੈਟਿੰਗਾਂ",
    home: "ਹੋਮ",
    ask: "ਪੁੱਛੋ",
    askPlaceholder: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ...",
    quick: "ਝਟਪਟ ਸਵਾਲ",
    emptyHint: "ਕੋਈ ਸਵਾਲ ਚੁਣੋ ਜਾਂ ਆਪ ਲਿਖੋ।",
    listen: "ਸੁਣੋ",
    stop: "ਰੋਕੋ",
    language: "ਭਾਸ਼ਾ",
    languageHelp: "ਪੂਰੀ ਐਪ ਤੇ ਆਵਾਜ਼ ਦੇ ਜਵਾਬਾਂ ਲਈ।",
    voiceAnswers: "ਜਵਾਬ ਆਪੇ ਸੁਣਾਓ",
    voiceAnswersHelp: "ਜਵਾਬ ਤਿਆਰ ਹੁੰਦੇ ਹੀ ਬੋਲਣਾ ਸ਼ੁਰੂ।",
    autoDetect: "ਮੇਰੇ ਸੁਨੇਹੇ ਤੋਂ ਭਾਸ਼ਾ ਪਛਾਣੋ",
    autoDetectHelp: "ਜਿਸ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੋ/ਬੋਲੋ, ਉਸੇ ਵਿੱਚ ਜਵਾਬ।",
  },
};
