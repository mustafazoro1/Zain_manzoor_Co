import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db/schema";
import { requireAuth } from "../middlewares/auth";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/content – public (read all content key-values)
router.get("/content", async (_req, res) => {
  const rows = await db.select().from(siteContentTable);
  // Return as a flat key-value map for easy consumption
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });
  res.json(map);
});

// PUT /api/content – protected (batch upsert key-values)
router.put("/content", requireAuth, async (req, res) => {
  const body = req.body as Record<string, string>;
  if (typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ error: "Body must be an object of key-value pairs" });
    return;
  }

  const entries = Object.entries(body).map(([key, value]) => ({
    key,
    value: String(value),
    updatedAt: new Date(),
  }));

  for (const entry of entries) {
    await db
      .insert(siteContentTable)
      .values(entry)
      .onConflictDoUpdate({
        target: siteContentTable.key,
        set: { value: entry.value, updatedAt: new Date() },
      });
  }

  res.json({ updated: entries.length });
});

// DELETE /api/content/:key – protected (delete a content override)
router.delete("/content/:key", requireAuth, async (req, res) => {
  const { key } = req.params;
  try {
    await db.delete(siteContentTable).where(eq(siteContentTable.key, key));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
