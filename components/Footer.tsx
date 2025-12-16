import Link from "next/link";

const footerNavLeft = [
  { label: "Prețuri", href: "/pricing" },
  { label: "Listă de așteptare", href: "/waitlist" },
  { label: "Blueprint", href: "/start" },
];

const footerNavRight = [
  { label: "Despre", href: "/about" },
  { label: "Întrebări frecvente", href: "/faq" },
  { label: "Suport", href: "/support" },
  { label: "Confidențialitate", href: "/legal/privacy" },
  { label: "Termeni", href: "/legal/terms" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden text-white bg-[#050505] border-neutral-800 border-t pt-24">
      <div
        className="text-center w-full mb-20 pr-4 pl-4"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
        }}
      >
        <h1 className="text-[16vw] leading-[0.7] select-none font-bold text-[#141414] tracking-tighter mix-blend-screen scale-y-110">
          WEBFORM
        </h1>
      </div>
      <div className="border-t border-neutral-900 grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-16 grid grid-cols-2 gap-12 border-r border-neutral-900">
          <div className="flex flex-col gap-6">
            {footerNavLeft.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {footerNavRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:h-auto lg:border-t-0 flex overflow-hidden w-full h-48 border-neutral-900 border-t relative items-center justify-center">
          <div className="flex items-center justify-center opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" className="text-white" aria-hidden="true" role="img">
              <path fill="currentColor" d="m13.792 21.319l-.597 1.008c-.531.897-1.859.897-2.39 0l-.597-1.008c-.462-.781-.693-1.172-1.065-1.388c-.371-.216-.84-.224-1.774-.24c-1.381-.024-2.247-.109-2.974-.41a5.5 5.5 0 0 1-2.976-2.976C1 15.294 1 14.013 1 11.45v-1.1c0-3.6 0-5.401.81-6.724A5.5 5.5 0 0 1 3.626 1.81C4.95 1 6.75 1 10.35 1h3.3c3.6 0 5.401 0 6.724.81a5.5 5.5 0 0 1 1.816 1.816C23 4.95 23 6.75 23 10.35v1.1c0 2.563 0 3.844-.419 4.855a5.5 5.5 0 0 1-2.976 2.976c-.727.301-1.593.386-2.974.41c-.935.016-1.403.024-1.774.24c-.372.216-.603.607-1.065 1.388" opacity=".5"></path>
              <path fill="currentColor" fillRule="evenodd" d="M15.267 6.83a.825.825 0 0 1 1.167 0l.188.188l.04.04c.7.7 1.283 1.282 1.683 1.807c.423.554.72 1.14.72 1.848s-.297 1.294-.72 1.848c-.4.524-.983 1.107-1.682 1.806l-.23.23a.825.825 0 0 1-1.166-1.167l.189-.19c.75-.749 1.252-1.254 1.577-1.68c.31-.407.381-.644.381-.847s-.07-.44-.38-.847c-.326-.426-.828-.931-1.578-1.681l-.189-.189a.825.825 0 0 1 0-1.166m-1.63-2.226c.44.118.701.57.583 1.01L11.373 16.24a.825.825 0 1 1-1.594-.427l2.847-10.625a.825.825 0 0 1 1.01-.584M8.733 6.83a.825.825 0 0 0-1.167 0l-.188.188l-.04.04c-.7.7-1.283 1.282-1.683 1.807c-.423.554-.72 1.14-.72 1.848s.297 1.294.72 1.848c.4.524.983 1.107 1.682 1.806l.23.23a.825.825 0 0 0 1.166-1.167l-.189-.19c-.75-.749-1.252-1.254-1.577-1.68c-.31-.407-.381-.644-.381-.847s.07-.44.38-.847c.326-.426.828-.931 1.578-1.681l.189-.189a.825.825 0 0 0 0-1.166" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 border-t border-neutral-900 pt-4 px-8 text-sm text-neutral-500 text-center pb-8">
        © {new Date().getFullYear()} WebForm. All rights reserved.
      </div>
    </footer>
  );
}
