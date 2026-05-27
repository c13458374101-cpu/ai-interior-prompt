import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const envPath = path.join(process.cwd(), ".env.local");

async function readLocalConfig() {
  try {
    const file = await readFile(envPath, "utf8");
    const apiKey = file.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
    const model = file.match(/^OPENAI_MODEL=(.+)$/m)?.[1]?.trim();
    return { apiKey, model };
  } catch {
    return { apiKey: undefined, model: undefined };
  }
}

export async function GET() {
  const localConfig = await readLocalConfig();
  return NextResponse.json({
    configured: Boolean(process.env.OPENAI_API_KEY || localConfig.apiKey),
    model: process.env.OPENAI_MODEL || localConfig.model || "gpt-5.4-mini",
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { apiKey?: string; model?: string };
  const apiKey = body.apiKey?.trim();
  const model = body.model?.trim() || "gpt-5.4-mini";

  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json(
      { error: "Please enter a valid OpenAI API key." },
      { status: 400 }
    );
  }

  await writeFile(
    envPath,
    `OPENAI_API_KEY=${apiKey}\nOPENAI_MODEL=${model}\n`,
    "utf8"
  );

  process.env.OPENAI_API_KEY = apiKey;
  process.env.OPENAI_MODEL = model;

  return NextResponse.json({ ok: true, configured: true, model });
}
