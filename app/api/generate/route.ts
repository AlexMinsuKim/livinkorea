import { NextRequest, NextResponse } from "next/server";
import { Place, RecommendationResult } from "@/lib/types";

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

type GeneratePayload = {
  userApiKey?: string;
  area?: string;
  interests?: string[];
  constraints?: string;
  language?: "en" | "ko";
  candidates?: Place[];
};

function extractJsonText(raw: string): string {
  const fenced = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced) return fenced[1].trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return raw.slice(start, end + 1).trim();
  }
  return raw.trim();
}

function mapLinkFor(place: Place): string {
  const query = encodeURIComponent(place.mapQuery?.trim() || place.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GeneratePayload;

  if (!body.userApiKey?.trim()) {
    return NextResponse.json({ error: "Gemini API key is required." }, { status: 400 });
  }

  const candidates = (body.candidates || []).filter((c) => !!c.id && !!c.name);
  if (candidates.length === 0) {
    return NextResponse.json({ error: "Candidates are required." }, { status: 400 });
  }

  const schema = {
    summary: "string",
    places: [
      {
        id: "string(from candidate id)",
        name: "string(from candidate name)",
        reason: "string",
        best_time: "string",
        tips: "string"
      }
    ],
    half_day_course: {
      title: "string",
      steps: [{ name: "string", why: "string", eta: "string" }]
    }
  };

  const prompt = {
    instruction:
      "You are a strict planner. Use ONLY provided candidates. Never invent place names. Return STRICT JSON ONLY.",
    rules: [
      "Only recommend 5-8 places from candidates.",
      "Output must be valid JSON object. No markdown, no explanations.",
      "If language=en output in natural English, if language=ko output in Korean.",
      "Place name/id must exactly match candidate data."
    ],
    input: {
      area: body.area ?? "",
      interests: body.interests ?? [],
      constraints: body.constraints ?? "",
      language: body.language ?? "en",
      candidates
    },
    output_schema: schema
  };

  const geminiRes = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": body.userApiKey
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: JSON.stringify(prompt) }] }]
    })
  });

  if (!geminiRes.ok) {
    const txt = await geminiRes.text();
    return NextResponse.json({ error: `Gemini request failed (${geminiRes.status}): ${txt}` }, { status: 500 });
  }

  const geminiJson = (await geminiRes.json()) as any;
  const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonText = extractJsonText(rawText);

  let parsed: RecommendationResult;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      { error: `Failed to parse model JSON. Raw response:\n${rawText}` },
      { status: 500 }
    );
  }

  const byId = new Map(candidates.map((c) => [c.id, c]));
  const normalizedPlaces = (parsed.places || [])
    .filter((p) => byId.has(p.id))
    .slice(0, 8)
    .map((p) => {
      const candidate = byId.get(p.id)!;
      return {
        ...p,
        name: candidate.name,
        map_link: mapLinkFor(candidate)
      };
    });

  if (normalizedPlaces.length === 0) {
    return NextResponse.json(
      { error: `Model did not return valid candidate-based places. Raw response:\n${rawText}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    result: {
      summary: parsed.summary,
      places: normalizedPlaces,
      half_day_course: parsed.half_day_course
    }
  });
}
