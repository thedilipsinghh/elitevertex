import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const aboutPage = pgTable("about_page", {
  id: uuid("id").defaultRandom().primaryKey(),
  headerTitle: text("header_title"),
  headerSubtitle: text("header_subtitle"),
  paradigmTitle: text("paradigm_title"),
  paradigmParagraph1: text("paradigm_paragraph_1"),
  paradigmParagraph2: text("paradigm_paragraph_2"),
  paradigmParagraph3: text("paradigm_paragraph_3"),
  airtimeStat: varchar("airtime_stat", { length: 50 }),
  ratioStat: varchar("ratio_stat", { length: 50 }),
  paradigmImage: text("paradigm_image"),
  visionTitle: text("vision_title"),
  visionBody: text("vision_body"),
  missionTitle: text("mission_title"),
  missionBody: text("mission_body"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
