import "server-only";
import { z } from "zod";
import { AiNotConfiguredError } from "./ai/provider";
import { DbNotConfiguredError } from "./db/mongoose";

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return Response.json({ error: message, ...extra }, { status });
}

/** Chuyển lỗi thường gặp → response tiếng Việt */
export function handleError(e: unknown) {
  if (e instanceof z.ZodError) {
    return jsonError("Dữ liệu không hợp lệ", 422, { issues: e.issues });
  }
  if (e instanceof AiNotConfiguredError) return jsonError(e.message, 503, { code: "AI_NOT_CONFIGURED" });
  if (e instanceof DbNotConfiguredError) return jsonError(e.message, 503, { code: "DB_NOT_CONFIGURED" });
  const msg = e instanceof Error ? e.message : String(e);
  if (/ECONNREFUSED|Server selection timed out|querySrv/i.test(msg)) {
    return jsonError("Không kết nối được MongoDB. Kiểm tra MONGODB_URI hoặc MongoDB đã chạy chưa.", 503, {
      code: "DB_UNAVAILABLE",
    });
  }
  console.error(e);
  return jsonError(msg || "Lỗi máy chủ", 500);
}
