"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "volunteering", label: "Volunteering" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press / media" },
  { value: "grievance", label: "Grievance" },
] as const;

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Add at least 2 characters")
    .max(80, "Keep it under 80 characters"),
  email: z.email("Enter a valid email address"),
  topic: z.string().min(1, "Pick a topic"),
  message: z
    .string()
    .min(10, "A little more detail helps (10+ characters)")
    .max(600, "Keep it under 600 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    toast.success("Message validated", {
      description:
        "Phase 6 connects this to persistence — for now your details validate correctly.",
    });
    form.reset();
    // Referenced so `values` type-checks without pretending it was saved.
    void values;
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            data-invalid={Boolean(form.formState.errors.name) || undefined}
          >
            <FieldLabel htmlFor="contact-name">Full name</FieldLabel>
            <Input
              id="contact-name"
              placeholder="Ananya Kulkarni"
              autoComplete="name"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            ) : (
              <FieldDescription>Shown only to the team.</FieldDescription>
            )}
          </Field>

          <Field
            data-invalid={Boolean(form.formState.errors.email) || undefined}
          >
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            ) : (
              <FieldDescription>We reply within two working days.</FieldDescription>
            )}
          </Field>
        </div>

        <Field
          data-invalid={Boolean(form.formState.errors.topic) || undefined}
        >
          <FieldLabel htmlFor="contact-topic">Topic</FieldLabel>
          <Select onValueChange={(value) => form.setValue("topic", value)}>
            <SelectTrigger id="contact-topic">
              <SelectValue placeholder="Choose what this is about" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.topic ? (
            <FieldError>{form.formState.errors.topic.message}</FieldError>
          ) : null}
        </Field>

        <Field
          data-invalid={Boolean(form.formState.errors.message) || undefined}
        >
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            rows={5}
            placeholder="Tell us what you need…"
            {...form.register("message")}
          />
          {form.formState.errors.message ? (
            <FieldError>{form.formState.errors.message.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 px-6 shadow-sm transition-shadow hover:shadow-md"
          disabled={form.formState.isSubmitting}
        >
          <SendIcon className="size-4" aria-hidden="true" />
          Send message
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo form — nothing is stored or sent yet.
        </p>
      </div>
    </form>
  );
}
