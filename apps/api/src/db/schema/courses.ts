import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";

export const courseStatusEnum = pgEnum("course_status", ["active", "draft"]);

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  image: text("image"),
  price: integer("price"),
  duration: varchar("duration", { length: 100 }),
  level: varchar("level", { length: 100 }), // Used as subtitle / CEFR level
  category: varchar("category", { length: 100 }).notNull(), // 'spoken', 'career', 'professional'
  badge: varchar("badge", { length: 100 }), // e.g., 'Foundation', 'Placement Prep'
  isFeatured: boolean("is_featured").default(false).notNull(),
  format: varchar("format", { length: 100 }), // e.g., 'Campus & Hybrid'
  cohortCap: varchar("cohort_cap", { length: 100 }), // e.g., '12 Fellows Max'
  sortOrder: integer("sort_order").default(0).notNull(),
  status: courseStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseModules = pgTable("course_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
