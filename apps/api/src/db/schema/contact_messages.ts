import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const contactMessageStatusEnum = pgEnum("contact_message_status", ["unread", "read", "replied"]);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 100 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: contactMessageStatusEnum("status").default("unread").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
