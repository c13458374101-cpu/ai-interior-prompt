import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAiConfig } from "../openai-config/config";

type PromptRequest = {
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
    "material",
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

  const response = await client.responses.create({
    model: config.model,
    input: [
      {
        role: "system",
        content:
          "You write precise, production-ready prompts for AI interior design image generation. Return only the final prompt in English. Include composition, materials, lighting, camera, realism notes, practical design constraints, and a concise negative prompt.",
      },
      {
        role: "user",
        content: `Generate one high-quality interior design image prompt from these selections:
Space: ${body.space}
Style: ${body.style}
Mood: ${body.mood}
Palette: ${body.palette}
Budget: ${body.budget}
Primary material: ${body.material}
Camera: ${body.camera}
Key details: ${body.detail}
User keywords: ${body.keywords || "none"}`,
      },
    ],
  });

  return NextResponse.json({
    prompt: response.output_text.trim(),
  });
}
