import { connectDb, isDbConfigured } from "@/lib/db/mongoose";
import { SavedPrompt } from "@/models/SavedPrompt";
import { handleError, jsonError } from "@/lib/api";
import { z } from "zod";

const CreatePromptSchema = z.object({
  type: z.enum(["layer8", "collage"]),
  title: z.string().min(1).max(200),
  input: z.unknown(),
  outputEn: z.string().optional().default(""),
  outputVi: z.string().optional().default(""),
  negative: z.string().optional().default(""),
  json: z.string().optional().default(""),
  realismScore: z.number().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  favorite: z.boolean().optional().default(false),
});

export async function GET(req: Request) {
  try {
    if (!isDbConfigured()) {
      return jsonError("MongoDB chưa được cấu hình. Bạn có thể lưu tạm trong trình duyệt.", 503, {
        code: "DB_NOT_CONFIGURED",
      });
    }

    await connectDb();
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const favorite = url.searchParams.get("favorite");
    const q = url.searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (favorite === "true") filter.favorite = true;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { outputEn: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    const items = await SavedPrompt.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return Response.json({ items });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    if (!isDbConfigured()) {
      return jsonError("MongoDB chưa được cấu hình.", 503, { code: "DB_NOT_CONFIGURED" });
    }

    await connectDb();
    const body = CreatePromptSchema.parse(await req.json());
    const doc = await SavedPrompt.create(body);
    return Response.json({ item: doc }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
