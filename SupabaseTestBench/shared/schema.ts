import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const records = pgTable("records", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("viewer"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const operationLogs = pgTable("operation_logs", {
  id: serial("id").primaryKey(),
  operation: text("operation").notNull(), // CREATE, READ, UPDATE, DELETE
  status: text("status").notNull(), // success, error
  message: text("message").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const recordsInsertSchema = createInsertSchema(records, {
  name: (schema) => schema.min(1, "Name is required"),
  email: (schema) => schema.email("Please enter a valid email address"),
  role: (schema) => schema.refine(val => ["admin", "editor", "viewer"].includes(val), {
    message: "Role must be admin, editor, or viewer"
  }),
  status: (schema) => schema.refine(val => ["active", "inactive"].includes(val), {
    message: "Status must be active or inactive"
  }),
});

export const operationLogsInsertSchema = createInsertSchema(operationLogs, {
  operation: (schema) => schema.refine(val => ["CREATE", "READ", "UPDATE", "DELETE"].includes(val), {
    message: "Operation must be CREATE, READ, UPDATE, or DELETE"
  }),
  status: (schema) => schema.refine(val => ["success", "error"].includes(val), {
    message: "Status must be success or error"
  }),
});

export type RecordInsert = z.infer<typeof recordsInsertSchema>;
export type Record = typeof records.$inferSelect;

export type OperationLogInsert = z.infer<typeof operationLogsInsertSchema>;
export type OperationLog = typeof operationLogs.$inferSelect;
