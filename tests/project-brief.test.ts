import { expect, it } from "vitest";
import { projectBriefSchema, projectBriefPayloadSchema } from "@/lib/project-brief";
const brief = { businessName: " Atelier Luna ", offering: "Mobilier la comandă", audience: "București și Ilfov", goal: "Cereri de ofertă", contact: "contact@example.test", termsAccepted: true };
it("accepts only essential answers and preserves them for the admin", () => {
  const data = projectBriefPayloadSchema.parse(brief);
  expect(data.identity.businessName).toBe("Atelier Luna");
  expect(data.identity.oneLiner).toBe(brief.audience);
  expect(data.vision.customMainGoal).toBe(brief.goal);
  expect(data.content.ctaDestination).toBe(brief.contact);
  expect(data.look.references).toEqual([]);
  expect(data.content.pages).toEqual([]);
  expect(data.identity.brandPersonality).toEqual([]);
  expect(data.technical.domainStatus).toBeNull();
});
it.each(["businessName", "offering", "audience", "goal", "contact"])("rejects blank required answer %s", field => {
  expect(projectBriefSchema.safeParse({ ...brief, [field]: "   " }).success).toBe(false);
});
it("requires explicit acceptance", () => {
  expect(projectBriefSchema.safeParse({ ...brief, termsAccepted: false }).success).toBe(false);
});
it("preserves optional links and notes without treating social links as an owned domain", () => {
  const data = projectBriefPayloadSchema.parse({ ...brief, existingPresence: "instagram.com/atelier", notes: "Avem logo." });
  expect(data.look.assetsNote).toContain("instagram.com/atelier");
  expect(data.look.assetsNote).toContain("Avem logo.");
  expect(data.brief.notes).toBe("Avem logo.");
  expect(data.technical.domainStatus).toBeNull();
});
