"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { loadPlaces, savePlaces } from "@/lib/storage";
import { Place } from "@/lib/types";

const HOST_PASSWORD = "2580";

const emptyForm: Omit<Place, "id"> = {
  name: "",
  area: "",
  category: [],
  vibe: [],
  shortDesc: "",
  tips: "",
  mapQuery: ""
};

function splitCsv(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function HostPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setPlaces(loadPlaces());
  }, []);

  function persist(next: Place[]) {
    setPlaces(next);
    savePlaces(next);
  }

  function unlockHost() {
    if (password === HOST_PASSWORD) {
      setUnlocked(true);
      setPasswordError("");
      return;
    }

    setPasswordError("비밀번호가 올바르지 않습니다.");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: Place = {
      id: editingId ?? `place-${Date.now()}`,
      ...form,
      category: form.category,
      vibe: form.vibe
    };

    if (editingId) {
      persist(places.map((p) => (p.id === editingId ? payload : p)));
    } else {
      persist([payload, ...places]);
    }

    setEditingId(null);
    setForm(emptyForm);
  }

  function edit(place: Place) {
    setEditingId(place.id);
    setForm({
      name: place.name,
      area: place.area,
      category: place.category,
      vibe: place.vibe,
      shortDesc: place.shortDesc,
      tips: place.tips ?? "",
      mapQuery: place.mapQuery ?? ""
    });
  }

  function remove(id: string) {
    persist(places.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="container grid">
      <div className="hero card grid">
        <div className="header">
          <div>
            <p className="hero-kicker">호스트 전용 관리 화면</p>
            <h1>Host Admin</h1>
            <p className="small">현지 장소 데이터를 관리해 여행 추천의 품질을 높이세요.</p>
          </div>
          <nav className="top-nav">
            <Link href="/">Traveler</Link>
            <Link href="/host">Host Admin</Link>
          </nav>
        </div>
      </div>

      {!unlocked ? (
        <section className="card grid">
          <h2>보안 확인</h2>
          <p className="small">Host 세팅으로 이동하려면 특별 비밀번호를 입력하세요.</p>
          <label>
            Special password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
          <button className="btn-primary" type="button" onClick={unlockHost}>
            Enter Host Setup
          </button>
          {passwordError && <div className="error">{passwordError}</div>}
        </section>
      ) : (
        <>
          <section className="card grid">
            <h2>{editingId ? "Edit place" : "Add place"}</h2>
            <form className="grid" onSubmit={onSubmit}>
              <div className="input-grid">
                <label>
                  Name
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </label>
                <label>
                  Area
                  <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
                </label>
                <label>
                  Category (comma-separated)
                  <input
                    value={form.category.join(", ")}
                    onChange={(e) => setForm({ ...form, category: splitCsv(e.target.value) })}
                    placeholder="food, market"
                  />
                </label>
                <label>
                  Vibe (comma-separated)
                  <input
                    value={form.vibe.join(", ")}
                    onChange={(e) => setForm({ ...form, vibe: splitCsv(e.target.value) })}
                    placeholder="local, casual"
                  />
                </label>
              </div>

              <label>
                Short description
                <textarea value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} required />
              </label>

              <label>
                Tips
                <textarea value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} />
              </label>

              <label>
                Map Query (optional)
                <input value={form.mapQuery} onChange={(e) => setForm({ ...form, mapQuery: e.target.value })} />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" type="submit">
                  {editingId ? "Update place" : "Add place"}
                </button>
                {editingId && (
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="grid">
            {places.map((p) => (
              <article className="card" key={p.id}>
                <h3>{p.name}</h3>
                <p className="small">{p.area}</p>
                <p>{p.shortDesc}</p>
                <p className="small">Category: {p.category.join(", ") || "-"}</p>
                <p className="small">Vibe: {p.vibe.join(", ") || "-"}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="btn-secondary" onClick={() => edit(p)}>
                    Edit
                  </button>
                  <button className="btn-secondary" onClick={() => remove(p.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
