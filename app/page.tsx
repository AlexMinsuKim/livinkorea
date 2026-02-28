"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadApiKey, loadPlaceComments, loadPlaces, saveApiKey, savePlaceComments } from "@/lib/storage";
import { Place, PlaceComment, RecommendationResult } from "@/lib/types";

const INTEREST_OPTIONS: Record<"en" | "ko", string[]> = {
  en: [
    "Food alleys",
    "Cafes",
    "Local culture",
    "Traditional markets",
    "Nightlife",
    "Shopping",
    "Nature",
    "Walking routes",
    "Photo spots",
    "Art & exhibitions",
    "History",
    "Family-friendly",
    "Wellness",
    "Hidden gems",
    "etc"
  ],
  ko: [
    "맛집 골목",
    "카페",
    "로컬 문화",
    "전통시장",
    "야경/밤문화",
    "쇼핑",
    "자연",
    "산책 코스",
    "사진 명소",
    "전시/아트",
    "역사",
    "가족 여행",
    "힐링/웰니스",
    "숨은 명소",
    "기타"
  ]
};

const TRIP_INPUT_PROMPTS: Record<"en" | "ko", string[]> = {
  en: [
    "Where in Korea would you love to wander next?",
    "What kind of Korean local vibe are you hoping to enjoy today?",
    "Tell us the Korean neighborhood mood you want to feel.",
    "Which corner of Korea should we shape into your perfect local day?",
    "What local Korea story do you want your trip to begin with?"
  ],
  ko: [
    "한국의 어느 곳을 가고 싶으세요?",
    "어떤 느낌의 한국 로컬을 즐기고 싶으세요?",
    "오늘은 어떤 한국 동네의 분위기를 느끼고 싶으세요?",
    "당신만의 한국 로컬 하루, 어디서 시작하고 싶으세요?",
    "어떤 한국의 골목과 풍경을 여행하고 싶으세요?"
  ]
};

const COPY = {
  en: {
    heroKicker: "LivinKorea Travel Planner",
    heroTitle: "Discover Korea the Korean way.",
    heroSubtitle: "Local places recommended by local people",
    heroDesc: "We prioritize host-saved places first, and naturally provide general travel ideas when needed.",
    traveler: "Traveler",
    hostAdmin: "Host Admin",
    registeredPlaces: "Registered places",
    matchingCandidates: "Matching area candidates",
    selectedInterests: "Selected interests",
    languageLabel: "Language",
    area: "Area",
    apiKey: "Gemini API Key",
    saveDevice: "Save on this device",
    constraints: "Trip preferences",
    constraintsPlaceholder: "Budget, walking limit, dietary needs, preferred time, etc.",
    interests: "Interests",
    customInterest: "Custom interest (for etc)",
    customInterestPlaceholder: "Tell us your style in your own words",
    loading: "Generating...",
    generate: "Get local recommendations",
    resultPlaces: "Recommended places",
    resultFallback: "Not enough matching host places, so we prepared a general Korea travel guide.",
    bestTime: "Best time",
    tips: "Tips",
    openMaps: "Open in Google Maps",
    mapGuide: "After checking each recommendation, open Google Maps to navigate right away.",
    halfDay: "Half-day course",
    comments: "Traveler comments",
    leaveComment: "Leave your review",
    nickname: "Nickname",
    rating: "Rating",
    commentPlaceholder: "Share your real experience and tips for this place.",
    submitComment: "Post comment",
    noComments: "No comments yet. Be the first traveler to share feedback!",
    areaPlaceholder: "e.g. Seoul, Busan, Jeonju",
    planCardTitle: "Plan your local day",
    languageEnglish: "English",
    languageKorean: "Korean"
  },
  ko: {
    heroKicker: "리빙코리아 여행 플래너",
    heroTitle: "한국을 한국답게 즐겨보세요!",
    heroSubtitle: "로컬 피플이 추천해주는 로컬 플레이스",
    heroDesc: "호스트가 저장한 장소를 우선 사용하고, 부족하면 일반 여행 가이드를 자연스럽게 안내해요.",
    traveler: "여행자",
    hostAdmin: "호스트 관리자",
    registeredPlaces: "등록된 장소",
    matchingCandidates: "지역 일치 후보",
    selectedInterests: "선택한 취향",
    languageLabel: "언어",
    area: "지역",
    apiKey: "Gemini API 키",
    saveDevice: "이 기기에 저장",
    constraints: "여행 조건",
    constraintsPlaceholder: "예산, 도보 이동 한계, 식단, 선호 시간대 등을 입력해 주세요.",
    interests: "취향 선택",
    customInterest: "직접 입력 (기타)",
    customInterestPlaceholder: "원하는 로컬 여행 취향을 자유롭게 적어주세요",
    loading: "생성 중...",
    generate: "로컬 추천 받기",
    resultPlaces: "추천 장소",
    resultFallback: "호스트 DB에 맞는 장소가 부족해 일반 한국 여행 가이드를 제공해요.",
    bestTime: "추천 시간",
    tips: "팁",
    openMaps: "Google 지도에서 보기",
    mapGuide: "추천 장소를 확인한 뒤 Google 지도로 바로 이동해 동선을 이어가세요.",
    halfDay: "반나절 코스",
    comments: "다녀온 사람들 코멘트",
    leaveComment: "코멘트 남기기",
    nickname: "닉네임",
    rating: "평점",
    commentPlaceholder: "직접 다녀온 후기와 팁을 남겨주세요.",
    submitComment: "댓글 등록",
    noComments: "아직 댓글이 없어요. 첫 후기를 남겨보세요!",
    areaPlaceholder: "예: 서울, 부산, 전주",
    planCardTitle: "로컬 여행 플랜 만들기",
    languageEnglish: "English",
    languageKorean: "한국어"
  }
} as const;

export default function HomePage() {
  const [apiKey, setApiKey] = useState("");
  const [area, setArea] = useState("Seoul");
  const [constraints, setConstraints] = useState("");
  const [language, setLanguage] = useState<"en" | "ko">("en");
  const [interests, setInterests] = useState<string[]>([INTEREST_OPTIONS.en[0], INTEREST_OPTIONS.en[7]]);
  const [customInterest, setCustomInterest] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [comments, setComments] = useState<PlaceComment[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, { author: string; rating: 1 | 2 | 3 | 4 | 5; content: string }>>({});
  const [error, setError] = useState<string>("");
  const [promptSeed, setPromptSeed] = useState(0);

  useEffect(() => {
    setApiKey(loadApiKey());
    setPlaces(loadPlaces());
    setComments(loadPlaceComments());
    setPromptSeed(Math.floor(Math.random() * 1000));
  }, []);

  function upsertDraft(placeId: string, patch: Partial<{ author: string; rating: 1 | 2 | 3 | 4 | 5; content: string }>) {
    setCommentDrafts((prev) => ({
      ...prev,
      [placeId]: {
        author: prev[placeId]?.author ?? "",
        rating: prev[placeId]?.rating ?? 5,
        content: prev[placeId]?.content ?? "",
        ...patch
      }
    }));
  }

  function submitComment(placeId: string) {
    const draft = commentDrafts[placeId];
    if (!draft || !draft.content.trim()) return;

    const nextComment: PlaceComment = {
      id: `comment-${Date.now()}`,
      placeId,
      author: draft.author.trim() || (language === "ko" ? "익명 여행자" : "Anonymous traveler"),
      rating: draft.rating,
      content: draft.content.trim(),
      createdAt: new Date().toISOString()
    };

    const next = [nextComment, ...comments];
    setComments(next);
    savePlaceComments(next);
    upsertDraft(placeId, { content: "", rating: 5 });
  }

  const areaCandidates = useMemo(
    () => places.filter((p) => p.area.toLowerCase().includes(area.toLowerCase())),
    [area, places]
  );

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  }

  useEffect(() => {
    setInterests([]);
    setCustomInterest("");
  }, [language]);

  async function generateRecommendation() {
    setError("");
    setResult(null);

    if (!apiKey.trim()) {
      setError("Please add your Gemini API key first.");
      return;
    }

    if (places.length === 0) {
      setError("No places available. Add places on /host first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userApiKey: apiKey,
          area,
          interests: [...interests, customInterest.trim()].filter(Boolean),
          constraints,
          language,
          candidates: places
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate recommendation.");
        return;
      }
      setResult(data.result as RecommendationResult);
    } catch (e) {
      setError(`Unexpected error: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  const t = COPY[language];
  const tripPrompt = TRIP_INPUT_PROMPTS[language][promptSeed % TRIP_INPUT_PROMPTS[language].length];

  return (
    <main className="container grid">
      <div className="hero card grid">
        <div className="header">
          <div>
            <p className="hero-kicker">{t.heroKicker}</p>
            <h1>{t.heroTitle}</h1>
            <h2 className="section-title" style={{ marginTop: 2 }}>{t.heroSubtitle}</h2>
            <p className="small">{t.heroDesc}</p>
          </div>
          <div className="hero-actions">
            <div className="language-switch" role="group" aria-label={t.languageLabel}>
              <button
                type="button"
                className={`lang-btn ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                {t.languageEnglish}
              </button>
              <button
                type="button"
                className={`lang-btn ${language === "ko" ? "active" : ""}`}
                onClick={() => setLanguage("ko")}
              >
                {t.languageKorean}
              </button>
            </div>
            <nav className="top-nav">
              <Link href="/">{t.traveler}</Link>
              <Link href="/host">{t.hostAdmin}</Link>
            </nav>
          </div>
        </div>

        <section className="info-strip">
          <div>
            <strong>{places.length}</strong>
            <span>{t.registeredPlaces}</span>
          </div>
          <div>
            <strong>{areaCandidates.length}</strong>
            <span>{t.matchingCandidates}</span>
          </div>
          <div>
            <strong>{interests.length + (customInterest.trim() ? 1 : 0)}</strong>
            <span>{t.selectedInterests}</span>
          </div>
        </section>
      </div>

      <section className="card grid planner-card">
        <div className="planner-head">
          <p className="hero-kicker">{t.planCardTitle}</p>
          <h2 className="trip-prompt">{tripPrompt}</h2>
        </div>

        <div className="input-grid">
          <label>
            {t.area}
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder={t.areaPlaceholder} />
          </label>
          <label>
            {t.apiKey}
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
            />
          </label>
        </div>

        <div className="action-row">
          <button className="btn-secondary" onClick={() => saveApiKey(apiKey)}>
            {t.saveDevice}
          </button>
          <button className="btn-primary" onClick={generateRecommendation} disabled={loading}>
            {loading ? t.loading : t.generate}
          </button>
        </div>

        <label>
          {t.constraints}
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder={t.constraintsPlaceholder}
          />
        </label>

        <div>
          <p className="small" style={{ marginBottom: 8 }}>
            {t.interests}
          </p>
          <div className="tag-list">
            {INTEREST_OPTIONS[language].map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag ${interests.includes(tag) ? "active" : ""}`}
                onClick={() => toggleInterest(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <label style={{ marginTop: 12 }}>
            {t.customInterest}
            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder={t.customInterestPlaceholder}
            />
          </label>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      {result && (
        <section className="grid">
          <div className="card grid">
            <h2 className="section-title">{t.resultPlaces}</h2>
            {result.source === "general" && (
              <p className="notice">{t.resultFallback}</p>
            )}
            <p className="small">{result.summary}</p>
            <div className="grid">
              {result.places.map((p) => (
                <article key={p.id} className="card place-card">
                  <h3>{p.name}</h3>
                  <p>{p.reason}</p>
                  <p className="small">{t.bestTime}: {p.best_time}</p>
                  <p className="small">{t.tips}: {p.tips}</p>
                  <p className="small">{t.mapGuide}</p>
                  <a href={p.map_link} target="_blank" rel="noreferrer">
                    {t.openMaps}
                  </a>

                  <div className="comment-box grid">
                    <h4>{t.comments}</h4>
                    {(comments.filter((comment) => comment.placeId === p.id)).length === 0 && (
                      <p className="small">{t.noComments}</p>
                    )}
                    {comments
                      .filter((comment) => comment.placeId === p.id)
                      .slice(0, 5)
                      .map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <p>
                            <strong>{comment.author}</strong> · {"★".repeat(comment.rating)}
                          </p>
                          <p className="small">{comment.content}</p>
                        </div>
                      ))}

                    <div className="comment-form grid">
                      <h4>{t.leaveComment}</h4>
                      <div className="input-grid">
                        <label>
                          {t.nickname}
                          <input
                            value={commentDrafts[p.id]?.author ?? ""}
                            onChange={(e) => upsertDraft(p.id, { author: e.target.value })}
                          />
                        </label>
                        <label>
                          {t.rating}
                          <select
                            value={commentDrafts[p.id]?.rating ?? 5}
                            onChange={(e) => upsertDraft(p.id, { rating: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <textarea
                        placeholder={t.commentPlaceholder}
                        value={commentDrafts[p.id]?.content ?? ""}
                        onChange={(e) => upsertDraft(p.id, { content: e.target.value })}
                      />
                      <button type="button" className="btn-secondary" onClick={() => submitComment(p.id)}>
                        {t.submitComment}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="card grid">
            <h2 className="section-title">{t.halfDay}</h2>
            <h3>{result.half_day_course.title}</h3>
            <div className="grid">
              {result.half_day_course.steps.map((step, idx) => (
                <div key={`${step.name}-${idx}`} className="course-step">
                  <strong>
                    {idx + 1}. {step.name}
                  </strong>
                  <p>{step.why}</p>
                  <p className="small">ETA: {step.eta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
