"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Controller,
  FieldPath,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { ChipGroup } from "./FormFields/ChipGroup";
import { MultiColorPicker } from "./FormFields/MultiColorPicker";
import { Stepper } from "./Stepper";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  BlueprintFormValues,
  blueprintSchema,
  blueprintSteps,
} from "@/lib/zodSchemas";
import { templateOptions } from "@/lib/templates";

export function BlueprintForm() {
  const router = useRouter();
  const defaultValues = useMemo<BlueprintFormValues>(
    () => ({
      identity: {
        businessName: "",
        oneLiner: "",
        whatYouSell: "",
        brandPersonality: ["Bold"],
      },
      vision: {
        mainGoal: "Leads",
        primaryAction: "Book a call",
        visitorFeel: "Confident, taken care of, impressed",
        dreamClient: "",
      },
      look: {
        references: [
          {
            url: "",
            notes: "",
          },
        ],
        colorPreference: [],
        imageryVibe: [],
        assetsNote: "",
        assetUploads: [],
      },
      content: {
        pages: ["Home", "About", "Services", "Pricing", "Contact"],
        ctaDestination: "",
        homeCopy: "",
      },
      technical: {
        domainStatus: "have",
        integrations: [],
        currentSite: "",
      },
      confirmations: {
        timeline: false,
        cancellation: false,
        sla: false,
      },
    }),
    [],
  );

  const form = useForm<BlueprintFormValues>({
    resolver: zodResolver(blueprintSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const assetUploads = watch("look.assetUploads");
  const references = watch("look.references");
  const selectedTemplates = templateOptions.filter((template) =>
    references?.some((ref) => ref.url === template.url),
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "look.references",
  });

  const [step, setStep] = useState(0);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const stepFields: Record<number, FieldPath<BlueprintFormValues>[]> = {
    0: [
      "identity.businessName",
      "identity.oneLiner",
      "identity.whatYouSell",
      "identity.brandPersonality",
    ],
    1: [
      "vision.mainGoal",
      "vision.primaryAction",
      "vision.visitorFeel",
      "vision.dreamClient",
    ],
    2: [
      "look.colorPreference",
      "look.assetsNote",
    ],
    3: ["content.pages", "content.ctaDestination", "content.homeCopy"],
    4: ["technical.domainStatus", "technical.currentSite"],
    5: ["confirmations.timeline", "confirmations.cancellation", "confirmations.sla"],
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, blueprintSteps.length - 1));
  };

  const goPrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values: BlueprintFormValues) => {
    const response = await fetch("/api/blueprint", {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      toast.error("Something went wrong. Please review the form.");
      return;
    }
    toast.success("Blueprint received. We'll follow up within 24 hours.");
    router.push("/thank-you");
  };

  const applyTemplateReference = (template: (typeof templateOptions)[number]) => {
    const currentRefs = form.getValues("look.references") || [];
    const templateRef = {
      url: template.url,
      notes: `${template.name} (WebForm template)`,
    };
    const exists = currentRefs.some((ref) => ref.url === template.url);

    if (exists) {
      const nextRefs = currentRefs.filter((ref) => ref.url !== template.url);
      setValue("look.references", nextRefs, { shouldValidate: true });
      toast.success(`Removed ${template.name} from your references`);
      return;
    }

    if (currentRefs.length >= 3) {
      toast.error("You can pick up to 3 templates. Remove one to add another.");
      return;
    }

    const nextRefs = [...currentRefs, templateRef];
    setValue("look.references", nextRefs, { shouldValidate: true });
    toast.success(`Added ${template.name} to your references`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <motion.h2
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-2xl font-bold text-foreground text-center"
        >
          {blueprintSteps[step]}
        </motion.h2>
        <Stepper steps={blueprintSteps as unknown as string[]} current={step} />
      </div>

      <form
        className="space-y-8"
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Website Blueprint form"
      >
        {step === 0 && (
          <section className="section space-y-4">
            <Field label="Business name" error={errors.identity?.businessName?.message}>
              <Input placeholder="Acme Studio" {...register("identity.businessName")} />
            </Field>
            <Field label="One-liner" hint='e.g., "We help busy founders launch premium nutrition apps."' error={errors.identity?.oneLiner?.message}>
              <Input placeholder="We build fast, memorable websites." {...register("identity.oneLiner")} />
            </Field>
            <Field label="What do you sell?" error={errors.identity?.whatYouSell?.message}>
              <Input placeholder="Service, product, or offer" {...register("identity.whatYouSell")} />
            </Field>
            <Field label="Brand personality" error={errors.identity?.brandPersonality?.message}>
              <Controller
                control={control}
                name="identity.brandPersonality"
                render={({ field }) => (
                  <ChipGroup
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Friendly", value: "Friendly" },
                      { label: "Luxury", value: "Luxury" },
                      { label: "Bold", value: "Bold" },
                      { label: "Calm", value: "Calm" },
                      { label: "Technical", value: "Technical" },
                      { label: "Creative", value: "Creative" },
                    ]}
                  />
                )}
              />
            </Field>
          </section>
        )}

        {step === 1 && (
          <section className="section space-y-4">
            <Field label="Main website goal" error={errors.vision?.mainGoal?.message}>
              <Controller
                control={control}
                name="vision.mainGoal"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-label="Main goal">
                      <SelectValue placeholder="Choose a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Leads", "Bookings", "Trust", "Portfolio", "Sell"].map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="#1 action you want visitors to take" error={errors.vision?.primaryAction?.message}>
              <Input placeholder="Book a consult, start trial, reserve spot" {...register("vision.primaryAction")} />
            </Field>
            <Field label="What should visitors feel?" hint="Use 3–5 keywords." error={errors.vision?.visitorFeel?.message}>
              <Input placeholder="Confident, excited, taken care of" {...register("vision.visitorFeel")} />
            </Field>
            <Field
              label="Describe your dream client"
              hint="2–3 sentences."
              error={errors.vision?.dreamClient?.message}
            >
              <Textarea placeholder="Describe who you serve, why they pick you, and what success looks like for them." {...register("vision.dreamClient")} />
            </Field>
          </section>
        )}

        {step === 2 && (
          <section className="section space-y-4">
            <div className="space-y-3 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm shadow-black/20">
              <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Template library</p>
                    <p className="text-xs text-muted-foreground">
                      Pick a starting point and we’ll add it to your references.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplates.length ? (
                        selectedTemplates.map((template) => (
                          <Badge key={template.id} variant="outline">
                            {template.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No templates selected yet.</span>
                      )}
                    </div>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Open template library
                    </Button>
                  </DialogTrigger>
                </div>
                <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Browse templates</DialogTitle>
                    <DialogDescription>
                      Select any template to add it to your references. You can mix and match up to three.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {templateOptions.map((template) => {
                      const isSelected = references?.some((ref) => ref.url === template.url);
                      const thumb = template.thumbnail;
                      return (
                        <div
                          key={template.id}
                          className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm transition hover:border-primary/50 hover:shadow-glow cursor-pointer"
                          onClick={() =>
                            window.open(template.preview, "_blank", "noopener,noreferrer")
                          }
                        >
                          <div
                            className="w-full aspect-square rounded-xl shadow-inner bg-cover bg-center brightness-125 saturate-125"
                            style={{
                              backgroundImage: thumb
                                ? `url(${thumb})`
                                : "radial-gradient(circle at 20% 30%,rgba(156,77,255,0.35),transparent 40%),radial-gradient(circle at 80% 30%,rgba(79,195,255,0.35),transparent 40%),linear-gradient(120deg,rgba(40,50,70,0.6),rgba(20,26,38,0.7))",
                              filter: "brightness(1.45) saturate(1.25)",
                            }}
                          />
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            className="absolute right-3 top-3 h-8 w-8 rounded-full p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyTemplateReference(template);
                            }}
                            aria-pressed={isSelected}
                            aria-label={`Select ${template.name}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <span className="sr-only">{template.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Reference sites</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => append({ url: "", notes: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-border/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="ghost">Reference {idx + 1}</Badge>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="text-xs text-muted-foreground underline"
                          onClick={() => remove(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <Input
                        placeholder="https://"
                        {...register(`look.references.${idx}.url` as const)}
                      />
                      <Input
                        placeholder="What you like about it"
                        {...register(`look.references.${idx}.notes` as const)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errors.look?.references?.message && (
                <p className="text-sm text-red-400">{errors.look.references.message}</p>
              )}
            </div>
            <Field label="Color preference" error={errors.look?.colorPreference?.message}>
              <Controller
                control={control}
                name="look.colorPreference"
                render={({ field }) => (
                  <MultiColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
            <Field label="Upload photos" hint="Add logos, brand images, or inspiration photos.">
              <input
                type="file"
                multiple
                accept="image/*"
                className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border/60 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground file:transition hover:file:border-primary/60"
                onChange={(event) => {
                  const files = Array.from(event.target.files || []).map(
                    (file) => file.name,
                  );
                  setValue("look.assetUploads", files);
                }}
              />
              <p className="text-xs text-muted-foreground">
                {assetUploads?.length
                  ? `Uploaded: ${assetUploads.join(", ")}`
                  : "JPG, PNG, SVG files supported"}
              </p>
            </Field>
          </section>
        )}

        {step === 3 && (
          <section className="section space-y-4">
            <Field label="Pages you want" error={errors.content?.pages?.message}>
              <Controller
                control={control}
                name="content.pages"
                render={({ field }) => (
                  <ChipGroup
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Home", value: "Home" },
                      { label: "About", value: "About" },
                      { label: "Services", value: "Services" },
                      { label: "Pricing", value: "Pricing" },
                      { label: "Portfolio", value: "Portfolio" },
                      { label: "Contact", value: "Contact" },
                      { label: "Book", value: "Book" },
                    ]}
                  />
                )}
              />
            </Field>
            <Field
              label="CTA destination"
              hint="Email, phone, or booking link."
              error={errors.content?.ctaDestination?.message}
            >
              <Input placeholder="hello@yourcompany.com" {...register("content.ctaDestination")} />
            </Field>
            <Field
              label="Seed copy for Home hero"
              hint="Feel free to paste per-page notes."
              error={errors.content?.homeCopy?.message}
            >
              <Textarea placeholder="We help busy teams launch premium websites without the DIY." {...register("content.homeCopy")} />
            </Field>
          </section>
        )}

        {step === 4 && (
          <section className="section space-y-4">
            <Field label="Domain" error={errors.technical?.domainStatus?.message}>
              <Controller
                control={control}
                name="technical.domainStatus"
                render={({ field }) => (
                  <ChipGroup
                    value={[field.value]}
                    multiple={false}
                    onChange={(val) => field.onChange(val[0] ?? field.value)}
                    options={[
                      { label: "I have a domain", value: "have" },
                      { label: "I need a domain", value: "need" },
                    ]}
                  />
                )}
              />
            </Field>
            <Field
              label="Current site URL (optional)"
              error={errors.technical?.currentSite?.message}
            >
              <Input placeholder="https://current-site.com" {...register("technical.currentSite")} />
            </Field>
          </section>
        )}


        {step === 5 && (
          <section className="section space-y-4">
            <CheckboxField
              label="I acknowledge the 7-day build and 3-day updates."
              checked={form.getValues("confirmations.timeline")}
              onCheckedChange={(v) => setValue("confirmations.timeline", Boolean(v))}
              error={errors.confirmations?.timeline?.message}
            />
            <CheckboxField
              label="I understand hosting/domain is included; canceling stops hosting."
              checked={form.getValues("confirmations.cancellation")}
              onCheckedChange={(v) => setValue("confirmations.cancellation", Boolean(v))}
              error={errors.confirmations?.cancellation?.message}
            />
            <CheckboxField
              label="I agree to respond within 24h during build checkpoints."
              checked={form.getValues("confirmations.sla")}
              onCheckedChange={(v) => setValue("confirmations.sla", Boolean(v))}
              error={errors.confirmations?.sla?.message}
            />
          </section>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goPrev}
            disabled={step === 0}
          >
            Previous
          </Button>
          {step < blueprintSteps.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Blueprint
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  error?: string;
};

function CheckboxField({
  label,
  checked,
  onCheckedChange,
  error,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(Boolean(v))}
        className="mt-1"
      />
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
