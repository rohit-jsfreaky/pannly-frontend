/**
 * Tiny sessionStorage helper for the multi-step auth flows.
 *
 * Why sessionStorage:
 *   - The signup_token / reset_token are one-shot, expire in 15 min, and
 *     should never appear in a URL the user might bookmark or share.
 *   - sessionStorage is gone the moment the tab closes — perfect.
 *
 * Why the email is NOT in sessionStorage:
 *   - Refresh-friendliness — we keep email in the URL query so a hard reload
 *     of /signup/verify keeps the form usable. Email isn't sensitive.
 */

type Kind = "signup" | "reset";

const KEY = (kind: Kind) => `pannly:auth:${kind}_token`;

export function saveChallengeToken(kind: Kind, token: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY(kind), token);
  } catch {
    /* SSR / privacy mode — silent fallback; the next step will redirect them
       back to start. */
  }
}

export function readChallengeToken(kind: Kind): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(KEY(kind));
  } catch {
    return null;
  }
}

export function clearChallengeToken(kind: Kind) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY(kind));
  } catch {
    /* swallow */
  }
}
