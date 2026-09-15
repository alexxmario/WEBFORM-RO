"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, MessageCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Controller, FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ChipGroup } from "./FormFields/ChipGroup";
import { MultiColorPicker } from "./FormFields/MultiColorPicker";
import { Stepper } from "./Stepper";
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
import { BlueprintFormValues, blueprintSchema } from "@/lib/zodSchemas";
import { templateOptions } from "@/lib/templates";

const steps = ["Afacerea ta", "Ce trebuie să facă site-ul", "Stil și materiale", "Confirmare"];

const goals = [
  { label: "Să primesc cereri", value: "Leads" },
  { label: "Să primesc rezervări", value: "Bookings" },
  { label: "Să inspir încredere", value: "Trust" },
  { label: "Să arăt portofoliul", value: "Portfolio" },
  { label: "Să vând", value: "Sell" },
  { label: "Alt obiectiv", value: "Other" },
];

const pages = [
  { label: "Acasă", value: "Home" },
  { label: "Servicii", value: "Services" },
  { label: "Despre", value: "About" },
  { label: "Prețuri", value: "Pricing" },
  { label: "Portofoliu", value: "Portfolio" },
  { label: "Contact", value: "Contact" },
];

export function ProjectBriefForm({ planId }: { planId: string }) {
  const router = useRouter();
  const submissionKey = useRef<string | null>(null);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const defaults = useMemo<BlueprintFormValues>(() => ({
    identity: {
      businessName: "",
      oneLiner: "",
      whatYouSell: "",
      brandPersonality: ["Friendly"],
    },
    vision: { mainGoal: "Leads", customMainGoal: "" },
    look: {
      references: [],
      colorPreference: [],
      imageryVibe: [],
      assetsNote: "",
      assetUploads: [],
    },
    content: {
      pages: ["Home", "Services", "About", "Contact"],
      ctaDestination: "",
    },
    technical: { domainStatus: "need", currentSite: "", integrations: [] },
    confirmations: { termsAccepted: false },
  }), []);

  const form = useForm<BlueprintFormValues>({
    resolver: zodResolver(blueprintSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const values = watch();
  const stepFields: Record<number, FieldPath<BlueprintFormValues>[]> = {
    0: ["identity.businessName", "identity.whatYouSell", "identity.oneLiner", "identity.brandPersonality"],
    1: ["vision.mainGoal", "vision.customMainGoal", "content.pages", "content.ctaDestination", "technical.domainStatus", "technical.currentSite", "technical.integrations"],
    2: ["look.references", "look.colorPreference", "look.assetsNote", "look.assetUploads"],
    3: ["confirmations.termsAccepted"],
  };

  const next = async () => {
    if (!(await trigger(stepFields[step]))) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        if (!response.ok) throw new Error("upload");
        const result = await response.json();
        uploaded.push(result.url);
      }
      setValue("look.assetUploads", [...(values.look.assetUploads || []), ...uploaded]);
      toast.success(`${uploaded.length} fișier${uploaded.length === 1 ? "" : "e"} încărcat${uploaded.length === 1 ? "" : "e"}.`);
    } catch {
      toast.error("Un fișier nu s-a putut încărca. Verifică formatul și încearcă din nou.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const submit = async (payload: BlueprintFormValues) => {
    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          submissionKey: submissionKey.current || (submissionKey.current = crypto.randomUUID()),
        }),
      });
      if (!response.ok) throw new Error("submit");
      toast.success("Proiectul a fost salvat.");
      router.push(`/project-ready?planId=${encodeURIComponent(planId)}`);
    } catch {
      toast.error("Formularul nu a putut fi trimis. Încearcă din nou.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Pasul {step + 1} din {steps.length}</p>
            <h2 className="text-2xl font-semibold">{steps[step]}</h2>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">aprox. 4 minute în total</span>
        </div>
        <Stepper steps={steps} current={step} />
      </div>

      <form className="space-y-7" onSubmit={handleSubmit(submit)} noValidate>
        {step === 0 && <>
          <Field label="Cum se numește afacerea?" error={errors.identity?.businessName?.message}>
            <Input autoFocus placeholder="Ex: Atelier Luna" {...register("identity.businessName")} />
          </Field>
          <Field label="Ce vinzi sau ce serviciu oferi?" hint="Două-trei propoziții sunt suficiente." error={errors.identity?.whatYouSell?.message}>
            <Textarea rows={4} placeholder="Ex: Mobilier la comandă pentru apartamente și case..." {...register("identity.whatYouSell")} />
          </Field>
          <Field label="Cui te adresezi și de ce te-ar alege?" hint="Opțional, dar ne ajută să scriem un mesaj mai bun.">
            <Textarea rows={3} placeholder="Ex: Lucrez cu proprietari care vor..." {...register("identity.oneLiner")} />
          </Field>
          <Field label="Cum vrei să se simtă brandul?" error={errors.identity?.brandPersonality?.message}>
            <Controller control={control} name="identity.brandPersonality" render={({ field }) => (
              <ChipGroup value={field.value} onChange={field.onChange} options={[
                { label: "Prietenos", value: "Friendly" }, { label: "Premium", value: "Luxury" },
                { label: "Îndrăzneț", value: "Bold" }, { label: "Calm", value: "Calm" },
                { label: "Tehnic", value: "Technical" }, { label: "Creativ", value: "Creative" },
              ]} />
            )} />
          </Field>
        </>}

        {step === 1 && <>
          <Field label="Care este cel mai important rezultat?" error={errors.vision?.mainGoal?.message}>
            <Controller control={control} name="vision.mainGoal" render={({ field }) => (
              <ChipGroup multiple={false} value={[field.value]} onChange={(nextValue) => field.onChange(nextValue[0])} options={goals} />
            )} />
          </Field>
          {values.vision.mainGoal === "Other" && (
            <Field label="Descrie obiectivul" error={errors.vision?.customMainGoal?.message}>
              <Input {...register("vision.customMainGoal")} />
            </Field>
          )}
          <Field label="Ce pagini îți trebuie?" error={errors.content?.pages?.message}>
            <Controller control={control} name="content.pages" render={({ field }) => (
              <ChipGroup value={field.value} onChange={field.onChange} options={pages} />
            )} />
          </Field>
          <Field label="Unde vrei să ajungă cererile clienților?" hint="Telefon, e-mail, WhatsApp sau un link de rezervare." error={errors.content?.ctaDestination?.message}>
            <Input placeholder="Ex: WhatsApp 07xx xxx xxx" {...register("content.ctaDestination")} />
          </Field>
          <Field label="Ai deja un domeniu web?">
            <Controller control={control} name="technical.domainStatus" render={({ field }) => (
              <ChipGroup multiple={false} value={[field.value]} onChange={(nextValue) => field.onChange(nextValue[0])} options={[
                { label: "Da, am domeniu", value: "have" }, { label: "Nu, am nevoie de ajutor", value: "need" },
              ]} />
            )} />
          </Field>
          {values.technical.domainStatus === "have" && (
            <Field label="Adresa site-ului sau domeniului" hint="Opțional." error={errors.technical?.currentSite?.message}>
              <Input placeholder="https://..." {...register("technical.currentSite")} />
            </Field>
          )}
          <Field label="Integrări utile" hint="Opțional.">
            <Controller control={control} name="technical.integrations" render={({ field }) => (
              <ChipGroup value={field.value || []} onChange={field.onChange} options={[
                { label: "WhatsApp", value: "WhatsApp" }, { label: "Rezervări", value: "Bookings" },
                { label: "Newsletter", value: "Newsletter" }, { label: "Analytics", value: "Analytics" },
              ]} />
            )} />
          </Field>
        </>}

        {step === 2 && <>
          <Field label="Alege un model de pornire" hint="Poți lăsa alegerea în grija noastră.">
            <Select value={values.look.references?.[0]?.url || "team-choice"} onValueChange={(url) => {
              const template = templateOptions.find((item) => item.url === url);
              setValue("look.references", template ? [{ url: template.url, notes: `${template.name} (model WebForm)` }] : []);
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="team-choice">Alege echipa WebForm pentru mine</SelectItem>
                {templateOptions.map((template) => <SelectItem key={template.id} value={template.url}>{template.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ai culori de brand?" hint="Adaugă-le doar dacă există deja.">
            <Controller control={control} name="look.colorPreference" render={({ field }) => <MultiColorPicker value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="Încarcă logo-ul și fotografiile" hint="Opțional · JPG, PNG, WebP, GIF sau PDF · maximum 10 MB/fișier">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-5 text-sm font-medium hover:border-primary/60">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Se încarcă..." : "Alege fișiere"}
              <input className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" disabled={uploading} onChange={uploadFiles} />
            </label>
            {!!values.look.assetUploads?.length && <p className="mt-2 text-sm text-green-600"><Check className="mr-1 inline h-4 w-4" />{values.look.assetUploads.length} fișiere încărcate</p>}
          </Field>
          <Field label="Alte indicații" hint="Opțional.">
            <Textarea rows={4} placeholder="Ex: îmi plac site-urile aerisite; am textele pregătite..." {...register("look.assetsNote")} />
          </Field>
        </>}

        {step === 3 && <>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div>
              <h3 className="font-semibold">După trimitere, proiectul este salvat</h3>
              <p className="mt-1 text-sm text-muted-foreground">Vezi cum direcția site-ului începe să prindă contur, apoi activezi planul ales. Imediat după plată intri în chat-ul proiectului.</p>
            </div></div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-border p-5 text-sm sm:grid-cols-2">
            <Summary label="Afacere" value={values.identity.businessName} />
            <Summary label="Obiectiv" value={goals.find((goal) => goal.value === values.vision.mainGoal)?.label || values.vision.mainGoal} />
            <Summary label="Pagini" value={values.content.pages.join(", ")} />
            <Summary label="Fișiere" value={`${values.look.assetUploads?.length || 0} încărcate`} />
          </div>
          <Controller control={control} name="confirmations.termsAccepted" render={({ field }) => (
            <div>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox className="mt-0.5" checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                <span>Sunt de acord cu <a className="text-primary underline" href="/terms" target="_blank" rel="noreferrer">termenii și condițiile</a>.</span>
              </label>
              {errors.confirmations?.termsAccepted && <p className="mt-2 text-sm text-red-500">{errors.confirmations.termsAccepted.message}</p>}
            </div>
          )} />
        </>}

        <div className="flex items-center justify-between border-t border-border pt-6">
          {step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((current) => current - 1)}>Înapoi</Button> : <span />}
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>Continuă</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvează proiectul
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-base">{label}</Label>{hint && <p className="text-sm text-muted-foreground">{hint}</p>}{children}{error && <p className="text-sm text-red-500">{error}</p>}</div>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value || "—"}</p></div>;
}
