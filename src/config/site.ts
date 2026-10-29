/**
 * Site-wide configuration for the public NGO website and admin console.
 *
 * NOTE: every organisation detail below is FICTIONAL demo data for the
 * prototype. In a later phase these values are sourced from the editable
 * `settings.json` record in the data layer (Phase 4/9) instead of this file.
 */

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export const siteConfig = {
  name: "Sahyog Foundation",
  shortName: "Sahyog",
  tagline: "Community-led change, measured openly.",
  description:
    "Community-first, impact-driven non-profit.",
  url: "https://example.org",
  isDemo: true,
  demoNotice:
    "Fictional organisation · all people, projects and figures are sample demo data.",
  contact: {
    email: "hello@example.org",
    phone: "+91 98765 43210",
    addressLines: ["12 Samridhi Marg", "Pune, Maharashtra 411001", "India"],
  },
  social: [
    { label: "LinkedIn", href: "https://example.org/social/linkedin" },
    { label: "Instagram", href: "https://example.org/social/instagram" },
    { label: "X", href: "https://example.org/social/x" },
    { label: "YouTube", href: "https://example.org/social/youtube" },
  ],
  nav: [
    {
      label: "About",
      href: "/about",
      description: "Our story, mission, team and milestones.",
    },
    {
      label: "Our Work",
      href: "/our-work",
      description: "Programmes, projects and where we work.",
      children: [
        {
          label: "Programmes",
          href: "/our-work",
          description: "The long-term areas we work in.",
        },
        {
          label: "Campaigns",
          href: "/campaigns",
          description: "Live fundraising drives and their progress.",
        },
        {
          label: "Impact",
          href: "/impact",
          description: "Outcomes, verified figures and year-on-year progress.",
        },
      ],
    },
    {
      label: "Get Involved",
      href: "/get-involved",
      description: "Volunteer, partner or take part in an event.",
      children: [
        {
          label: "Volunteer",
          href: "/volunteer",
          description: "Open roles and the volunteer application form.",
        },
        {
          label: "Events",
          href: "/events",
          description: "Upcoming drives, camps and community events.",
        },
        {
          label: "Partners",
          href: "/partners",
          description: "Corporate, institutional and community partners.",
        },
      ],
    },
    { label: "Reports", href: "/reports", description: "Annual and financial reports." },
    { label: "Transparency", href: "/transparency", description: "Approved aggregate figures and verification status." },
    { label: "Contact", href: "/contact", description: "Talk to the team." },
  ] satisfies NavItem[],
  footerNav: [
    {
      title: "Organisation",
      items: [
        { label: "About us", href: "/about" },
        { label: "Our work", href: "/our-work" },
        { label: "Impact", href: "/impact" },
        { label: "Reports", href: "/reports" },
        { label: "Careers", href: "/about#careers" },
      ],
    },
    {
      title: "Get involved",
      items: [
        { label: "Volunteer", href: "/volunteer" },
        { label: "Events", href: "/events" },
        { label: "Campaigns", href: "/campaigns" },
        { label: "Partner with us", href: "/partners" },
        { label: "Donate", href: "/donate" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Sign in", href: "/login" },
        { label: "Create account", href: "/register" },
        { label: "My dashboard", href: "/dashboard" },
        { label: "Management console", href: "/admin" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Privacy policy", href: "/legal/privacy" },
        { label: "Terms of use", href: "/legal/terms" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
