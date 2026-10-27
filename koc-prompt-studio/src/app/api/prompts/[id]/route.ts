import { connectDb, isDbConfigured } from "@/lib/db/mongoose";
import { SavedPrompt } from "@/models/SavedPrompt";
import { handleError, jsonError } from "@/lib/api";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDbConfigured()) {
      return jsonError("MongoDB chưa được cấu hình.", 503, { code: "DB_NOT_CONFIGURED" });
    }
    const { id } = await params;
    await connectDb();
    const res = await SavedPrompt.findByIdAndDelete(id);
    if (!res) return jsonError("Không tìm thấy prompt", 404);
    return Response.json({ success: true, id });
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDbConfigured()) {
      return jsonError("MongoDB chưa được cấu hình.", 503, { code: "DB_NOT_CONFIGURED" });
    }
    const { id } = await params;
    const body = UpdateSchema.parse(await req.json());
    await connectDb();
    const updated = await SavedPrompt.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) return jsonError("Không tìm thấy prompt", 404);
    return Response.json({ item: updated });
  } catch (e) {
    return handleError(e);
  }
}
