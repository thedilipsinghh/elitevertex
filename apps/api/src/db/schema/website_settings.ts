import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const websiteSettings = pgTable("website_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteName: varchar("institute_name", { length: 255 }),
  heroTagline: text("hero_tagline"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImage: text("hero_image"),
  callToActionTitle: text("cta_title"),
  callToActionSubtitle: text("cta_subtitle"),
  phone: varchar("phone", { length: 100 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  googleMapsUrl: text("google_maps_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  footerText: text("footer_text"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
