import { Place } from "./types";

export const STORAGE_KEYS = {
  places: "livinkorea_places_v1",
  apiKey: "livinkorea_gemini_api_key_v1"
};

export const samplePlaces: Place[] = [
  {
    id: "seoul-mangwon-market",
    name: "Mangwon Market",
    area: "Seoul",
    category: ["food", "market"],
    vibe: ["local", "casual", "budget"],
    shortDesc: "A neighborhood market with affordable Korean street food and side dishes.",
    tips: "Bring cash for small stalls and visit before 6pm for the busiest food section.",
    mapQuery: "Mangwon Market Seoul"
  },
  {
    id: "seoul-seongsu-alleys",
    name: "Seongsu Backstreet Cafes",
    area: "Seoul",
    category: ["cafe", "walk"],
    vibe: ["trendy", "creative", "photo"],
    shortDesc: "Industrial blocks converted into cafés, concept stores, and small galleries.",
    tips: "Weekday afternoons are less crowded. Some stores close early on Mondays.",
    mapQuery: "Seongsu-dong Seoul"
  },
  {
    id: "busan-bupyeong-kkangtong",
    name: "Bupyeong Kkangtong Night Market",
    area: "Busan",
    category: ["food", "night"],
    vibe: ["busy", "street", "late-night"],
    shortDesc: "Lively night market famous for fusion snacks and local crowd energy.",
    tips: "Expect lines after 8pm. Good to pair with nearby Gukje Market walk.",
    mapQuery: "Bupyeong Kkangtong Market Busan"
  }
];

export function loadPlaces(): Place[] {
  if (typeof window === "undefined") return samplePlaces;
  const raw = window.localStorage.getItem(STORAGE_KEYS.places);
  if (!raw) return samplePlaces;

  try {
    const parsed = JSON.parse(raw) as Place[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : samplePlaces;
  } catch {
    return samplePlaces;
  }
}

export function savePlaces(places: Place[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.places, JSON.stringify(places));
}

export function loadApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEYS.apiKey) ?? "";
}

export function saveApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
}
