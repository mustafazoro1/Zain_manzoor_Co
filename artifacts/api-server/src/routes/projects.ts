import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, insertProjectSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/projects  – public, no auth needed
router.get("/projects", async (_req, res) => {
  const projects = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);
  res.json(projects);
});

// GET /api/projects/:id – public
router.get("/projects/:id", async (req, res) => {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, req.params.id))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

// POST /api/projects – protected
router.post("/projects", requireAuth, async (req, res) => {
  const result = insertProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [created] = await db.insert(projectsTable).values(result.data).returning();
  res.status(201).json(created);
});

// PUT /api/projects/:id – protected
router.put("/projects/:id", requireAuth, async (req, res) => {
  const result = insertProjectSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [updated] = await db
    .update(projectsTable)
    .set(result.data)
    .where(eq(projectsTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(updated);
});

// DELETE /api/projects/:id – protected
router.delete("/projects/:id", requireAuth, async (req, res) => {
  const deleted = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, req.params.id))
    .returning();

  if (!deleted.length) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.status(204).send();
});

export default router;
