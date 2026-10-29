"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartIcon, IndianRupeeIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

const AMOUNTS = [
  { value: 500, note: "Water tests for one school month" },
  { value: 2000, note: "A camp's medical consumables" },
  { value: 5000, note: "One borewell maintenance cycle" },
  { value: 10000, note: "A village committee's seed fund" },
] as const;

export type DonateCampaign = {
  slug: string;
  title: string;
  raised: string;
  goal: string;
  percent: number;
};

const donateSchema = z.object({
  donorName: z
    .string()
    .min(2, "Add at least 2 characters")
    .max(80, "Keep it under 80 characters"),
  donorEmail: z.email("Enter a valid email address"),
  campaign: z.string().min(1, "Choose where your gift goes"),
  amount: z.number().int().min(100).max(1000000),
});

export type DonateValues = z.infer<typeof donateSchema>;

export function DonateForm({ campaigns }: { campaigns: DonateCampaign[] }) {
  const [amount, setAmount] = useState<number>(2000);
  const [custom, setCustom] = useState<string>("");
  const form = useForm<DonateValues>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      donorName: "",
      donorEmail: "",
      campaign: "",
      amount: 2000,
    },
    mode: "onBlur",
  });

  const chooseAmount = (value: number) => {
    setAmount(value);
    setCustom("");
    form.setValue("amount", value);
  };

  const onSubmit = form.handleSubmit(() => {
    toast.success("Validation passed — Phase 5 connects payments", {
      description:
        "UPI, cards and instant receipts will hang off this exact form.",
    });
    form.reset();
    form.setValue("amount", amount);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel>Choose an amount</FieldLabel>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {AMOUNTS.map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => chooseAmount(tier.value)}
                aria-pressed={amount === tier.value && custom === ""}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2 text-center transition-all outline-none",
                  amount === tier.value && custom === ""
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "bg-card text-foreground hover:border-primary/40",
                )}
              >
                <span className="font-semibold tabular-nums">₹{tier.value.toLocaleString("en-IN")}</span>
                <span className="text-[0.65rem] leading-tight text-muted-foreground">
                  {tier.note}
                </span>
              </button>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="donate-custom">Or enter your own</FieldLabel>
          <div className="relative">
            <IndianRupeeIcon
              className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="donate-custom"
              inputMode="numeric"
              className="ps-9"
              placeholder="Other amount (min ₹100)"
              value={custom}
              onChange={(event) => {
                const parsed = Number(event.target.value.replace(/\D/g, ""));
                setCustom(event.target.value);
                if (parsed >= 100 && parsed <= 1000000) {
                  setAmount(parsed);
                  form.setValue("amount", parsed);
                }
              }}
            />
          </div>
          <FieldDescription>
            incl. GST-exempt receipt under Section 80G (demo)
          </FieldDescription>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.campaign) || undefined}>
          <FieldLabel htmlFor="donate-campaign">Direct my gift to</FieldLabel>
          <Select onValueChange={(value) => form.setValue("campaign", value)}>
            <SelectTrigger id="donate-campaign">
              <SelectValue placeholder="Pick a campaign or general fund" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.slug} value={campaign.slug}>
                  {campaign.title} · {campaign.percent}% funded
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.campaign ? (
            <FieldError>{form.formState.errors.campaign.message}</FieldError>
          ) : null}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.donorName) || undefined}>
            <FieldLabel htmlFor="donate-name">Name</FieldLabel>
            <Input
              id="donate-name"
              autoComplete="name"
              placeholder="Ananya Kulkarni"
              {...form.register("donorName")}
            />
            {form.formState.errors.donorName ? (
              <FieldError>{form.formState.errors.donorName.message}</FieldError>
            ) : (
              <FieldDescription>Printed on the receipt.</FieldDescription>
            )}
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.donorEmail) || undefined}>
            <FieldLabel htmlFor="donate-email">Email</FieldLabel>
            <Input
              id="donate-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...form.register("donorEmail")}
            />
            {form.formState.errors.donorEmail ? (
              <FieldError>{form.formState.errors.donorEmail.message}</FieldError>
            ) : (
              <FieldDescription>Receipt delivery.</FieldDescription>
            )}
          </Field>
        </div>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="group h-12 gap-2 rounded-xl text-base shadow-sm transition-shadow hover:shadow-md"
      >
        <HeartIcon
          className="size-4 transition-transform group-hover:scale-110"
          fill="currentColor"
          aria-hidden="true"
        />
        Give {amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
      </Button>
    </form>
  );
}
