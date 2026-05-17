import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable, insertServiceSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/services  – public
router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable).orderBy(servicesTable.createdAt);
  res.json(services);
});

// GET /api/services/:id – public
router.get("/services/:id", async (req, res) => {
  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, req.params.id))
    .limit(1);

  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});

// POST /api/services – protected
router.post("/services", requireAuth, async (req, res) => {
  const result = insertServiceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  const [created] = await db.insert(servicesTable).values(result.data).returning();
  res.status(201).json(created);
});

// PUT /api/services/:id – protected
router.put("/services/:id", requireAuth, async (req, res) => {
  const result = insertServiceSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  const [updated] = await db
    .update(servicesTable)
    .set(result.data)
    .where(eq(servicesTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(updated);
});

// DELETE /api/services/:id – protected
router.delete("/services/:id", requireAuth, async (req, res) => {
  const deleted = await db
    .delete(servicesTable)
    .where(eq(servicesTable.id, req.params.id))
    .returning();

  if (!deleted.length) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.status(204).send();
});

export default router;
