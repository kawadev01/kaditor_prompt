export interface SavedItem {
  id: string;
  type: "layer8" | "collage";
  title: string;
  input: unknown;
  outputEn?: string;
  outputVi?: string;
  negative?: string;
  json?: string;
  realismScore?: number | null;
  tags?: string[];
  favorite?: boolean;
  createdAt: string;
}

const LOCAL_KEY = "koc_saved_prompts_v1";

export function getLocalSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalPrompt(item: Omit<SavedItem, "id" | "createdAt">): SavedItem {
  const all = getLocalSaved();
  const newItem: SavedItem = {
    ...item,
    id: "local_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    tags: item.tags || [],
    favorite: !!item.favorite,
  };
  all.unshift(newItem);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  }
  return newItem;
}

export function updateLocalPrompt(id: string, updates: Partial<SavedItem>): void {
  const all = getLocalSaved().map((x) => (x.id === id ? { ...x, ...updates } : x));
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  }
}

export function deleteLocalPrompt(id: string): void {
  const all = getLocalSaved().filter((x) => x.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  }
}
