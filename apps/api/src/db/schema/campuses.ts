import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const campuses = pgTable("campuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  landmark: text("landmark"),
  metroAccess: text("metro_access"),
  parkingInfo: text("parking_info"),
  mapUrl: text("map_url"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
