import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db/schema";
import { requireAuth } from "../middlewares/auth";

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

  if (entries.length === 0) {
    res.json({ updated: 0 });
    return;
  }

  await db
    .insert(siteContentTable)
    .values(entries)
    .onConflictDoUpdate({
      target: siteContentTable.key,
      set: { value: siteContentTable.value, updatedAt: new Date() },
    });

  res.json({ updated: entries.length });
});

export default router;
