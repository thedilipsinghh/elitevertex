import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const galleryItems = pgTable("gallery_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: varchar("category", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image").notNull(),
  tag: varchar("tag", { length: 255 }),
  location: varchar("location", { length: 255 }),
  subLocation: varchar("sub_location", { length: 255 }),
  gridSpan: varchar("grid_span", { length: 100 }),
  aspectRatio: varchar("aspect_ratio", { length: 100 }),
  tagClass: varchar("tag_class", { length: 255 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
