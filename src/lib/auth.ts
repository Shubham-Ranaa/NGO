"use client";

/**
 * NGO Digital Management & Transparency System — Authentication layer.
 *
 * Per the prompt: no Flask/SQLite. Credentials live in code (hardcoded demo
 * accounts) and new sign-ups are stored in-memory, persisted to localStorage
 * so they survive reloads. Session is a simple client-side token.
 *
 * Roles: super-admin | manager | finance | volunteer | public-viewer
 */

export type Role =
  | "super-admin"
  | "manager"
  | "finance"
  | "volunteer"
  | "public-viewer";

export type RoleConfig = {
  label: string;
  description: string;
  color: string;
};

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  "super-admin": {
    label: "Super Admin",
    description: "Organisation settings and user management.",
    color: "text-purple-600 dark:text-purple-400",
  },
  manager: {
    label: "NGO Manager",
    description: "Events, volunteers and operational records.",
    color: "text-blue-600 dark:text-blue-400",
  },
  finance: {
    label: "Finance Manager",
    description: "Donations, expenses and financial reports.",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  volunteer: {
    label: "Volunteer",
    description: "Assigned events and permitted attendance actions.",
    color: "text-green-600 dark:text-green-400",
  },
  "public-viewer": {
    label: "Public Viewer",
    description: "Approved transparency summaries only.",
    color: "text-slate-500 dark:text-slate-400",
  },
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
};

const STORAGE_KEY = "ngo_demo_session";
const USERS_KEY = "ngo_demo_users";

/**
 * Hardcoded seed accounts. These are the only pre-existing credentials.
 * Sign-up appends new users to this list (persisted to localStorage).
 */
const SEED_USERS: User[] = [
  {
    id: "u-001",
    email: "admin@sahyog.example.org",
    name: "Super Admin",
    role: "super-admin",
    createdAt: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-002",
    email: "manager@sahyog.example.org",
    name: "NGO Manager",
    role: "manager",
    createdAt: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-003",
    email: "finance@sahyog.example.org",
    name: "Finance Manager",
    role: "finance",
    createdAt: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-004",
    email: "volunteer@sahyog.example.org",
    name: "Field Volunteer",
    role: "volunteer",
    createdAt: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-005",
    email: "public@sahyog.example.org",
    name: "Public Viewer",
    role: "public-viewer",
    createdAt: new Date("2026-01-01").toISOString(),
  },
];

const DEMO_PASSWORD = "demo1234"; // same password for every seed account

let users: User[] = [...SEED_USERS];
let seeded = false;

function loadUsers() {
  if (typeof window === "undefined") return;
  if (seeded) return;
  seeded = true;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed: User[] = JSON.parse(raw);
      // Keep seed accounts first, then any sign-ups.
      users = [...SEED_USERS, ...parsed.filter((u) => !SEED_USERS.some((s) => s.id === u.id))];
    }
  } catch {
    // ignore corrupt storage
  }
}

if (typeof window !== "undefined") loadUsers();

export function getUsers(): User[] {
  return users;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(
  email: string,
  name: string,
  role: Role = "volunteer",
  password: string = DEMO_PASSWORD
): { ok: boolean; user?: User; error?: string } {
  if (findUserByEmail(email)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user: User = {
    id: `u-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  persistUsers();
  return { ok: true, user };
}

function persistUsers() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users.filter((u) => !SEED_USERS.some((s) => s.id === u.id)))
    );
  } catch {
    // ignore
  }
}

export type Session = { user: User; token: string };

export function login(email: string, password: string): { ok: boolean; session?: Session; error?: string } {
  const user = findUserByEmail(email);
  if (!user || password !== DEMO_PASSWORD) {
    return { ok: false, error: "Invalid email or password." };
  }
  const session: Session = { user, token: `demo-${user.id}-${Date.now()}` };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return { ok: true, session };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const CAN_MANAGE_USERS = ["super-admin"];
export const CAN_WRITE_EVENTS = ["super-admin", "manager"];
export const CAN_WRITE_FINANCE = ["super-admin", "finance"];
export const CAN_APPROVE_EXPENSES = ["super-admin", "finance"];
export const CAN_VIEW_AUDIT = ["super-admin", "manager", "finance"];
export const CAN_VIEW_PUBLIC = [
  "super-admin",
  "manager",
  "finance",
  "volunteer",
  "public-viewer",
];

export function hasRole(role: Role, allowed: Role[]): boolean {
  return allowed.includes(role);
}
