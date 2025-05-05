import { db } from "@db";
import { records, operationLogs, type Record, type OperationLog } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export const storage = {
  // Records operations
  async getRecords(): Promise<Record[]> {
    return await db.query.records.findMany({
      orderBy: desc(records.createdAt)
    });
  },

  async getRecordById(id: number): Promise<Record | null> {
    const results = await db.query.records.findMany({
      where: eq(records.id, id),
      limit: 1
    });
    return results.length > 0 ? results[0] : null;
  },

  async insertRecord(record: Omit<Record, "id" | "createdAt" | "updatedAt">): Promise<Record> {
    const result = await db.insert(records).values(record).returning();
    return result[0];
  },

  async updateRecord(id: number, record: Partial<Omit<Record, "id" | "createdAt" | "updatedAt">>): Promise<Record | null> {
    const result = await db.update(records)
      .set({ ...record, updatedAt: new Date() })
      .where(eq(records.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  },

  async deleteRecord(id: number): Promise<boolean> {
    const result = await db.delete(records)
      .where(eq(records.id, id))
      .returning();
    
    return result.length > 0;
  },

  // Operation logs operations
  async getOperationLogs(limit: number = 10): Promise<OperationLog[]> {
    return await db.query.operationLogs.findMany({
      orderBy: desc(operationLogs.timestamp),
      limit
    });
  },

  async insertOperationLog(log: Omit<OperationLog, "id" | "timestamp">): Promise<OperationLog> {
    const result = await db.insert(operationLogs).values(log).returning();
    return result[0];
  }
};
