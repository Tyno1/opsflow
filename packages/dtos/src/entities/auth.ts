import type { Schema } from "@/lib/schema.js";

export type RegisterRequest = Schema<"RegisterRequest">;
export type LoginRequest = Schema<"LoginRequest">;
export type ForgotPasswordRequest = Schema<"ForgotPasswordRequest">;
export type ResetPasswordRequest = Schema<"ResetPasswordRequest">;
export type AcceptInviteRequest = Schema<"AcceptInviteRequest">;
export type AuthResponse = Schema<"AuthResponse">;
export type RefreshTokenRequest = Schema<"RefreshTokenRequest">;
export type RefreshTokenResponse = Schema<"RefreshTokenResponse">;
