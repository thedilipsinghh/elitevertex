import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const navigationMenus = pgTable("navigation_menus", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 100 }).notNull().unique(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const navigationItems = pgTable("navigation_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  menuId: uuid("menu_id")
    .references(() => navigationMenus.id, { onDelete: "cascade" })
    .notNull(),
  parentId: uuid("parent_id"),
  label: varchar("label", { length: 255 }).notNull(),
  url: text("url").notNull(),
  position: integer("position").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  openInNewTab: boolean("open_in_new_tab").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const navigationMenusRelations = relations(navigationMenus, ({ many }) => ({
  items: many(navigationItems),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  menu: one(navigationMenus, {
    fields: [navigationItems.menuId],
    references: [navigationMenus.id],
  }),
  children: many(navigationItems, { relationName: "navChildren" }),
}));
