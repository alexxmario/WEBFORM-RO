export const META_PIXEL_ID = "1562676298357841";
export const META_CONSENT_KEY = "webform-meta-consent-v1";
let started = false;
let lastPath: string | null = null;
const leads = new Set<string>();

export function hasMetaConsent() {
  try {
    return localStorage.getItem(META_CONSENT_KEY) === "yes";
  } catch {
    return false;
  }
}

export function trackMetaPageView(path: string) {
  if (!hasMetaConsent()) return;
  if (!started) {
    const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;
    // Disable automatically inferred events and form matching.
    fbq("set", "autoConfig", false, META_PIXEL_ID);
    fbq("consent", "grant");
    fbq("init", META_PIXEL_ID);
    const script = document.createElement("script");
    script.id = "meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    started = true;
  }
  if (lastPath === path) return;
  lastPath = path;
  window.fbq?.("track", "PageView");
}

export function trackMetaLead(eventId: string, fields: { name: string; phone: string; city: string; email?: string }) {
  if (!hasMetaConsent() || !started || leads.has(eventId)) return;
  const normalize = (value: string) => value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const names = normalize(fields.name).split(/\s+/);
  const matching = {
    fn: names[0],
    ...(names.length > 1 ? { ln: names.slice(1).join(" ") } : {}),
    ph: fields.phone.replace(/\D/g, ""),
    ct: normalize(fields.city).replace(/[^a-z]/g, ""),
    ...(fields.email ? { em: fields.email.trim().toLowerCase() } : {}),
  };
  // Add manually supplied matching data to the initially anonymous pixel.
  window.fbq?.("init", META_PIXEL_ID, matching);
  leads.add(eventId);
  window.fbq?.("track", "Lead", {}, { eventID: eventId });
}

export function saveMetaConsent(accepted: boolean) {
  localStorage.setItem(META_CONSENT_KEY, accepted ? "yes" : "no");
  if (!accepted && started) {
    window.fbq?.("consent", "revoke");
    if (window.fbq?.queue) window.fbq.queue.length = 0;
    // Unload the third-party runtime after withdrawal, including pending hooks.
    window.location.reload();
  }
}

declare global {
  interface Window {
    _fbq?: Window["fbq"];
  }
}
