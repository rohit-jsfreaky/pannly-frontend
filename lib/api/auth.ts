/**
 * Typed wrappers for /v1/auth/*. Mirrors backend/docs/api/auth.md exactly —
 * one function per endpoint, named after the URL path.
 *
 * Pages don't import api-client.ts directly — they go through these so we
 * have a single place to fix if the contract ever changes.
 */

import { apiGet, apiPost } from "@/lib/api-client";

// =================================================================== //
//  Domain types                                                        //
// =================================================================== //

export interface CurrentUser {
  id: string;
  email: string;
  display_name: string | null;
  /** Public R2 URL of the user's avatar; null = no custom avatar (UI shows initial). */
  avatar_url: string | null;
  is_pro: boolean;
  is_admin: boolean;
  email_verified: boolean;
}

export interface MeResponse {
  user: CurrentUser | null;
}

export interface OtpSent {
  sent: boolean;
  expires_in_seconds: number;
}

export interface OtpVerified {
  /** Short-lived one-shot challenge token used on the next step. */
  token: string;
  expires_in_seconds: number;
}

export interface SessionResponse {
  user: CurrentUser;
}

// =================================================================== //
//  Signup (3 steps)                                                    //
// =================================================================== //

export const signupStart = (email: string) =>
  apiPost<OtpSent>("/v1/auth/signup/start", { email });

export const signupVerify = (email: string, code: string) =>
  apiPost<OtpVerified>("/v1/auth/signup/verify", { email, code });

export interface SignupCompleteInput {
  signup_token: string;
  password: string;
  display_name?: string | null;
}
export const signupComplete = (input: SignupCompleteInput) =>
  apiPost<SessionResponse>("/v1/auth/signup/complete", input);

// =================================================================== //
//  Login                                                               //
// =================================================================== //

export const login = (email: string, password: string) =>
  apiPost<SessionResponse>("/v1/auth/login", { email, password });

// =================================================================== //
//  Forgot password (3 steps)                                           //
// =================================================================== //

export const forgotPasswordStart = (email: string) =>
  apiPost<OtpSent>("/v1/auth/forgot-password/start", { email });

export const forgotPasswordVerify = (email: string, code: string) =>
  apiPost<OtpVerified>("/v1/auth/forgot-password/verify", { email, code });

export interface ResetPasswordInput {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}
export const forgotPasswordReset = (input: ResetPasswordInput) =>
  apiPost<SessionResponse>("/v1/auth/forgot-password/reset", input);

// =================================================================== //
//  Utilities                                                           //
// =================================================================== //

export const logout = () => apiPost<{ logged_out: boolean }>("/v1/auth/logout");

export const getMe = () => apiGet<MeResponse>("/v1/auth/me");
