import { Place, PlaceComment } from "./types";

export const STORAGE_KEYS = {
  places: "livinkorea_places_v1",
  apiKey: "livinkorea_gemini_api_key_v1",
  comments: "livinkorea_place_comments_v1"
};

export const samplePlaces: Place[] = [
  {
    id: "seoul-gyeongbokgung",
    name: "Gyeongbokgung Palace",
    area: "Seoul",
    category: ["history", "landmark"],
    vibe: ["traditional", "cultural", "photo"],
    shortDesc: "Joseon-era royal palace with grand gates, changing of the guard, and museum access nearby.",
    tips: "Arrive before 10am for lighter crowds and hanbok photo opportunities.",
    mapQuery: "Gyeongbokgung Palace Seoul"
  },
  {
    id: "seoul-bukchon",
    name: "Bukchon Hanok Village",
    area: "Seoul",
    category: ["walk", "culture"],
    vibe: ["traditional", "quiet", "photo"],
    shortDesc: "Historic hanok neighborhood with scenic alleys and city views.",
    tips: "Please keep voices low because residents still live in the village.",
    mapQuery: "Bukchon Hanok Village Seoul"
  },
  {
    id: "seoul-myeongdong",
    name: "Myeongdong Street",
    area: "Seoul",
    category: ["shopping", "food"],
    vibe: ["busy", "street", "trendy"],
    shortDesc: "Popular shopping district full of cosmetics stores, street food, and flagship shops.",
    tips: "Best visited in late afternoon through evening for full street food lineup.",
    mapQuery: "Myeongdong Street Seoul"
  },
  {
    id: "seoul-nseoultower",
    name: "N Seoul Tower",
    area: "Seoul",
    category: ["landmark", "night"],
    vibe: ["romantic", "view", "iconic"],
    shortDesc: "Observatory tower offering panoramic skyline views of Seoul.",
    tips: "Sunset slots sell out quickly, so reserve tickets in advance during peak season.",
    mapQuery: "N Seoul Tower"
  },
  {
    id: "busan-haeundae",
    name: "Haeundae Beach",
    area: "Busan",
    category: ["nature", "beach"],
    vibe: ["relaxing", "scenic", "family"],
    shortDesc: "Korea's most famous urban beach with cafes, ocean walks, and festivals.",
    tips: "Visit early morning in summer to avoid heavy crowds.",
    mapQuery: "Haeundae Beach Busan"
  },
  {
    id: "busan-gamcheon",
    name: "Gamcheon Culture Village",
    area: "Busan",
    category: ["art", "walk"],
    vibe: ["colorful", "creative", "photo"],
    shortDesc: "Hillside village with bright murals, art installations, and winding lanes.",
    tips: "Wear comfortable shoes since there are many stairs and slopes.",
    mapQuery: "Gamcheon Culture Village Busan"
  },
  {
    id: "busan-jagalchi",
    name: "Jagalchi Market",
    area: "Busan",
    category: ["market", "food"],
    vibe: ["local", "lively", "seafood"],
    shortDesc: "Large seafood market where you can pick fresh catches and eat upstairs.",
    tips: "Ask for current market price before ordering sashimi sets.",
    mapQuery: "Jagalchi Market Busan"
  },
  {
    id: "jeju-seongsan",
    name: "Seongsan Ilchulbong",
    area: "Jeju",
    category: ["nature", "hiking"],
    vibe: ["sunrise", "scenic", "outdoor"],
    shortDesc: "UNESCO volcanic tuff cone with one of Korea's best sunrise views.",
    tips: "Bring windproof outerwear, especially in shoulder seasons.",
    mapQuery: "Seongsan Ilchulbong Jeju"
  },
  {
    id: "jeju-seopjikoji",
    name: "Seopjikoji",
    area: "Jeju",
    category: ["coast", "walk"],
    vibe: ["romantic", "windy", "photo"],
    shortDesc: "Coastal cape with dramatic ocean cliffs and seasonal canola fields.",
    tips: "Late afternoon offers softer light for photos.",
    mapQuery: "Seopjikoji Jeju"
  },
  {
    id: "gyeongju-bulguksa",
    name: "Bulguksa Temple",
    area: "Gyeongju",
    category: ["history", "temple"],
    vibe: ["peaceful", "spiritual", "heritage"],
    shortDesc: "Iconic Silla-era Buddhist temple and UNESCO World Heritage site.",
    tips: "Combine with nearby Seokguram Grotto for a full heritage day.",
    mapQuery: "Bulguksa Temple Gyeongju"
  },
  {
    id: "gyeongju-daereungwon",
    name: "Daereungwon Tomb Complex",
    area: "Gyeongju",
    category: ["history", "walk"],
    vibe: ["open", "green", "heritage"],
    shortDesc: "Royal tomb park with grassy burial mounds from the Silla kingdom.",
    tips: "Rent a bike nearby to explore the wider historical district.",
    mapQuery: "Daereungwon Tomb Complex Gyeongju"
  },
  {
    id: "jeonju-hanok",
    name: "Jeonju Hanok Village",
    area: "Jeonju",
    category: ["culture", "food"],
    vibe: ["traditional", "local", "family"],
    shortDesc: "Large hanok district known for Korean traditional architecture and bibimbap spots.",
    tips: "Weekday mornings are best for quieter alley walks.",
    mapQuery: "Jeonju Hanok Village"
  },
  {
    id: "gangneung-anseongbeach",
    name: "Anmok Beach Coffee Street",
    area: "Gangneung",
    category: ["cafe", "beach"],
    vibe: ["relaxed", "scenic", "trendy"],
    shortDesc: "Beachfront road lined with specialty coffee shops and ocean-view terraces.",
    tips: "Try sunset hours for the best atmosphere and sea view.",
    mapQuery: "Anmok Beach Coffee Street Gangneung"
  },
  {
    id: "incheon-songdo",
    name: "Songdo Central Park",
    area: "Incheon",
    category: ["park", "walk"],
    vibe: ["modern", "urban", "family"],
    shortDesc: "Modern waterfront park with boat rides and skyline promenades.",
    tips: "Evening lights around the canal are excellent for photos.",
    mapQuery: "Songdo Central Park Incheon"
  },
  {
    id: "suwon-hwaseong",
    name: "Hwaseong Fortress",
    area: "Suwon",
    category: ["history", "walk"],
    vibe: ["heritage", "open", "city-view"],
    shortDesc: "UNESCO fortress walls circling old Suwon with scenic walking routes.",
    tips: "Allow at least 2-3 hours to complete major wall sections.",
    mapQuery: "Hwaseong Fortress Suwon"
  },
  {
    id: "andong-hahoe",
    name: "Hahoe Folk Village",
    area: "Andong",
    category: ["culture", "history"],
    vibe: ["traditional", "calm", "heritage"],
    shortDesc: "Preserved Joseon folk village offering authentic architecture and mask dance culture.",
    tips: "Check mask dance performance schedules before visiting.",
    mapQuery: "Hahoe Folk Village Andong"
  },
  {
    id: "gangwon-seoraksan",
    name: "Seoraksan National Park",
    area: "Sokcho",
    category: ["nature", "hiking"],
    vibe: ["mountain", "adventure", "seasonal"],
    shortDesc: "Major mountain park known for dramatic ridges, temples, and autumn foliage.",
    tips: "Start early for popular trails and monitor weather conditions.",
    mapQuery: "Seoraksan National Park"
  },
  {
    id: "seoul-lotteworldtower",
    name: "Lotte World Tower Seoul Sky",
    area: "Seoul",
    category: ["landmark", "view"],
    vibe: ["modern", "skyline", "iconic"],
    shortDesc: "High-rise observatory with sweeping city views and glass floor sections.",
    tips: "Book timed entry to avoid long queues on weekends.",
    mapQuery: "Lotte World Tower Seoul Sky"
  },
  {
    id: "jeju-hallasan",
    name: "Hallasan National Park",
    area: "Jeju",
    category: ["nature", "hiking"],
    vibe: ["outdoor", "majestic", "seasonal"],
    shortDesc: "Volcanic mountain park at the center of Jeju with well-managed hiking courses.",
    tips: "Trail entry can close early in winter; check official notice beforehand.",
    mapQuery: "Hallasan National Park"
  },
  {
    id: "daejeon-expo",
    name: "Expo Science Park",
    area: "Daejeon",
    category: ["family", "science"],
    vibe: ["educational", "interactive", "urban"],
    shortDesc: "Science-themed complex and riverfront area popular with families and students.",
    tips: "Pair with nearby Hanbat Arboretum for a balanced indoor-outdoor route.",
    mapQuery: "Expo Science Park Daejeon"
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

export function loadPlaceComments(): PlaceComment[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEYS.comments);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as PlaceComment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlaceComments(comments: PlaceComment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments));
}

export function loadApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEYS.apiKey) ?? "";
}

export function saveApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
}
