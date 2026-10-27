import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SavedPromptSchema = new Schema(
  {
    type: { type: String, enum: ["layer8", "collage"], required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    /** State form để mở lại & chỉnh sửa */
    input: { type: Schema.Types.Mixed, required: true },
    outputEn: { type: String, default: "" },
    outputVi: { type: String, default: "" },
    negative: { type: String, default: "" },
    json: { type: String, default: "" },
    realismScore: { type: Number, default: null },
    tags: { type: [String], default: [], index: true },
    favorite: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

SavedPromptSchema.index({ title: "text", outputEn: "text", tags: "text" });

export type SavedPromptDoc = InferSchemaType<typeof SavedPromptSchema> & { _id: mongoose.Types.ObjectId };

export const SavedPrompt: Model<InferSchemaType<typeof SavedPromptSchema>> =
  mongoose.models.SavedPrompt || mongoose.model("SavedPrompt", SavedPromptSchema);
