// ============================================================
// EQUIP2LEAD — TypeScript Types (mirrors Supabase schema)
// ============================================================

export type UserRole = 'user' | 'admin' | 'coach';
export type TrackSlug = 'leadership' | 'ministry' | 'marriage' | 'entrepreneur' | 'personal';
export type JourneyStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type CheckinMood = 'struggling' | 'flat' | 'okay' | 'good' | 'on_fire';
export type Language = 'en' | 'fr';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  preferred_language: Language;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  slug: TrackSlug;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Pillar {
  id: string;
  track_id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
}

export interface SubDomain {
  id: string;
  pillar_id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  sort_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  sub_domain_id: string;
  text_en: string;
  text_fr: string;
  question_type: 'likert' | 'multiple_choice' | 'open_text' | 'scale';
  options: Record<string, unknown>[] | null;
  min_value: number;
  max_value: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Journey {
  id: string;
  user_id: string;
  track_id: string;
  status: JourneyStatus;
  current_week: number;
  current_pillar_id: string | null;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface Response {
  id: string;
  journey_id: string;
  question_id: string;
  pillar_id: string;
  value: number;
  text_response: string | null;
  answered_at: string;
}

export interface PillarScore {
  id: string;
  journey_id: string;
  pillar_id: string;
  score: number;
  max_score: number;
  sub_domain_scores: Record<string, number> | null;
  computed_at: string;
}

export interface CoachingPlan {
  id: string;
  journey_id: string;
  focus_areas: { sub_domain_id: string; name: string; score: number }[];
  coach_lens_summary: string | null;
  plan_data: WeekPlan[];
  generated_at: string;
  updated_at: string;
}

export interface WeekPlan {
  week: number;
  theme: string;
  pillar_focus: string;
  exercises: string[];
  reflection_prompt: string;
  goals: string[];
}

export interface WeeklyCheckin {
  id: string;
  journey_id: string;
  week_number: number;
  mood: CheckinMood | null;
  goals_completed: string[] | null;
  progress_rating: number | null;
  reflection: string | null;
  commitment: string | null;
  adaptive_plan_update: Record<string, unknown> | null;
  completed_at: string;
}

export interface Conversation {
  id: string;
  journey_id: string;
  title: string | null;
  started_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

// ============================================================
// Joined / Extended types for the frontend
// ============================================================

export interface PillarWithSubDomains extends Pillar {
  sub_domains: SubDomain[];
}

export interface TrackWithPillars extends Track {
  pillars: PillarWithSubDomains[];
}

export interface QuestionWithContext extends Question {
  sub_domain: SubDomain;
  pillar: Pillar;
}

export interface JourneyWithDetails extends Journey {
  track: Track;
  pillar_scores: PillarScore[];
  coaching_plan: CoachingPlan | null;
  weekly_checkins: WeeklyCheckin[];
}

// ============================================================
// i18n helper
// ============================================================
export function localize<T extends { name_en: string; name_fr: string }>(
  item: T,
  lang: Language
): string {
  return lang === 'fr' ? item.name_fr : item.name_en;
}

export function localizeDesc<T extends { description_en: string | null; description_fr: string | null }>(
  item: T,
  lang: Language
): string | null {
  return lang === 'fr' ? item.description_fr : item.description_en;
}

export function localizeQuestion(q: Question, lang: Language): string {
  return lang === 'fr' ? q.text_fr : q.text_en;
}
