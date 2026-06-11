import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAiConfig } from "../openai-config/config";

type PromptTask = "generate" | "sync-language" | "optimize";
type PromptLanguage = "english" | "chinese";

type PromptRequest = {
  task?: PromptTask;
  sourceLanguage?: PromptLanguage;
  targetLanguage?: PromptLanguage;
  sourceText?: string;
  negativePrompt?: string;
  scheme?: string;
  space: string;
  style: string;
  mood: string;
  lighting: number;
  palette: string;
  budget: string;
  materials: string[];
  material?: string;
  engine: string;
  camera: string;
  detail: string;
  keywords: string;
};

function containsChinese(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function getSelectedMaterials(body: Partial<PromptRequest>) {
  return Array.isArray(body.materials) && body.materials.length > 0
    ? body.materials.join(", ")
    : body.material || "not specified";
}

function languageLabel(language: PromptLanguage | undefined) {
  return language === "chinese" ? "Chinese" : "English";
}

async function createResponse(client: OpenAI, model: string, system: string, user: string) {
  const response = await client.responses.create({
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.output_text.trim();
}

export async function POST(request: Request) {
  const config = await getOpenAiConfig();

  if (!config.apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const client = new OpenAI({
    apiKey: config.apiKey,
  });

  const body = (await request.json()) as Partial<PromptRequest>;
  const task = body.task || "generate";

  if (task === "sync-language") {
    if (!body.sourceText || !body.targetLanguage) {
      return NextResponse.json(
        { error: "Missing sourceText or targetLanguage." },
        { status: 400 }
      );
    }

    const target = languageLabel(body.targetLanguage);
    const prompt = await createResponse(
      client,
      config.model,
      [
        "You translate and rewrite interior design image prompts.",
        "Preserve spatial structure, rendering terms, camera details, model parameters, and negative prompt meaning.",
        `Return only the rewritten ${target} text.`,
        body.targetLanguage === "english"
          ? "Do not include Chinese characters unless they are part of a requested on-image annotation."
          : "Use natural professional Chinese. Keep useful English rendering terms when they are standard industry terms.",
      ].join(" "),
      body.sourceText
    );

    return NextResponse.json({ prompt });
  }

  const requiredFields: Array<keyof PromptRequest> = [
    "space",
    "style",
    "mood",
    "palette",
    "budget",
    "camera",
  ];

  const missing = requiredFields.filter((field) => !body[field]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const selectedMaterials = getSelectedMaterials(body);

  if (task === "optimize") {
    if (!body.sourceText || !body.targetLanguage) {
      return NextResponse.json(
        { error: "Missing sourceText or targetLanguage." },
        { status: 400 }
      );
    }

    const target = body.targetLanguage;
    const paired = target === "english" ? "Chinese" : "English";
    const optimized = await createResponse(
      client,
      config.model,
      [
        "You are a senior interior design prompt engineer.",
        "Improve the user's prompt for AI image generation while preserving the selected scheme type and user intent.",
        target === "english"
          ? "Return only one polished English prompt. Translate Chinese content into natural English."
          : "Return only one polished Chinese prompt, written for professional interior design image generation.",
        "Keep practical spatial constraints, composition, materials, lighting, camera, realism notes, and image-model friendly wording.",
      ].join(" "),
      `Selected scheme: ${body.scheme || "not specified"}
Space: ${body.space}
Style: ${body.style}
Mood: ${body.mood}
Lighting level: ${typeof body.lighting === "number" ? body.lighting : "balanced"}
Palette: ${body.palette}
Budget: ${body.budget}
Materials: ${selectedMaterials}
Render engine: ${body.engine || "not specified"}
Camera: ${body.camera}
Key details: ${body.detail || "not specified"}
User keywords: ${body.keywords || "not specified"}
Current prompt:
${body.sourceText}`
    );

    const pairedPrompt = await createResponse(
      client,
      config.model,
      [
        "Translate and adapt this interior design image prompt.",
        `Return only the ${paired} version.`,
        paired === "English"
          ? "Use fluent English and do not include Chinese characters unless they are required as on-image annotations."
          : "Use natural professional Chinese while preserving standard rendering terms where useful.",
      ].join(" "),
      optimized
    );

    const negativePrompt = await createResponse(
      client,
      config.model,
      [
        "Write a concise bilingual negative prompt for an interior design image model.",
        "Return one paragraph containing English terms followed by Chinese terms.",
        "Include issues such as bad materials, overexposure, chaotic layout, cramped space, object deformation, low resolution, cartoon or illustration style, oversaturated colors, blown highlights, garbled text, watermark, and people when relevant.",
      ].join(" "),
      `Scheme: ${body.scheme || "not specified"}
Current negative prompt:
${body.negativePrompt || "not specified"}
Main prompt:
${optimized}`
    );

    return NextResponse.json({
      prompt: optimized,
      pairedPrompt,
      negativePrompt,
    });
  }

  let prompt = await createResponse(
    client,
    config.model,
    "You write precise, production-ready prompts for AI interior design image generation. Translate every Chinese selection, detail, and user keyword into natural English before writing. Return only the final prompt in English. Do not include any Chinese characters. Include composition, materials, lighting, camera, realism notes, practical design constraints, and a concise negative prompt.",
    `Generate one high-quality interior design image prompt from these selections:
Scheme: ${body.scheme || "not specified"}
Space: ${body.space}
Style: ${body.style}
Mood: ${body.mood}
Lighting level: ${typeof body.lighting === "number" ? body.lighting : "balanced"}
Palette: ${body.palette}
Budget: ${body.budget}
Materials: ${selectedMaterials}
Render engine: ${body.engine || "not specified"}
Camera: ${body.camera}
Key details: ${body.detail || "not specified"}
User keywords: ${body.keywords || "none"}`
  );

  if (containsChinese(prompt)) {
    prompt = await createResponse(
      client,
      config.model,
      "Rewrite the provided interior design image prompt into fluent English only. Translate all Chinese text. Return only the rewritten prompt. Do not include any Chinese characters.",
      prompt
    );
  }

  return NextResponse.json({
    prompt,
  });
}
