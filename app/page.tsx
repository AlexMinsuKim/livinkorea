"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadApiKey, loadPlaces, saveApiKey } from "@/lib/storage";
import { Place, RecommendationResult } from "@/lib/types";

const INTEREST_OPTIONS = [
  "food",
  "cafe",
  "local culture",
  "nightlife",
  "shopping",
  "nature",
  "walk",
  "photo spots"
];

export default function HomePage() {
  const [apiKey, setApiKey] = useState("");
  const [area, setArea] = useState("Seoul");
  const [constraints, setConstraints] = useState("");
  const [language, setLanguage] = useState<"en" | "ko">("en");
  const [interests, setInterests] = useState<string[]>(["food", "walk"]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setApiKey(loadApiKey());
    setPlaces(loadPlaces());
  }, []);

  const areaCandidates = useMemo(
    () => places.filter((p) => p.area.toLowerCase().includes(area.toLowerCase())),
    [area, places]
  );

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  }

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
          interests,
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

  return (
    <main className="container grid">
      <div className="header">
        <div>
          <h1>LivinKorea Local Trip Planner</h1>
          <p className="small">Local-first travel picks for foreign visitors in Korea.</p>
        </div>
        <nav className="top-nav">
          <Link href="/">Traveler</Link>
          <Link href="/host">Host Admin</Link>
        </nav>
      </div>

      <section className="card grid">
        <h2 className="section-title">Trip Inputs</h2>
        <div className="input-grid">
          <label>
            Area
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Seoul" />
          </label>
          <label>
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value as "en" | "ko") }>
              <option value="en">English</option>
              <option value="ko">한국어</option>
            </select>
          </label>
          <label>
            Gemini API Key
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
            />
          </label>
        </div>

        <button className="btn-secondary" onClick={() => saveApiKey(apiKey)}>
          Save on this device
        </button>

        <label>
          Constraints
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Budget, walking limit, dietary needs, preferred time, etc."
          />
        </label>

        <div>
          <p className="small" style={{ marginBottom: 8 }}>
            Interests
          </p>
          <div className="tag-list">
            {INTEREST_OPTIONS.map((tag) => (
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
        </div>

        <div className="small">Candidates loaded: {places.length} (Area match: {areaCandidates.length})</div>

        <button className="btn-primary" onClick={generateRecommendation} disabled={loading}>
          {loading ? "Generating..." : "Get local recommendations"}
        </button>
      </section>

      {error && <div className="error">{error}</div>}

      {result && (
        <section className="grid">
          <div className="card grid">
            <h2 className="section-title">Recommended places</h2>
            <p className="small">{result.summary}</p>
            <div className="grid">
              {result.places.map((p) => (
                <article key={p.id} className="card place-card">
                  <h3>{p.name}</h3>
                  <p>{p.reason}</p>
                  <p className="small">Best time: {p.best_time}</p>
                  <p className="small">Tips: {p.tips}</p>
                  <a href={p.map_link} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="card grid">
            <h2 className="section-title">Half-day course</h2>
            <h3>{result.half_day_course.title}</h3>
            <div className="grid">
              {result.half_day_course.steps.map((step, idx) => (
                <div key={`${step.name}-${idx}`} className="course-step">
                  <strong>{idx + 1}. {step.name}</strong>
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
