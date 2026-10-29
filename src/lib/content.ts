import type {
  Campaign,
  EventRecord,
  Faq,
  ImpactStat,
  Milestone,
  Partner,
  Program,
  Project,
  ReportRecord,
  Story,
  TeamMember,
  VolunteerOpportunity,
} from "@/types/content";

import campaignsJson from "@/data/campaigns.json";
import eventsJson from "@/data/events.json";
import faqsJson from "@/data/faqs.json";
import impactStatsJson from "@/data/impact-stats.json";
import milestonesJson from "@/data/milestones.json";
import partnersJson from "@/data/partners.json";
import programsJson from "@/data/programs.json";
import projectsJson from "@/data/projects.json";
import reportsJson from "@/data/reports.json";
import storiesJson from "@/data/stories.json";
import teamJson from "@/data/team.json";
import volunteerOpportunitiesJson from "@/data/volunteer-opportunities.json";

/**
 * Seed accessors for Phase 3. Today the JSON files are the single source of
 * truth; Phase 4 swaps these functions for the Zod-validated storage service
 * without touching any page.
 */
export const getPrograms = (): Program[] => programsJson as Program[];

export const getProjects = (): Project[] => projectsJson as Project[];

export const getCampaigns = (): Campaign[] => campaignsJson as Campaign[];

export const getEvents = (): EventRecord[] =>
  [...(eventsJson as EventRecord[])].sort(
    (a, b) => a.date.localeCompare(b.date),
  );

export const getStories = (): Story[] => storiesJson as Story[];

export const getTeam = (): TeamMember[] => teamJson as TeamMember[];

export const getMilestones = (): Milestone[] =>
  milestonesJson as Milestone[];

export const getReports = (): ReportRecord[] =>
  [...(reportsJson as ReportRecord[])].sort((a, b) => b.year - a.year);

export const getPartners = (): Partner[] => partnersJson as Partner[];

export const getFaqs = (): Faq[] => faqsJson as Faq[];

export const getImpactStats = (): ImpactStat[] =>
  impactStatsJson as ImpactStat[];

export const getVolunteerOpportunities = (): VolunteerOpportunity[] =>
  volunteerOpportunitiesJson as VolunteerOpportunity[];

export const getProgram = (slug: string): Program | undefined =>
  getPrograms().find((program) => program.slug === slug);

export const getProject = (slug: string): Project | undefined =>
  getProjects().find((project) => project.slug === slug);

export const getFeaturedProjects = (limit?: number): Project[] => {
  const featured = getProjects().filter((project) => project.featured);
  return limit ? featured.slice(0, limit) : featured;
};

/** Map every seed status to the shared badge tone system. */
export type StatusTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

type StatusLike = string;

const STATUS_TONES: Record<StatusLike, StatusTone> = {
  // Project
  planning: "warning",
  active: "success",
  completed: "info",
  "on-hold": "neutral",
  // Campaign
  draft: "neutral",
  archived: "neutral",
  // Event
  upcoming: "primary",
  cancelled: "danger",
};

export function statusTone(status: StatusLike): StatusTone {
  return STATUS_TONES[status] ?? "neutral";
}

/** Human label for seed statuses, e.g. "on-hold" → "On hold". */
export function statusLabel(status: StatusLike): string {
  if (status === "on-hold") return "On hold";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
