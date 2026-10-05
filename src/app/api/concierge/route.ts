import { NextResponse } from "next/server";
import { fragrances } from "@/lib/catalog";

function localRecommendation(prompt: string) {
  const query = prompt.toLowerCase();
  const product = fragrances.find((fragrance) =>
    `${fragrance.mood} ${fragrance.family} ${fragrance.notes.join(" ")} ${fragrance.name}`
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((word) => word.length > 3)
      .some((word) => query.includes(word)),
  ) ?? fragrances.find((fragrance) =>
    (query.includes("fresh") || query.includes("clean") || query.includes("light"))
      ? fragrance.mood.includes("Fresh")
      : query.includes("warm") || query.includes("deep") || query.includes("night")
        ? fragrance.mood.includes("Warm") || fragrance.mood.includes("Deep")
        : fragrance.mood.includes("Soft"),
  ) ?? fragrances[0];

  return `Start with ${product.name}. ${product.description} Its character comes through in ${product.notes.join(", ")}. You can explore it in 30, 50 or 100 ml.`;
}

export async function POST(request: Request) {
  let prompt: unknown;
  try {
    ({ prompt } = (await request.json()) as { prompt?: unknown });
  } catch {
    return NextResponse.json({ message: "Tell us a little about what you like." }, { status: 400 });
  }

  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 400) {
    return NextResponse.json({ message: "Please keep your note under 400 characters." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: `You are the Seven Scents fragrance concierge. Give one warm, concise recommendation using only these products, notes and descriptions. Do not invent ingredients, longevity claims, prices, or stock. Keep it under 90 words. Catalog: ${fragrances.map((item) => `${item.name}: ${item.family}; mood ${item.mood}; notes ${item.notes.join(", ")}; ${item.description}`).join("\n")}` }],
            },
            { role: "user", content: [{ type: "input_text", text: prompt.trim() }] },
          ],
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (response.ok) {
        const result = (await response.json()) as { output_text?: string };
        if (result.output_text?.trim()) return NextResponse.json({ message: result.output_text.trim() });
      }
    } catch {
      // Fall through to a catalog-based recommendation if the model is unavailable.
    }
  }

  return NextResponse.json({ message: localRecommendation(prompt.trim()), mode: "catalog-fallback" });
}