import "server-only";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type ProviderId = "google" | "anthropic" | "openai";

const DEFAULT_MODELS: Record<ProviderId, string> = {
  google: "gemini-3.8-flash",
  anthropic: "claude-sonnet-4-5",
  openai: "gpt-4.1-mini",
};

const KEY_ENV: Record<ProviderId, string> = {
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
};

export function getProviderId(): ProviderId {
  const p = (process.env.AI_PROVIDER ?? "google").toLowerCase();
  return p === "anthropic" || p === "openai" ? p : "google";
}

/** Có cấu hình API key cho provider hiện tại hay không */
export function isAiConfigured(): boolean {
  return Boolean(process.env[KEY_ENV[getProviderId()]]);
}

export function getAiInfo() {
  const provider = getProviderId();
  return {
    provider,
    model: process.env.AI_MODEL || DEFAULT_MODELS[provider],
    configured: isAiConfigured(),
  };
}

/** Trả về model theo AI_PROVIDER / AI_MODEL. Đổi provider chỉ cần sửa .env */
export function getModel(): LanguageModel {
  const { provider, model } = getAiInfo();
  switch (provider) {
    case "anthropic":
      return anthropic(model);
    case "openai":
      return openai(model);
    default:
      return google(model);
  }
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super(`Chưa cấu hình ${KEY_ENV[getProviderId()]} trong .env.local`);
  }
}
