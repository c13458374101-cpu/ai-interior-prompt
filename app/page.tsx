"use client";

import { Copy, Dice5, Loader2, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const spaces = ["客厅", "卧室", "厨房", "餐厅", "书房", "浴室", "玄关"];
const styles = ["现代极简", "侘寂风", "奶油风", "中古现代", "北欧自然", "轻奢酒店", "工业 loft"];
const moods = ["安静高级", "明亮通透", "温暖松弛", "戏剧化光影", "清爽克制", "艺术感强"];
const palettes = ["米白 + 胡桃木 + 黑色", "鼠尾草绿 + 石材灰", "暖白 + 橡木 + 亚麻", "炭黑 + 黄铜 + 深木色", "陶土色 + 奶油白"];
const materials = ["天然木皮", "微水泥", "洞石", "亚麻织物", "拉丝金属", "藤编", "磨砂玻璃"];
const budgets = ["经济预算", "中等预算", "中高预算", "高端定制"];
const cameras = ["wide-angle editorial photography", "35mm interior photography", "architectural digest style", "straight-on balanced composition"];

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
  space: "客厅",
  style: "现代极简",
  mood: "温暖松弛",
  palette: "暖白 + 橡木 + 亚麻",
  budget: "中高预算",
  material: "天然木皮",
  camera: "35mm interior photography",
  detail: "带有弧形沙发、落地窗、隐藏式灯带和低矮茶几",
  keywords: "弧形元素, 隐藏收纳, 温润木作",
};

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function optionButton(active: boolean) {
  return active ? "chip chipActive" : "chip";
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
      `A ${state.style} ${state.space} interior design concept, ${state.mood}, ${state.detail}.`,
      `User keywords: ${state.keywords || "none"}.`,
      `Use a ${state.palette} color palette with ${state.material}, layered textures, refined furniture proportions, realistic spatial depth, and tasteful styling.`,
      "Lighting: soft natural daylight mixed with subtle architectural lighting, clean shadows, premium residential atmosphere.",
      `Camera: ${state.camera}, eye-level perspective, professionally composed, magazine-quality photorealistic render.`,
      `Design constraints: ${state.budget}, practical circulation, no clutter, cohesive materials, no visible brand logos.`,
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
        "带有模块化沙发、艺术挂画和柔和窗帘",
        "强调收纳整合、干净线条和温润木作",
        "包含开放式布局、岛台和隐藏式灯光",
        "搭配低饱和软装、石材台面和局部金属点缀",
        "带有大面积自然采光、绿植和手工质感装饰",
      ]),
      keywords: pick([
        "弧形元素, 隐藏收纳, 温润木作",
        "无主灯, 开放格, 石材背景墙",
        "亲子友好, 耐脏材质, 软包边角",
        "艺术挂画, 低饱和, 手工陶器",
        "智能灯光, 模块化家具, 极简线条",
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
          <h1>室内设计 Prompt 生成器</h1>
          <p>选择空间、风格、材质、关键词和氛围，生成可分享的室内设计方案链接，并输出可直接用于图像模型的提示词。</p>
        </div>
      </section>

      <section className="workspace">
        <form className="panel controls">
          <ControlGroup label="空间">
            {spaces.map((space) => (
              <button className={optionButton(state.space === space)} key={space} onClick={(event) => {
                event.preventDefault();
                updateState({ space });
              }}>
                {space}
              </button>
            ))}
          </ControlGroup>

          <ControlGroup label="风格">
            {styles.map((style) => (
              <button className={optionButton(state.style === style)} key={style} onClick={(event) => {
                event.preventDefault();
                updateState({ style });
              }}>
                {style}
              </button>
            ))}
          </ControlGroup>

          <ControlGroup label="氛围">
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
            <span>配色</span>
            <select value={state.palette} onChange={(event) => updateState({ palette: event.target.value })}>
              {palettes.map((palette) => (
                <option key={palette}>{palette}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>主要材质</span>
            <select value={state.material} onChange={(event) => updateState({ material: event.target.value })}>
              {materials.map((material) => (
                <option key={material}>{material}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>预算定位</span>
            <select value={state.budget} onChange={(event) => updateState({ budget: event.target.value })}>
              {budgets.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </label>

          <label className="field wide">
            <span>关键细节</span>
            <textarea value={state.detail} onChange={(event) => updateState({ detail: event.target.value })} />
          </label>

          <label className="field wide">
            <span>关键词</span>
            <textarea
              className="keywordsInput"
              value={state.keywords}
              onChange={(event) => updateState({ keywords: event.target.value })}
              placeholder="例如：无主灯、弧形门洞、胡桃木、适合小户型"
            />
          </label>
        </form>

        <aside className="panel output">
          <div className="outputTop">
            <div>
              <span className="eyebrow">Generated Prompt</span>
              <h2>可复制提示词</h2>
            </div>
            <div className="actions">
              <button className="iconButton" onClick={randomize} aria-label="随机生成" title="随机生成">
                <Dice5 size={18} />
              </button>
              <button className="iconButton" onClick={() => updateState(initialState)} aria-label="重置" title="重置">
                <RotateCcw size={18} />
              </button>
              <button className="shareButton" onClick={shareDesign}>
                <Share2 size={18} />
                {shared ? "链接已复制" : "分享"}
              </button>
              <button className="aiButton" onClick={generateWithAi} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
                {isGenerating ? "生成中" : "AI 优化"}
              </button>
              <button className="copyButton" onClick={copyPrompt}>
                <Copy size={18} />
                {copied ? "已复制" : "复制"}
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
                {keySaved ? "已保存，可再次优化" : "保存 Key"}
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
