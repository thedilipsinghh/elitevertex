import { pgTable, uuid, varchar, timestamp, date, pgEnum } from "drizzle-orm/pg-core";

export const certificateStatusEnum = pgEnum("certificate_status", ["valid", "revoked"]);

export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificateNumber: varchar("certificate_number", { length: 255 }).notNull().unique(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  courseName: varchar("course_name", { length: 255 }).notNull(),
  issueDate: date("issue_date").notNull(),
  status: certificateStatusEnum("status").default("valid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
