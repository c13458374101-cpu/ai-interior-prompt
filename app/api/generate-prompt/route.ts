import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAiConfig } from "../openai-config/config";

type PromptRequest = {
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
  const requiredFields: Array<keyof PromptRequest> = [
    "space",
    "style",
    "mood",
    "palette",
    "budget",
    "camera",
    "detail",
  ];

  const missing = requiredFields.filter((field) => !body[field]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const selectedMaterials = Array.isArray(body.materials) && body.materials.length > 0
    ? body.materials.join(", ")
    : body.material || "not specified";

  const response = await client.responses.create({
    model: config.model,
    input: [
      {
        role: "system",
        content:
          "You write precise, production-ready prompts for AI interior design image generation. Translate every Chinese selection, detail, and user keyword into natural English before writing. Return only the final prompt in English. Do not include any Chinese characters. Include composition, materials, lighting, camera, realism notes, practical design constraints, and a concise negative prompt.",
      },
      {
        role: "user",
        content: `Generate one high-quality interior design image prompt from these selections:
Space: ${body.space}
Style: ${body.style}
Mood: ${body.mood}
Lighting level: ${typeof body.lighting === "number" ? body.lighting : "balanced"}
Palette: ${body.palette}
Budget: ${body.budget}
Materials: ${selectedMaterials}
Render engine: ${body.engine || "not specified"}
Camera: ${body.camera}
Key details: ${body.detail}
User keywords: ${body.keywords || "none"}`,
      },
    ],
  });

  let prompt = response.output_text.trim();

  if (containsChinese(prompt)) {
    const rewrite = await client.responses.create({
      model: config.model,
      input: [
        {
          role: "system",
          content:
            "Rewrite the provided interior design image prompt into fluent English only. Translate all Chinese text. Return only the rewritten prompt. Do not include any Chinese characters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    prompt = rewrite.output_text.trim();
  }

  return NextResponse.json({
    prompt,
  });
}
