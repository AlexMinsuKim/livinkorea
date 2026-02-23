export type Place = {
  id: string;
  name: string;
  area: string;
  category: string[];
  vibe: string[];
  shortDesc: string;
  tips?: string;
  mapQuery?: string;
};

export type RecommendationPlace = {
  id: string;
  name: string;
  reason: string;
  best_time: string;
  tips: string;
  map_link: string;
};

export type CourseStep = {
  name: string;
  why: string;
  eta: string;
};

export type RecommendationResult = {
  source?: "candidate" | "general";
  summary: string;
  places: RecommendationPlace[];
  half_day_course: {
    title: string;
    steps: CourseStep[];
  };
};
