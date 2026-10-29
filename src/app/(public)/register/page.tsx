"use client";

import Link from "next/link";
import { useState } from "react";
import { MailIcon, UserIcon, ShieldIcon, ArrowRightIcon } from "lucide-react";

import { registerUser, type Role, ROLE_CONFIG } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("volunteer");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerUser(email, name, role);
    if (result.ok) {
      setMessage({ kind: "ok", text: `Account created for ${result.user!.name}. You can now sign in.` });
      setEmail(""); setName("");
    } else {
      setMessage({ kind: "error", text: result.error! });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <UserIcon className="size-5" aria-hidden="true" />
            Create account
          </CardTitle>
          <CardDescription>
            New accounts are stored in-memory (localStorage) for this demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={cn("mb-4 rounded-lg p-3 text-sm", message.kind === "ok" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100")}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                <label className="sr-only">Full name</label>
                <Input
                  placeholder="Ananya Kulkarni"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                <label className="sr-only">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <Select value={role} onValueChange={(value: string) => setRole(value as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder={ROLE_CONFIG[role].label} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key as Role}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full gap-2">
              {submitting ? "Creating…" : (
                <>
                  Create account <ArrowRightIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardContent className="pb-6 text-center text-sm text-muted-foreground space-y-2">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-[0.75rem]">
            Default demo password for seed accounts:{" "}
            <span className="font-mono text-xs">demo1234</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
