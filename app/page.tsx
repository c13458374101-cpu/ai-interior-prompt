"use client";

import { Copy, Dice5, Loader2, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const labels = {
  title: "\u5ba4\u5185\u8bbe\u8ba1 Prompt \u751f\u6210\u5668",
  subtitle:
    "\u9009\u62e9\u7a7a\u95f4\u3001\u98ce\u683c\u3001\u6750\u8d28\u3001\u5173\u952e\u8bcd\u548c\u6c1b\u56f4\uff0c\u751f\u6210\u53ef\u5206\u4eab\u7684\u5ba4\u5185\u8bbe\u8ba1\u65b9\u6848\u94fe\u63a5\uff0c\u5e76\u8f93\u51fa\u53ef\u76f4\u63a5\u7528\u4e8e\u56fe\u50cf\u6a21\u578b\u7684\u82f1\u6587\u63d0\u793a\u8bcd\u3002",
  space: "\u7a7a\u95f4",
  style: "\u98ce\u683c",
  mood: "\u6c1b\u56f4",
  palette: "\u914d\u8272",
  material: "\u4e3b\u8981\u6750\u8d28",
  budget: "\u9884\u7b97\u5b9a\u4f4d",
  detail: "\u5173\u952e\u7ec6\u8282",
  keywords: "\u5173\u952e\u8bcd",
  generatedPrompt: "\u53ef\u590d\u5236\u63d0\u793a\u8bcd",
  randomize: "\u968f\u673a\u751f\u6210",
  reset: "\u91cd\u7f6e",
  share: "\u5206\u4eab",
  linkCopied: "\u94fe\u63a5\u5df2\u590d\u5236",
  aiOptimize: "AI \u4f18\u5316",
  generating: "\u751f\u6210\u4e2d",
  copy: "\u590d\u5236",
  copied: "\u5df2\u590d\u5236",
  saveKey: "\u4fdd\u5b58 Key",
  keySaved: "\u5df2\u4fdd\u5b58\uff0c\u53ef\u518d\u6b21\u4f18\u5316",
  keywordPlaceholder:
    "\u4f8b\u5982\uff1a\u65e0\u4e3b\u706f\u3001\u5f27\u5f62\u95e8\u6d1e\u3001\u80e1\u6843\u6728\u3001\u9002\u5408\u5c0f\u6237\u578b",
};

const spaces = ["\u5ba2\u5385", "\u5367\u5ba4", "\u53a8\u623f", "\u9910\u5385", "\u4e66\u623f", "\u6d74\u5ba4", "\u7384\u5173"];
const styles = ["\u73b0\u4ee3\u6781\u7b80", "\u4f98\u5bc2\u98ce", "\u5976\u6cb9\u98ce", "\u4e2d\u53e4\u73b0\u4ee3", "\u5317\u6b27\u81ea\u7136", "\u8f7b\u5962\u9152\u5e97", "\u5de5\u4e1a loft"];
const moods = ["\u5b89\u9759\u9ad8\u7ea7", "\u660e\u4eae\u901a\u900f", "\u6e29\u6696\u677e\u5f1b", "\u620f\u5267\u5316\u5149\u5f71", "\u6e05\u723d\u514b\u5236", "\u827a\u672f\u611f\u5f3a"];
const palettes = ["\u7c73\u767d + \u80e1\u6843\u6728 + \u9ed1\u8272", "\u9f20\u5c3e\u8349\u7eff + \u77f3\u6750\u7070", "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb", "\u70ad\u9ed1 + \u9ec4\u94dc + \u6df1\u6728\u8272", "\u9676\u571f\u8272 + \u5976\u6cb9\u767d"];
const materials = ["\u5929\u7136\u6728\u76ae", "\u5fae\u6c34\u6ce5", "\u6d1e\u77f3", "\u4e9a\u9ebb\u7ec7\u7269", "\u62c9\u4e1d\u91d1\u5c5e", "\u85e4\u7f16", "\u78e8\u7802\u73bb\u7483"];
const budgets = ["\u7ecf\u6d4e\u9884\u7b97", "\u4e2d\u7b49\u9884\u7b97", "\u4e2d\u9ad8\u9884\u7b97", "\u9ad8\u7aef\u5b9a\u5236"];
const cameras = ["wide-angle editorial photography", "35mm interior photography", "architectural digest style", "straight-on balanced composition"];

const translations: Record<string, string> = {
  "\u5ba2\u5385": "living room",
  "\u5367\u5ba4": "bedroom",
  "\u53a8\u623f": "kitchen",
  "\u9910\u5385": "dining room",
  "\u4e66\u623f": "study room",
  "\u6d74\u5ba4": "bathroom",
  "\u7384\u5173": "entryway",
  "\u73b0\u4ee3\u6781\u7b80": "modern minimalist",
  "\u4f98\u5bc2\u98ce": "wabi-sabi",
  "\u5976\u6cb9\u98ce": "soft cream-style",
  "\u4e2d\u53e4\u73b0\u4ee3": "mid-century modern",
  "\u5317\u6b27\u81ea\u7136": "natural Scandinavian",
  "\u8f7b\u5962\u9152\u5e97": "quiet luxury hotel-inspired",
  "\u5de5\u4e1a loft": "industrial loft",
  "\u5b89\u9759\u9ad8\u7ea7": "quiet and elevated",
  "\u660e\u4eae\u901a\u900f": "bright and airy",
  "\u6e29\u6696\u677e\u5f1b": "warm and relaxed",
  "\u620f\u5267\u5316\u5149\u5f71": "dramatic light and shadow",
  "\u6e05\u723d\u514b\u5236": "fresh and restrained",
  "\u827a\u672f\u611f\u5f3a": "art-forward",
  "\u7c73\u767d + \u80e1\u6843\u6728 + \u9ed1\u8272": "warm ivory, walnut wood, and black",
  "\u9f20\u5c3e\u8349\u7eff + \u77f3\u6750\u7070": "sage green and stone gray",
  "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb": "warm white, oak, and linen",
  "\u70ad\u9ed1 + \u9ec4\u94dc + \u6df1\u6728\u8272": "charcoal black, brass, and dark wood",
  "\u9676\u571f\u8272 + \u5976\u6cb9\u767d": "terracotta and cream white",
  "\u5929\u7136\u6728\u76ae": "natural wood veneer",
  "\u5fae\u6c34\u6ce5": "microcement",
  "\u6d1e\u77f3": "travertine",
  "\u4e9a\u9ebb\u7ec7\u7269": "linen textiles",
  "\u62c9\u4e1d\u91d1\u5c5e": "brushed metal",
  "\u85e4\u7f16": "woven rattan",
  "\u78e8\u7802\u73bb\u7483": "frosted glass",
  "\u7ecf\u6d4e\u9884\u7b97": "budget-conscious",
  "\u4e2d\u7b49\u9884\u7b97": "mid-range budget",
  "\u4e2d\u9ad8\u9884\u7b97": "upper-mid-range budget",
  "\u9ad8\u7aef\u5b9a\u5236": "high-end custom budget",
  "\u5f27\u5f62\u5143\u7d20": "arched forms",
  "\u9690\u85cf\u6536\u7eb3": "hidden storage",
  "\u6e29\u6da6\u6728\u4f5c": "warm woodwork",
  "\u65e0\u4e3b\u706f": "ambient lighting without a central ceiling light",
  "\u5f00\u653e\u683c": "open shelving",
  "\u77f3\u6750\u80cc\u666f\u5899": "stone feature wall",
  "\u5f27\u5f62\u95e8\u6d1e": "arched doorway",
  "\u80e1\u6843\u6728": "walnut wood",
  "\u9002\u5408\u5c0f\u6237\u578b": "suitable for a compact apartment",
  "\u5e26\u6709": "featuring",
  "\u5f27\u5f62\u6c99\u53d1": "a curved sofa",
  "\u843d\u5730\u7a97": "floor-to-ceiling windows",
  "\u9690\u85cf\u5f0f\u706f\u5e26": "concealed linear lighting",
  "\u4f4e\u77ee\u8336\u51e0": "a low coffee table",
  "\u6a21\u5757\u5316\u6c99\u53d1": "a modular sofa",
  "\u827a\u672f\u6302\u753b": "art wall pieces",
  "\u67d4\u548c\u7a97\u5e18": "soft curtains",
  "\u6536\u7eb3\u6574\u5408": "integrated storage",
  "\u5e72\u51c0\u7ebf\u6761": "clean lines",
  "\u5f00\u653e\u5f0f\u5e03\u5c40": "an open-plan layout",
  "\u5c9b\u53f0": "a kitchen island",
  "\u9690\u85cf\u5f0f\u706f\u5149": "concealed lighting",
  "\u4f4e\u9971\u548c\u8f6f\u88c5": "low-saturation soft furnishings",
  "\u77f3\u6750\u53f0\u9762": "stone countertops",
  "\u5c40\u90e8\u91d1\u5c5e\u70b9\u7f00": "subtle metal accents",
  "\u5927\u9762\u79ef\u81ea\u7136\u91c7\u5149": "abundant natural light",
  "\u7eff\u690d": "green plants",
  "\u624b\u5de5\u8d28\u611f\u88c5\u9970": "handcrafted textured decor",
};

type PromptState = {
  space: string;
  style: string;
  mood: string;
  palette: string;
  budget: string;
  material: string;
  camera: string;
  detail: string;
  keywords: string;
};

const initialState: PromptState = {
  space: "\u5ba2\u5385",
  style: "\u73b0\u4ee3\u6781\u7b80",
  mood: "\u6e29\u6696\u677e\u5f1b",
  palette: "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb",
  budget: "\u4e2d\u9ad8\u9884\u7b97",
  material: "\u5929\u7136\u6728\u76ae",
  camera: "35mm interior photography",
  detail: "\u5e26\u6709\u5f27\u5f62\u6c99\u53d1\u3001\u843d\u5730\u7a97\u3001\u9690\u85cf\u5f0f\u706f\u5e26\u548c\u4f4e\u77ee\u8336\u51e0",
  keywords: "\u5f27\u5f62\u5143\u7d20, \u9690\u85cf\u6536\u7eb3, \u6e29\u6da6\u6728\u4f5c",
};

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function optionButton(active: boolean) {
  return active ? "chip chipActive" : "chip";
}

function translate(value: string) {
  if (translations[value]) return translations[value];

  return Object.entries(translations)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [source, target]) => text.replaceAll(source, target), value)
    .replace(/[，、]/g, ", ")
    .replace(/。/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function translateList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => translate(item))
    .join(", ");
}

function encodeShareState(state: PromptState) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

function decodeShareState(value: string): PromptState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(value)))) as Partial<PromptState>;
    return { ...initialState, ...parsed };
  } catch {
    return null;
  }
}

export default function Home() {
  const [state, setState] = useState<PromptState>(initialState);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const shareValue = new URLSearchParams(window.location.search).get("design");
    if (!shareValue) return;

    const sharedState = decodeShareState(shareValue);
    if (sharedState) {
      setState(sharedState);
    }
  }, []);

  const localPrompt = useMemo(() => {
    return [
      `A ${translate(state.style)} ${translate(state.space)} interior design concept, ${translate(state.mood)}, ${translateList(state.detail)}.`,
      `User keywords: ${translateList(state.keywords) || "none"}.`,
      `Use a ${translate(state.palette)} color palette with ${translate(state.material)}, layered textures, refined furniture proportions, realistic spatial depth, and tasteful styling.`,
      "Lighting: soft natural daylight mixed with subtle architectural lighting, clean shadows, premium residential atmosphere.",
      `Camera: ${state.camera}, eye-level perspective, professionally composed, magazine-quality photorealistic render.`,
      `Design constraints: ${translate(state.budget)}, practical circulation, no clutter, cohesive materials, no visible brand logos.`,
      "Negative prompt: low resolution, distorted furniture, warped walls, messy composition, overdecorated styling, fake plants overload, unreadable text, watermark, people.",
    ].join("\n");
  }, [state]);

  const prompt = aiPrompt || localPrompt;

  const updateState = (patch: Partial<PromptState>) => {
    setState((current) => ({ ...current, ...patch }));
    setAiPrompt("");
    setError("");
    setShared(false);
  };

  const randomize = () => {
    setState({
      space: pick(spaces),
      style: pick(styles),
      mood: pick(moods),
      palette: pick(palettes),
      budget: pick(budgets),
      material: pick(materials),
      camera: pick(cameras),
      detail: pick([
        "\u5e26\u6709\u6a21\u5757\u5316\u6c99\u53d1\u3001\u827a\u672f\u6302\u753b\u548c\u67d4\u548c\u7a97\u5e18",
        "\u5f3a\u8c03\u6536\u7eb3\u6574\u5408\u3001\u5e72\u51c0\u7ebf\u6761\u548c\u6e29\u6da6\u6728\u4f5c",
        "\u5305\u542b\u5f00\u653e\u5f0f\u5e03\u5c40\u3001\u5c9b\u53f0\u548c\u9690\u85cf\u5f0f\u706f\u5149",
        "\u642d\u914d\u4f4e\u9971\u548c\u8f6f\u88c5\u3001\u77f3\u6750\u53f0\u9762\u548c\u5c40\u90e8\u91d1\u5c5e\u70b9\u7f00",
        "\u5e26\u6709\u5927\u9762\u79ef\u81ea\u7136\u91c7\u5149\u3001\u7eff\u690d\u548c\u624b\u5de5\u8d28\u611f\u88c5\u9970",
      ]),
      keywords: pick([
        "\u5f27\u5f62\u5143\u7d20, \u9690\u85cf\u6536\u7eb3, \u6e29\u6da6\u6728\u4f5c",
        "\u65e0\u4e3b\u706f, \u5f00\u653e\u683c, \u77f3\u6750\u80cc\u666f\u5899",
        "\u4eb2\u5b50\u53cb\u597d, \u8010\u810f\u6750\u8d28, \u8f6f\u5305\u8fb9\u89d2",
        "\u827a\u672f\u6302\u753b, \u4f4e\u9971\u548c, \u624b\u5de5\u9676\u5668",
        "\u667a\u80fd\u706f\u5149, \u6a21\u5757\u5316\u5bb6\u5177, \u6781\u7b80\u7ebf\u6761",
      ]),
    });
    setCopied(false);
    setShared(false);
    setAiPrompt("");
    setError("");
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareDesign = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("design", encodeShareState(state));
    window.history.replaceState(null, "", url.toString());
    await navigator.clipboard.writeText(url.toString());
    setShared(true);
    window.setTimeout(() => setShared(false), 2200);
  };

  const generateWithAi = async () => {
    setIsGenerating(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const data = (await response.json()) as { prompt?: string; error?: string };
      if (!response.ok || !data.prompt) {
        throw new Error(data.error || "AI prompt generation failed.");
      }

      setAiPrompt(data.prompt);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI prompt generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveApiKey = async () => {
    setIsSavingKey(true);
    setError("");
    setKeySaved(false);

    try {
      const response = await fetch("/api/openai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model: "gpt-5.4-mini" }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to save API key.");
      }
      setApiKey("");
      setKeySaved(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save API key.");
    } finally {
      setIsSavingKey(false);
    }
  };

  return (
    <main className="shell">
      <section className="hero" aria-label="AI interior design prompt generator">
        <div className="heroImage" />
        <div className="heroShade" />
        <div className="heroContent">
          <div className="brand">
            <Sparkles size={18} aria-hidden="true" />
            AI Interior Prompt Studio
          </div>
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </div>
      </section>

      <section className="workspace">
        <form className="panel controls">
          <ControlGroup label={labels.space}>
            {spaces.map((space) => (
              <button className={optionButton(state.space === space)} key={space} onClick={(event) => {
                event.preventDefault();
                updateState({ space });
              }}>
                {space}
              </button>
            ))}
          </ControlGroup>

          <ControlGroup label={labels.style}>
            {styles.map((style) => (
              <button className={optionButton(state.style === style)} key={style} onClick={(event) => {
                event.preventDefault();
                updateState({ style });
              }}>
                {style}
              </button>
            ))}
          </ControlGroup>

          <ControlGroup label={labels.mood}>
            {moods.map((mood) => (
              <button className={optionButton(state.mood === mood)} key={mood} onClick={(event) => {
                event.preventDefault();
                updateState({ mood });
              }}>
                {mood}
              </button>
            ))}
          </ControlGroup>

          <label className="field">
            <span>{labels.palette}</span>
            <select value={state.palette} onChange={(event) => updateState({ palette: event.target.value })}>
              {palettes.map((palette) => (
                <option key={palette}>{palette}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{labels.material}</span>
            <select value={state.material} onChange={(event) => updateState({ material: event.target.value })}>
              {materials.map((material) => (
                <option key={material}>{material}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{labels.budget}</span>
            <select value={state.budget} onChange={(event) => updateState({ budget: event.target.value })}>
              {budgets.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </label>

          <label className="field wide">
            <span>{labels.detail}</span>
            <textarea value={state.detail} onChange={(event) => updateState({ detail: event.target.value })} />
          </label>

          <label className="field wide">
            <span>{labels.keywords}</span>
            <textarea
              className="keywordsInput"
              value={state.keywords}
              onChange={(event) => updateState({ keywords: event.target.value })}
              placeholder={labels.keywordPlaceholder}
            />
          </label>
        </form>

        <aside className="panel output">
          <div className="outputTop">
            <div>
              <span className="eyebrow">Generated Prompt</span>
              <h2>{labels.generatedPrompt}</h2>
            </div>
            <div className="actions">
              <button className="iconButton" onClick={randomize} aria-label={labels.randomize} title={labels.randomize}>
                <Dice5 size={18} />
              </button>
              <button className="iconButton" onClick={() => updateState(initialState)} aria-label={labels.reset} title={labels.reset}>
                <RotateCcw size={18} />
              </button>
              <button className="shareButton" onClick={shareDesign}>
                <Share2 size={18} />
                {shared ? labels.linkCopied : labels.share}
              </button>
              <button className="aiButton" onClick={generateWithAi} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
                {isGenerating ? labels.generating : labels.aiOptimize}
              </button>
              <button className="copyButton" onClick={copyPrompt}>
                <Copy size={18} />
                {copied ? labels.copied : labels.copy}
              </button>
            </div>
          </div>
          {error ? <p className="errorText">{error}</p> : null}
          {error.includes("OPENAI_API_KEY") || keySaved ? (
            <div className="keyBox">
              <label className="field">
                <span>OpenAI API Key</span>
                <input
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="sk-..."
                  type="password"
                />
              </label>
              <button className="saveKeyButton" onClick={saveApiKey} disabled={isSavingKey || apiKey.length < 20}>
                {isSavingKey ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
                {keySaved ? labels.keySaved : labels.saveKey}
              </button>
            </div>
          ) : null}
          <pre>{prompt}</pre>
        </aside>
      </section>
    </main>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="group">
      <legend>{label}</legend>
      <div className="chips">{children}</div>
    </fieldset>
  );
}
