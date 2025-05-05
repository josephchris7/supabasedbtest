import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recordsInsertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for records
  app.get("/api/records", async (req, res) => {
    try {
      const records = await storage.getRecords();
      
      // Log the operation
      await storage.insertOperationLog({
        operation: "READ",
        status: "success",
        message: "Retrieved records from database",
        details: `Retrieved ${records.length} records from the database`
      });
      
      return res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching records:", error);
      
      // Log the error
      await storage.insertOperationLog({
        operation: "READ",
        status: "error",
        message: "Failed to retrieve records",
        details: error instanceof Error ? error.message : String(error)
      });
      
      return res.status(500).json({ error: "Failed to fetch records" });
    }
  });

  app.get("/api/records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }
      
      const record = await storage.getRecordById(id);
      
      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }
      
      // Log the operation
      await storage.insertOperationLog({
        operation: "READ",
        status: "success",
        message: "Retrieved record from database",
        details: `Retrieved record with ID: ${id}`
      });
      
      return res.status(200).json(record);
    } catch (error) {
      console.error("Error fetching record:", error);
      
      // Log the error
      await storage.insertOperationLog({
        operation: "READ",
        status: "error",
        message: "Failed to retrieve record",
        details: error instanceof Error ? error.message : String(error)
      });
      
      return res.status(500).json({ error: "Failed to fetch record" });
    }
  });

  app.post("/api/records", async (req, res) => {
    try {
      const validatedData = recordsInsertSchema.parse(req.body);
      
      const record = await storage.insertRecord(validatedData);
      
      // Log the operation
      await storage.insertOperationLog({
        operation: "CREATE",
        status: "success",
        message: "Added new record to database",
        details: `Added record with ID: ${record.id}, Name: ${record.name}`
      });
      
      return res.status(201).json(record);
    } catch (error) {
      console.error("Error creating record:", error);
      
      let errorMessage = "Failed to create record";
      let errorDetails = "";
      
      if (error instanceof z.ZodError) {
        errorMessage = "Validation error";
        errorDetails = JSON.stringify(error.errors);
        return res.status(400).json({ error: errorMessage, details: error.errors });
      }
      
      // Log the error
      await storage.insertOperationLog({
        operation: "CREATE",
        status: "error",
        message: errorMessage,
        details: errorDetails || (error instanceof Error ? error.message : String(error))
      });
      
      return res.status(500).json({ error: "Failed to create record" });
    }
  });

  app.put("/api/records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }
      
      // Partial validation for update
      const validatedData = recordsInsertSchema.partial().parse(req.body);
      
      const updatedRecord = await storage.updateRecord(id, validatedData);
      
      if (!updatedRecord) {
        return res.status(404).json({ error: "Record not found" });
      }
      
      // Log the operation
      await storage.insertOperationLog({
        operation: "UPDATE",
        status: "success",
        message: "Updated record in database",
        details: `Updated record with ID: ${id}, Name: ${updatedRecord.name}`
      });
      
      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error("Error updating record:", error);
      
      let errorMessage = "Failed to update record";
      let errorDetails = "";
      
      if (error instanceof z.ZodError) {
        errorMessage = "Validation error";
        errorDetails = JSON.stringify(error.errors);
        return res.status(400).json({ error: errorMessage, details: error.errors });
      }
      
      // Log the error
      await storage.insertOperationLog({
        operation: "UPDATE",
        status: "error",
        message: errorMessage,
        details: errorDetails || (error instanceof Error ? error.message : String(error))
      });
      
      return res.status(500).json({ error: "Failed to update record" });
    }
  });

  app.delete("/api/records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }
      
      // Get the record before deleting it for logging
      const record = await storage.getRecordById(id);
      
      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }
      
      const deleted = await storage.deleteRecord(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Record not found" });
      }
      
      // Log the operation
      await storage.insertOperationLog({
        operation: "DELETE",
        status: "success",
        message: "Deleted record from database",
        details: `Deleted record with ID: ${id}, Name: ${record.name}`
      });
      
      return res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
      console.error("Error deleting record:", error);
      
      // Log the error
      await storage.insertOperationLog({
        operation: "DELETE",
        status: "error",
        message: "Failed to delete record",
        details: error instanceof Error ? error.message : String(error)
      });
      
      return res.status(500).json({ error: "Failed to delete record" });
    }
  });

  // Get operation logs
  app.get("/api/operation-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const logs = await storage.getOperationLogs(limit);
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching operation logs:", error);
      return res.status(500).json({ error: "Failed to fetch operation logs" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
