import { readFile } from "node:fs/promises";
import path from "node:path";

export async function getOpenAiConfig() {
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    };
  }

  try {
    const file = await readFile(path.join(process.cwd(), ".env.local"), "utf8");
    const apiKey = file.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
    const model = file.match(/^OPENAI_MODEL=(.+)$/m)?.[1]?.trim();

    if (apiKey) {
      process.env.OPENAI_API_KEY = apiKey;
      process.env.OPENAI_MODEL = model || "gpt-5.4-mini";
      return {
        apiKey,
        model: process.env.OPENAI_MODEL,
      };
    }
  } catch {
  }

  return {
    apiKey: "",
    model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
  };
}
