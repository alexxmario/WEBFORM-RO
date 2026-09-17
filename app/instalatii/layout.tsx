import "./campaign.css";
export const metadata = {
  title: "Site pentru instalatori | WebForm",
  alternates: { canonical: null, languages: {} },
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
