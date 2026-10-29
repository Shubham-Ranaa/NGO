import {
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  FolderKanbanIcon,
  HandCoinsIcon,
  ScrollTextIcon,
  ImageIcon,
  TruckIcon,
  UserCheckIcon,
  ClipboardCheckIcon,
  BoxesIcon,
  ChartBarIcon,
  HeartHandshakeIcon,
  UsersIcon,
  WalletIcon,
  ShieldCheckIcon,
  SproutIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { statusLabel, statusTone, getCampaigns, getEvents, getProjects, getPrograms, getReports, getStories, getTeam } from "@/lib/content";
import { clampPercent, formatCompactCurrency, formatDate, formatNumber } from "@/lib/format";

export type ModuleRecord = { id: string; cells: ReactNode[] };

function statusCell(status: string) {
  return (
    <StatusBadge tone={statusTone(status)} dot>
      {statusLabel(status)}
    </StatusBadge>
  );
}

function progressCell(value: number) {
  return (
    <div className="flex min-w-28 flex-col gap-1">
      <span className="text-xs font-medium tabular-nums">{value}%</span>
      <Progress value={clampPercent(value)} aria-label={`Progress ${value} percent`} />
    </div>
  );
}

/**
 * Seed tables for the modules that already have JSON content. Everything else
 * resolves to `null` and renders the shared empty state with a phase note.
 */
export function getModuleSeed(moduleHref: string): {
  columns: string[];
  rows: ModuleRecord[];
} | null {
  switch (moduleHref) {
    case "/admin/projects": {
      const projects = getProjects();
      return {
        columns: ["Project", "Programme slug", "Status", "Progress", "Location", "Budget"],
        rows: projects.map((project) => ({
          id: project.id,
          cells: [
            <span key="t" className="font-medium text-foreground">{project.title}</span>,
            <span key="p" className="font-mono text-xs text-muted-foreground">{project.programSlug}</span>,
            statusCell(project.status),
            progressCell(project.progress),
            project.location,
            formatCompactCurrency(project.budgetInr),
          ],
        })),
      };
    }

    case "/admin/programs": {
      const programs = getPrograms();
      const projects = getProjects();
      return {
        columns: ["Programme", "Tagline", "Projects", "Icon key"],
        rows: programs.map((program) => ({
          id: program.id,
          cells: [
            <span key="n" className="font-medium text-foreground">{program.name}</span>,
            program.tagline,
            <StatusBadge key="c" tone="neutral">
              {projects.filter((project) => project.programSlug === program.slug).length} linked
            </StatusBadge>,
            <span key="i" className="font-mono text-xs text-muted-foreground">{program.icon}</span>,
          ],
        })),
      };
    }

    case "/admin/people": {
      const team = getTeam();
      return {
        columns: ["Member", "Role", "Profile"],
        rows: team.map((member) => ({
          id: member.id,
          cells: [
            <span key="n" className="font-medium text-foreground">{member.name}</span>,
            <StatusBadge key="r" tone="primary">{member.role}</StatusBadge>,
            member.bio,
          ],
        })),
      };
    }

    case "/admin/campaigns": {
      const campaigns = getCampaigns();
      return {
        columns: ["Campaign", "Status", "Raised", "Progress", "Window"],
        rows: campaigns.map((campaign) => ({
          id: campaign.id,
          cells: [
            <span key="t" className="font-medium text-foreground">{campaign.title}</span>,
            statusCell(campaign.status),
            <span key="r" className="tabular-nums">
              {formatCompactCurrency(campaign.raisedInr)}{" "}
              <span className="text-muted-foreground">/ {formatCompactCurrency(campaign.goalInr)}</span>
            </span>,
            progressCell((campaign.raisedInr / campaign.goalInr) * 100),
            `${formatDate(campaign.startDate)} → ${formatDate(campaign.endDate)}`,
          ],
        })),
      };
    }

    case "/admin/events": {
      const events = getEvents();
      return {
        columns: ["Event", "Status", "Date", "City", "Registrations"],
        rows: events.map((event) => ({
          id: event.id,
          cells: [
            <span key="t" className="font-medium text-foreground">{event.title}</span>,
            statusCell(event.status),
            formatDate(event.date),
            event.city,
            <span key="r" className="tabular-nums">
              {formatNumber(event.registered)} / {formatNumber(event.capacity)}
            </span>,
          ],
        })),
      };
    }

    case "/admin/reports": {
      const reports = getReports();
      return {
        columns: ["Report", "Type", "Year", "Pages", "Published"],
        rows: reports.map((report) => ({
          id: report.id,
          cells: [
            <span key="t" className="font-medium text-foreground">{report.title}</span>,
            <StatusBadge key="k" tone="info">{report.kind}</StatusBadge>,
            report.year,
            formatNumber(report.pages),
            formatDate(report.publishedOn),
          ],
        })),
      };
    }

    case "/admin/content": {
      const stories = getStories();
      return {
        columns: ["Title", "Kind", "Location", "Date"],
        rows: stories.map((story) => ({
          id: story.id,
          cells: [
            <span key="t" className="font-medium text-foreground">{story.title}</span>,
            <StatusBadge key="k" tone={story.kind === "story" ? "primary" : "success"}>
              {story.kind}
            </StatusBadge>,
            story.location,
            formatDate(story.date),
          ],
        })),
      };
    }

    case "/admin/users": {
      const team = getTeam();
      return {
        columns: ["Demo user", "Console role", "Access scope"],
        rows: team.map((member, index) => ({
          id: member.id,
          cells: [
            <span key="n" className="font-medium text-foreground">{member.name}</span>,
            <StatusBadge key="r" tone={index === 0 ? "danger" : "primary"}>
              {index === 0 ? "Org admin" : "Programme staff"}
            </StatusBadge>,
            index === 0 ? "All sections" : "Programmes, people, outreach",
          ],
        })),
      };
    }

    default:
      return null;
  }
}

/** Icons for empty-state rendering, keyed by module href. */
export function getModuleEmptyIcon(moduleHref: string) {
  const ICONS: Record<string, typeof FolderKanbanIcon> = {
    "/admin/projects": FolderKanbanIcon,
    "/admin/programs": SproutIcon,
    "/admin/tasks": ClipboardListIcon,
    "/admin/people": UsersIcon,
    "/admin/volunteers": HeartHandshakeIcon,
    "/admin/attendance": ClipboardCheckIcon,
    "/admin/beneficiaries": UserCheckIcon,
    "/admin/donations": HandCoinsIcon,
    "/admin/expenses": WalletIcon,
    "/admin/budgets": ChartBarIcon,
    "/admin/campaigns": ScrollTextIcon,
    "/admin/events": CalendarIcon,
    "/admin/inventory": BoxesIcon,
    "/admin/distributions": TruckIcon,
    "/admin/reports": FileTextIcon,
    "/admin/activity-log": ScrollTextIcon,
    "/admin/content": ImageIcon,
    "/admin/users": ShieldCheckIcon,
  };
  return ICONS[moduleHref] ?? FileTextIcon;
}
