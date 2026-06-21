import { NextResponse } from "next/server";

type LocalTranslateRequest = {
  text?: string;
  source?: string;
  target?: string;
};

export async function POST(request: Request) {
  const apiUrl = process.env.TRANSLATE_API_URL;
  const apiSecret = process.env.TRANSLATE_API_SECRET;

  if (!apiUrl || !apiSecret) {
    return NextResponse.json(
      { error: "TRANSLATE_API_URL or TRANSLATE_API_SECRET is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as LocalTranslateRequest;
  const text = (body.text || "").trim();

  if (!text) {
    return NextResponse.json({ translatedText: "" });
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Translate-Secret": apiSecret,
    },
    body: JSON.stringify({
      text,
      source: body.source || "zh",
      target: body.target || "en",
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    translatedText?: string;
    error?: string;
  };

  if (!response.ok || typeof data.translatedText !== "string") {
    return NextResponse.json(
      { error: data.error || "Local translation failed." },
      { status: response.status || 502 }
    );
  }

  return NextResponse.json({ translatedText: data.translatedText.trim() });
}
