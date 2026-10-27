import "server-only";
import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const g = globalThis as unknown as { _mongoose?: Cache };
const cached: Cache = (g._mongoose ??= { conn: null, promise: null });

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Chưa cấu hình MONGODB_URI trong .env.local");
  }
}

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

/** Kết nối singleton – tránh tạo nhiều kết nối khi hot-reload ở dev */
export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new DbNotConfiguredError();
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
