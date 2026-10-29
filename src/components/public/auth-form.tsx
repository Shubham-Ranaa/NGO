"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRoundIcon, ShieldIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password needs 8+ characters"),
});

const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, "Add at least 2 characters")
    .max(80, "Keep it under 80 characters"),
  confirm: z.string(),
}).refine((values) => values.password === values.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const form = useForm<
    z.infer<typeof loginSchema> & { name?: string; confirm?: string }
  >({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: { email: "", password: "", name: "", confirm: "" },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success(
      mode === "login" ? "Demo session would start here" : "Account flow lands in Phase 9",
      {
        description:
          "Sessions, roles and the user store arrive with the users & roles module.",
      },
    );
    form.reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FieldGroup>
        {mode === "register" ? (
          <Field data-invalid={Boolean(form.formState.errors.name) || undefined}>
            <FieldLabel htmlFor="auth-name">Full name</FieldLabel>
            <Input
              id="auth-name"
              autoComplete="name"
              placeholder="Ananya Kulkarni"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            ) : null}
          </Field>
        ) : null}

        <Field data-invalid={Boolean(form.formState.errors.email) || undefined}>
          <FieldLabel htmlFor="auth-email">Email</FieldLabel>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : (
            <FieldDescription>
              {mode === "login"
                ? "Any valid-format email works in the demo."
                : "Use one address for volunteer + donor records."}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.password) || undefined}>
          <FieldLabel htmlFor="auth-password">Password</FieldLabel>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="••••••••"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : (
            <FieldDescription>8+ characters for the demo.</FieldDescription>
          )}
        </Field>

        {mode === "register" ? (
          <Field data-invalid={Boolean(form.formState.errors.confirm) || undefined}>
            <FieldLabel htmlFor="auth-confirm">Confirm password</FieldLabel>
            <Input
              id="auth-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.register("confirm")}
            />
            {form.formState.errors.confirm ? (
              <FieldError>{form.formState.errors.confirm.message}</FieldError>
            ) : null}
          </Field>
        ) : null}
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="h-11 gap-2 shadow-sm transition-shadow hover:shadow-md"
      >
        <KeyRoundIcon className="size-4" aria-hidden="true" />
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Prototype only — no credentials are transmitted, stored or verified.
      </p>
    </form>
  );
}
