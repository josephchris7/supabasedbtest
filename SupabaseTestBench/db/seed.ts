import { db } from "./index";
import { records, operationLogs } from "@shared/schema";

async function seed() {
  try {
    // Check if we already have records
    const existingRecords = await db.query.records.findMany();
    
    if (existingRecords.length === 0) {
      console.log("Seeding database with initial records...");
      
      // Seed records
      await db.insert(records).values([
        {
          name: "Jane Cooper",
          email: "jane.cooper@example.com",
          role: "admin",
          status: "active",
          notes: "Manager for the sales team. Joined January 2023.",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "John Smith",
          email: "john.smith@example.com",
          role: "editor",
          status: "active",
          notes: "Content writer for marketing department.",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Robert Johnson",
          email: "robert@example.com",
          role: "viewer",
          status: "inactive",
          notes: "Former consultant, account deactivated.",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      // Seed operation logs
      await db.insert(operationLogs).values([
        {
          operation: "CREATE",
          status: "success",
          message: "CREATE operation successful",
          details: "Added user 'Jane Cooper' to database (ID: 1)",
          timestamp: new Date(Date.now() - 5 * 60000) // 5 minutes ago
        },
        {
          operation: "READ",
          status: "success",
          message: "READ operation successful",
          details: "Retrieved 3 records from 'users' table",
          timestamp: new Date(Date.now() - 6 * 60000) // 6 minutes ago
        },
        {
          operation: "UPDATE",
          status: "success",
          message: "UPDATE operation successful",
          details: "Updated user 'John Smith' (ID: 2)",
          timestamp: new Date(Date.now() - 60000 * 60 * 24) // 1 day ago
        },
        {
          operation: "DELETE",
          status: "success",
          message: "DELETE operation successful",
          details: "Removed user 'Alice Brown' (ID: 4)",
          timestamp: new Date(Date.now() - 60000 * 60 * 24 - 30 * 60000) // 1 day and 30 minutes ago
        }
      ]);
      
      console.log("Database seeded successfully!");
    } else {
      console.log(`Database already contains ${existingRecords.length} records. Skipping seed.`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
