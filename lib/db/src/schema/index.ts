import { pgTable, text, serial, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users / Admins Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site Content (Key-Value store for inline editing and AI text)
export const siteContentTable = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects Table
export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey(), // Using text IDs like "p1", "p2" to match frontend for now, or we can use UUIDs. Using text for easy migration.
  title: text("title").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(), // completed, in-progress, upcoming
  year: text("year").notNull(),
  image: text("image").notNull(), // URL or import path string
  description: text("description").notNull(),
  employer: text("employer"),
  contractValue: text("contract_value"),
  executedValue: text("executed_value"),
  awarded: text("awarded"),
  completed: text("completed"),
  scope: text("scope"),
  gallery: jsonb("gallery").$type<string[]>(), // Array of image URLs/paths
  serviceIds: jsonb("service_ids").$type<string[]>(), // Array of associated service IDs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services Table
export const servicesTable = pgTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  capabilities: jsonb("capabilities").$type<string[]>(),
  process: jsonb("process").$type<{step: number, title: string, description: string}[]>(),
  benefits: jsonb("benefits").$type<string[]>(),
  icon: text("icon").notNull(), // Lucide icon name
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const insertSiteContentSchema = createInsertSchema(siteContentTable).omit({ updatedAt: true });
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContentTable.$inferSelect;

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;