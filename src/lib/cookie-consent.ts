export const COOKIE_CONSENT_KEY = "pc-barbershop-cookie-consent";
export const COOKIE_CONSENT_EVENT = "pc-cookie-consent-change";
export const COOKIE_SETTINGS_EVENT = "pc-open-cookie-settings";

export type CookieConsentValue = "accepted" | "declined";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
