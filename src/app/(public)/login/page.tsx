"use client";

import Link from "next/link";
import { useState } from "react";
import { MailIcon, LockIcon, ShieldIcon, ArrowRightIcon } from "lucide-react";

import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) {
      window.location.href = "/dashboard";
    } else {
      setMessage({ kind: "error", text: result.error! });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <ShieldIcon className="size-5" aria-hidden="true" />
            Sign in
          </CardTitle>
          <CardDescription>
            Demo credentials are listed below. All accounts share the same demo password.
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
                <MailIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                <label className="sr-only">Email</label>
                <Input
                  type="email"
                  placeholder="admin@sahyog.example.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <LockIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                <label className="sr-only">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full gap-2">
              {submitting ? "Signing in…" : (
                <>
                  Sign in <ArrowRightIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardContent className="pb-6 text-center text-sm text-muted-foreground space-y-2">
          <p>
            Super Admin: <span className="font-mono text-xs">admin@sahyog.example.org</span> &nbsp;·&nbsp;
            NGO Manager: <span className="font-mono text-xs">manager@sahyog.example.org</span> &nbsp;·&nbsp;
            Finance: <span className="font-mono text-xs">finance@sahyog.example.org</span> &nbsp;·&nbsp;
            Volunteer: <span className="font-mono text-xs">volunteer@sahyog.example.org</span> &nbsp;·&nbsp;
            Public Viewer: <span className="font-mono text-xs">public@sahyog.example.org</span>
          </p>
          <p>Demo password for every account: <span className="font-mono text-xs">demo1234</span></p>
          <p>
            New here?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
