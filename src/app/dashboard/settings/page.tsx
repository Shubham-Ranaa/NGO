"use client";

import { useState } from "react";
import {
  SettingsIcon,
  UserRoundIcon,
  UsersIcon,
  HardDriveIcon,
  KeyRoundIcon,
  TriangleAlertIcon,
  CircleCheckIcon,
  Trash2Icon,
  DatabaseIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "lucide-react";

import {
  getUsers,
  registerUser,
  logout,
  ROLE_CONFIG,
  type Role,
  type User,
} from "@/lib/auth";
import { Reveal } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ROLE_TONES: Record<string, string> = {
  "super-admin": "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  manager: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  finance: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  volunteer: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  "public-viewer": "bg-muted text-muted-foreground",
};

export default function SettingsPage() {
  const [wearusers, setWearUsers] = useState<number>(0); // noop guard to force re-render on add
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("volunteer");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const users = getUsers();

  const roleCounts = (Object.keys(ROLE_CONFIG) as Role[]).map((r) => ({
    role: r,
    label: ROLE_CONFIG[r].label,
    count: users.filter((u) => u.role === r).length,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerUser(email.trim(), name.trim(), role);
    if (result.ok) {
      setMessage({
        kind: "ok",
        text: `Account created for ${result.user?.name ?? "user"} (${ROLE_CONFIG[result.user?.role ?? role].label}). They can sign in with password demo1234.`,
      });
      setEmail("");
      setName("");
      setRole("volunteer");
      setWearUsers((n) => n + 1);
    } else {
      setMessage({ kind: "error", text: result.error ?? "Could not create the account." });
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem("ngo_demo_store");
    localStorage.removeItem("ngo_demo_session");
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero header */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-400/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <SettingsIcon className="size-3.5" aria-hidden="true" />
                Super admin · organisation controls
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Organisation settings
              </h1>
              <p className="text-sm text-white/70">
                Manage demo accounts and roles, and see exactly what this demo
                stores in your browser. Seed credentials are hardcoded in the
                app — a pattern you must never ship to production.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                onClick={logout}
                className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <UserRoundIcon className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </div>

          {/* Role count strip */}
          <div className="relative mt-7 flex flex-wrap gap-2 border-t border-white/15 pt-6">
            {roleCounts.map((rc) => (
              <span
                key={rc.role}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85"
              >
                {rc.label}
                <span className="font-heading font-semibold tabular-nums">{rc.count}</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Add user + data card */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Reveal className="xl:col-span-2" delay={1}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <UserPlusIcon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="font-heading text-base">Add demo user</CardTitle>
                  <CardDescription className="mt-0.5">
                    Accounts are stored in localStorage with the default demo password.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-[0.65rem]">
                {users.length} accounts
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div
                  className={cn(
                    "flex items-start gap-2 rounded-xl border p-3 text-sm",
                    message.kind === "ok"
                      ? "border-emerald-200/70 bg-emerald-50/60 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200"
                      : "border-rose-200/70 bg-rose-50/60 text-rose-800 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200"
                  )}
                  role="status"
                >
                  {message.kind === "ok" ? (
                    <CircleCheckIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <label htmlFor="settings-email" className="mb-1 block text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <Input
                    id="settings-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sahyog.example.org"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="settings-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                    Full name
                  </label>
                  <Input
                    id="settings-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New staff member"
                  />
                </div>
                <div>
                  <label htmlFor="settings-role" className="mb-1 block text-xs font-medium text-muted-foreground">
                    Role
                  </label>
                  <Select value={role} onValueChange={(value: string) => setRole(value as Role)}>
                    <SelectTrigger id="settings-role" aria-label="Role" className="w-full">
                      <SelectValue placeholder={ROLE_CONFIG[role].label} />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(ROLE_CONFIG) as [Role, { label: string }][]).map(
                        ([key, cfg]) => (
                          <SelectItem key={key} value={key}>
                            {cfg.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full gap-2">
                    <UserPlusIcon className="size-4" aria-hidden="true" />
                    Create
                  </Button>
                </div>
              </form>

              {/* Users table */}
              <div className="overflow-hidden rounded-xl border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-semibold">Member</th>
                      <th className="px-4 py-2.5 font-semibold">Role</th>
                      <th className="px-4 py-2.5 font-semibold">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.map((u) => (
                      <UserRow key={u.id} user={u} />
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                          No accounts — create the first one above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Data & privacy card */}
        <Reveal delay={2}>
          <div className="flex h-full flex-col gap-5">
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                    <DatabaseIcon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <CardTitle className="font-heading text-base">Data &amp; privacy</CardTitle>
                    <CardDescription className="mt-0.5">What this demo keeps, and where.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <HardDriveIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                  <p>
                    All records (donations, expenses, events, volunteers,
                    inventory, audit entries) live in this
                    browser's localStorage under <code className="font-mono text-foreground">ngo_demo_store</code>; the signed-in session sits in{" "}
                    <code className="font-mono text-foreground">ngo_demo_session</code>. The CEP
                    survey module does not use the store — its real field data
                    ships with the app and loads read-only.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={resetDemoData}
                  className="w-full gap-2"
                >
                  <Trash2Icon className="size-4" aria-hidden="true" />
                  Reset demo data &amp; sign out
                </Button>
                <p className="text-[0.7rem] text-muted-foreground">
                  Clears both keys and reloads. All demo records are wiped —
                  nothing is ever sent to a server.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-200/70 bg-amber-50/50 dark:border-amber-500/25 dark:bg-amber-500/5">
              <CardContent className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <KeyRoundIcon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Default password: <code className="font-mono">demo1234</code>
                  </p>
                  <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                    Shared by every seed account. Hardcoded credentials and plain
                    localStorage sessions are demo conveniences — a real NGO
                    system needs hashed secrets and a real auth backend.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardContent className="flex items-start gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">
                  Role permissions are enforced in the workspace UI by
                  role-gated navigation and page guards. They are client-side
                  demonstrations — anyone can read the demo source.
                </p>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function UserRow({ user }: { user: User }) {
  const initials = (user.name ?? "U")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.68rem] font-semibold",
            ROLE_TONES[user.role] ?? "bg-muted text-muted-foreground"
          )}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <Badge variant="outline" className="text-[0.65rem]">
          seed
        </Badge>
      </td>
    </tr>
  );
}
