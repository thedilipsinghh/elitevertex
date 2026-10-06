import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const mentors = pgTable("mentors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  quote: text("quote"),
  profileImage: text("profile_image"),
  experience: varchar("experience", { length: 100 }),
  specialization: varchar("specialization", { length: 255 }),
  accreditation: varchar("accreditation", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
