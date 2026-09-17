import { requireAdmin } from "@/lib/admin";
import { CampaignAdmin } from "./workspace";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Lead-uri campanie | WebForm",
  robots: { index: false, follow: false },
};
export default async function Page() {
  await requireAdmin();
  return <CampaignAdmin />;
}
