import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  DropletsIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  HouseIcon,
  StethoscopeIcon,
  WheatIcon,
} from "lucide-react";

import type { ContentIconName } from "@/types/content";

/** Maps the JSON icon names to lucide primitives (server-safe). */
const ICONS: Record<ContentIconName, LucideIcon> = {
  droplets: DropletsIcon,
  stethoscope: StethoscopeIcon,
  wheat: WheatIcon,
  graduation: GraduationCapIcon,
  home: HouseIcon,
  book: BookOpenIcon,
  globe: GlobeIcon,
  heart: HeartIcon,
};

export function ProgramIcon({
  name,
  className,
}: {
  name: ContentIconName;
  className?: string;
}) {
  const Icon = ICONS[name] ?? GlobeIcon;
  return <Icon className={className} aria-hidden="true" />;
}
