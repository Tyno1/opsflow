/** Registration requires MFA within this window. The clock is the sign-in token's `auth_time`. */
export const PASSKEY_MFA_WINDOW_SECONDS = 5 * 60;

export const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

export type PasskeyTokenState = "missing" | "mfa_required" | "stale" | "ready";
