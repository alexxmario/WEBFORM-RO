"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  Controller,
  FieldPath,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  console.log("🔵 BlueprintForm v2.0 - localStorage removed");
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
        customMainGoal: "",
      },
      look: {
        references: [],
        colorPreference: [],
        imageryVibe: [],
        assetsNote: "",
        assetUploads: [],
      },
      content: {
        pages: ["Home", "About", "Services", "Pricing", "Contact"],
        ctaDestination: "",
      },
      technical: {
        domainStatus: "have",
        integrations: [],
        currentSite: "",
      },
      confirmations: {
        termsAccepted: false,
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

  // Log errors whenever they change
  console.log("🔴 Form errors:", errors);
  const assetUploads = watch("look.assetUploads");
  const references = watch("look.references");
  const selectedTemplates = templateOptions.filter((template) =>
    references?.some((ref) => ref.url === template.url),
  );

  const [step, setStep] = useState(0);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [customPageInput, setCustomPageInput] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Generate unique session ID on mount
  useEffect(() => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    setSessionId(id);
    console.log("🔑 Generated session ID:", id);
  }, []);

  const stepFields: Record<number, FieldPath<BlueprintFormValues>[]> = {
    0: [
      "identity.businessName",
      "identity.oneLiner",
      "identity.whatYouSell",
      "identity.brandPersonality",
    ],
    1: [
      "vision.mainGoal",
      "vision.customMainGoal",
    ],
    2: [
      "look.references",
      "look.colorPreference",
      "look.imageryVibe",
      "look.assetsNote",
      "look.assetUploads",
    ],
    3: ["content.pages", "content.ctaDestination"],
    4: ["technical.domainStatus", "technical.currentSite", "technical.integrations"],
    5: ["confirmations.termsAccepted"],
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, blueprintSteps.length - 1));
  };

  const goPrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values: BlueprintFormValues) => {
    console.log("🟢 Form submitted with values:", values);
    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        body: JSON.stringify({ ...values, sessionId }),
      });
      if (!response.ok) {
        console.error("❌ API error:", response.status, await response.text());
        toast.error("Ceva nu a mers bine. Te rugăm să verifici formularul.");
        return;
      }
      toast.success("Blueprint primit. Te vom contacta în 24 de ore.");
      router.push("/thank-you");
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast.error("Trimiterea a eșuat. Te rugăm să încerci din nou.");
    }
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
      toast.success(`${template.name} eliminat din referințele tale`);
      return;
    }

    if (currentRefs.length >= 3) {
      toast.error("Poți alege până la 3 șabloane. Elimină unul pentru a adăuga altul.");
      return;
    }

    const nextRefs = [...currentRefs, templateRef];
    setValue("look.references", nextRefs, { shouldValidate: true });
    toast.success(`${template.name} adăugat la referințele tale`);
  };

  const handleAddCustomPage = (field: { value: string[]; onChange: (value: string[]) => void }) => {
    const trimmedInput = customPageInput.trim();
    if (!trimmedInput) return;

    const currentPages = field.value || [];
    if (currentPages.includes(trimmedInput)) {
      toast.error("Pagina a fost deja adăugată");
      return;
    }

    field.onChange([...currentPages, trimmedInput]);
    setCustomPageInput("");
    toast.success(`${trimmedInput} adăugat`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (!sessionId) {
      toast.error("Sesiunea nu este inițializată. Te rugăm să reîncarci pagina.");
      return;
    }

    setUploadingFiles(true);
    const currentUploads = watch("look.assetUploads") || [];

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", sessionId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setValue("look.assetUploads", [...currentUploads, ...uploadedUrls]);
      toast.success(`${files.length} fișier${files.length > 1 ? 'e' : ''} încărcat${files.length > 1 ? 'e' : ''}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Încărcarea unor fișiere a eșuat");
    } finally {
      setUploadingFiles(false);
      // Reset file input
      event.target.value = "";
    }
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
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("❌ Form validation failed:", errors);
          toast.error("Te rugăm să verifici toate câmpurile obligatorii și confirmările");
        })}
        aria-label="Website Blueprint form"
      >
        {step === 0 && (
          <section className="section space-y-4">
            <Field label="Numele afacerii" error={errors.identity?.businessName?.message}>
              <Input placeholder="Acme Studio" {...register("identity.businessName")} />
            </Field>
            <Field label="Slogan (opțional)" hint='de ex., "Ajutăm antreprenorii ocupați să lanseze aplicații premium de nutriție."' error={errors.identity?.oneLiner?.message}>
              <Input placeholder="Construim site-uri rapide și memorabile." {...register("identity.oneLiner")} />
            </Field>
            <Field label="Ce vinzi?" error={errors.identity?.whatYouSell?.message}>
              <Input placeholder="Serviciu, produs sau ofertă" {...register("identity.whatYouSell")} />
            </Field>
            <Field label="Personalitatea brandului" error={errors.identity?.brandPersonality?.message}>
              <Controller
                control={control}
                name="identity.brandPersonality"
                render={({ field }) => (
                  <ChipGroup
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Prietenos", value: "Friendly" },
                      { label: "Lux", value: "Luxury" },
                      { label: "Îndrăzneț", value: "Bold" },
                      { label: "Calm", value: "Calm" },
                      { label: "Tehnic", value: "Technical" },
                      { label: "Creativ", value: "Creative" },
                    ]}
                  />
                )}
              />
            </Field>
          </section>
        )}

        {step === 1 && (
          <section className="section space-y-4">
            <Field label="Obiectivul principal al website-ului" error={errors.vision?.mainGoal?.message}>
              <Controller
                control={control}
                name="vision.mainGoal"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-label="Main goal">
                      <SelectValue placeholder="Alege un obiectiv" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "Leads", label: "Clienți potențiali" },
                        { value: "Bookings", label: "Rezervări" },
                        { value: "Trust", label: "Încredere" },
                        { value: "Portfolio", label: "Portofoliu" },
                        { value: "Sell", label: "Vânzare" },
                        { value: "Other", label: "Altele" }
                      ].map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            {watch("vision.mainGoal") === "Other" && (
              <Field label="Descrie obiectivul principal" error={errors.vision?.customMainGoal?.message}>
                <Input
                  placeholder="de ex., Creșterea gradului de cunoaștere a brandului, Descărcări aplicație"
                  {...register("vision.customMainGoal")}
                />
              </Field>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="section space-y-4">
            <div className="space-y-3 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm shadow-black/20">
              <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Bibliotecă de șabloane</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTemplates.length
                        ? `${selectedTemplates.length} șablon${selectedTemplates.length > 1 ? 'e' : ''} selectat${selectedTemplates.length > 1 ? 'e' : ''}`
                        : "Alege până la 3 șabloane pentru a-ți inspira designul"}
                    </p>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Deschide biblioteca de șabloane
                    </Button>
                  </DialogTrigger>
                </div>
                <DialogContent className="max-w-screen-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Răsfoiește șabloanele</DialogTitle>
                    <DialogDescription>
                      Selectează orice șablon pentru a-l adăuga la referințele tale. Poți combina până la trei.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {templateOptions.map((template) => {
                      const isSelected = references?.some((ref) => ref.url === template.url);
                      const thumb = template.thumbnail;
                      return (
                        <div
                          key={template.id}
                          className="group relative flex flex-col rounded-2xl border border-border/60 bg-background/80 overflow-hidden shadow-sm transition hover:border-primary/50 hover:shadow-glow"
                        >
                          <div
                            className="w-full aspect-square rounded-t-xl bg-cover bg-center brightness-125 saturate-125"
                            style={{
                              backgroundImage: thumb
                                ? `url(${thumb})`
                                : "radial-gradient(circle at 20% 30%,rgba(156,77,255,0.35),transparent 40%),radial-gradient(circle at 80% 30%,rgba(79,195,255,0.35),transparent 40%),linear-gradient(120deg,rgba(40,50,70,0.6),rgba(20,26,38,0.7))",
                              filter: "brightness(1.45) saturate(1.25)",
                            }}
                          />
                          <div className="flex gap-2 p-3">
                            <Button
                              type="button"
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                applyTemplateReference(template);
                              }}
                              aria-pressed={isSelected}
                            >
                              {isSelected ? "Selectat" : "Selectează"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                window.open(template.preview, "_blank", "noopener,noreferrer")
                              }
                            >
                              Vizualizează
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {selectedTemplates.length > 0 && (
              <div className="space-y-3">
                <Label>Șabloane selectate</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:border-primary/50 hover:shadow-md"
                    >
                      <div
                        className="aspect-square w-full bg-cover bg-center"
                        style={{
                          backgroundImage: template.thumbnail
                            ? `url(${template.thumbnail})`
                            : "radial-gradient(circle at 20% 30%,rgba(156,77,255,0.35),transparent 40%),radial-gradient(circle at 80% 30%,rgba(79,195,255,0.35),transparent 40%),linear-gradient(120deg,rgba(40,50,70,0.6),rgba(20,26,38,0.7))",
                        }}
                      />
                      <div className="p-3">
                        <p className="text-sm font-semibold text-foreground">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 p-0 backdrop-blur-sm"
                        onClick={() => applyTemplateReference(template)}
                        aria-label={`Remove ${template.name}`}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Field label="Preferință culoare" error={errors.look?.colorPreference?.message}>
              <Controller
                control={control}
                name="look.colorPreference"
                render={({ field }) => (
                  <MultiColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
            <Field label="Încarcă fotografii" hint="Adaugă logo-uri, imagini de brand sau fotografii inspiraționale.">
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploadingFiles}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border/60 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground file:transition hover:file:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground">
                {uploadingFiles ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Se încarcă fișierele...
                  </span>
                ) : assetUploads?.length ? (
                  `${assetUploads.length} fișier${assetUploads.length > 1 ? 'e' : ''} încărcat${assetUploads.length > 1 ? 'e' : ''}`
                ) : (
                  "Fișiere JPG, PNG, SVG suportate"
                )}
              </p>
            </Field>
          </section>
        )}

        {step === 3 && (
          <section className="section space-y-4">
            <Field label="Paginile dorite" error={errors.content?.pages?.message}>
              <Controller
                control={control}
                name="content.pages"
                render={({ field }) => {
                  const predefinedPages = [
                    { label: "Acasă", value: "Home" },
                    { label: "Despre", value: "About" },
                    { label: "Servicii", value: "Services" },
                    { label: "Prețuri", value: "Pricing" },
                    { label: "Portofoliu", value: "Portfolio" },
                    { label: "Contact", value: "Contact" },
                    { label: "Rezervare", value: "Book" },
                  ];

                  // Add custom pages to options
                  const customPages = (field.value || [])
                    .filter((page: string) => !predefinedPages.some(p => p.value === page))
                    .map((page: string) => ({ label: page, value: page }));

                  const allPageOptions = [...predefinedPages, ...customPages];

                  return (
                    <>
                      <ChipGroup
                        value={field.value}
                        onChange={field.onChange}
                        options={allPageOptions}
                      />
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Adaugă pagină personalizată (de ex., Blog, Resurse)"
                        value={customPageInput}
                        onChange={(e) => setCustomPageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomPage(field);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddCustomPage(field)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    </>
                  );
                }}
              />
            </Field>
            <Field
              label="Destinația CTA"
              hint="Email, telefon sau link de rezervare."
              error={errors.content?.ctaDestination?.message}
            >
              <Input placeholder="salut@compania-ta.com" {...register("content.ctaDestination")} />
            </Field>
          </section>
        )}

        {step === 4 && (
          <section className="section space-y-4">
            <Field label="Domeniu" error={errors.technical?.domainStatus?.message}>
              <Controller
                control={control}
                name="technical.domainStatus"
                render={({ field }) => (
                  <ChipGroup
                    value={[field.value]}
                    multiple={false}
                    onChange={(val) => field.onChange(val[0] ?? field.value)}
                    options={[
                      { label: "Am un domeniu", value: "have" },
                      { label: "Am nevoie de un domeniu", value: "need" },
                    ]}
                  />
                )}
              />
            </Field>
            <Field
              label="URL site actual (opțional)"
              error={errors.technical?.currentSite?.message}
            >
              <Input placeholder="https://site-actual.com" {...register("technical.currentSite")} />
            </Field>
          </section>
        )}


        {step === 5 && (
          <section className="section space-y-4">
            <Controller
              control={control}
              name="confirmations.termsAccepted"
              render={({ field }) => (
                <CheckboxField
                  label={
                    <>
                      Sunt de acord cu{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        termenii și condițiile
                      </a>
                    </>
                  }
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  error={errors.confirmations?.termsAccepted?.message}
                />
              )}
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
            Înapoi
          </Button>
          {step < blueprintSteps.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Următorul
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Trimite Blueprint-ul
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
  label: string | React.ReactNode;
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
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
