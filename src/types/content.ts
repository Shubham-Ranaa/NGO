/**
 * Content model shared by the public website.
 *
 * The values are authored as immutable JSON seed files under `src/data/`.
 * Phase 4 wraps them in Zod schemas and a storage service so that runtime
 * edits persist to localStorage; the public pages already read through the
 * typed accessors in `@/lib/content`, so no page has to change.
 */

export type ContentIconName =
  | "droplets"
  | "stethoscope"
  | "wheat"
  | "graduation"
  | "home"
  | "book"
  | "globe"
  | "heart";

export type ProjectStatus = "planning" | "active" | "completed" | "on-hold";

export type CampaignStatus = "draft" | "active" | "completed" | "archived";

export type EventStatus = "upcoming" | "completed" | "cancelled";

export interface Program {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: ContentIconName;
  featured: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  programSlug: string;
  category: string;
  summary: string;
  description: string;
  location: string;
  status: ProjectStatus;
  /** 0–100 completion percentage. */
  progress: number;
  startDate: string;
  endDate: string;
  budgetInr: number;
  raisedInr: number;
  beneficiaries: number;
  objectives: string[];
  outcomes: string[];
  manager: string;
  featured: boolean;
  campaignSlugs: string[];
  volunteerRoles: string[];
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  projectSlug: string | null;
  goalInr: number;
  raisedInr: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  summary: string;
  description: string;
  featured: boolean;
}

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  summary: string;
  description: string;
  highlights: string[];
  projectSlug: string | null;
}

export interface Story {
  id: string;
  slug: string;
  kind: "story" | "testimonial";
  title: string;
  excerpt: string;
  body: string;
  quote?: string;
  author?: string;
  role?: string;
  location: string;
  date: string;
  projectSlug: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface ReportRecord {
  id: string;
  year: number;
  title: string;
  kind: "annual" | "financial" | "programme" | "impact";
  format: "PDF";
  pages: number;
  publishedOn: string;
  summary: string;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  since: number;
  contribution: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface VolunteerOpportunity {
  id: string;
  slug: string;
  title: string;
  summary: string;
  commitment: string;
  location: string;
  seats: number;
  skills: string[];
  programSlug: string;
  open: boolean;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  note: string;
}

export interface Achievement {
  id: string;
  year: number;
  title: string;
  detail: string;
}
