import { apiRequest } from "./queryClient";
import type { Record, RecordInsert, OperationLog } from "@shared/schema";

// API functions for records
export async function getRecords(): Promise<Record[]> {
  const response = await fetch('/api/records', {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  
  return response.json();
}

export async function getRecordById(id: number): Promise<Record> {
  const response = await fetch(`/api/records/${id}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  
  return response.json();
}

export async function createRecord(record: RecordInsert): Promise<Record> {
  const response = await apiRequest('POST', '/api/records', record);
  return response.json();
}

export async function updateRecord(id: number, record: Partial<RecordInsert>): Promise<Record> {
  const response = await apiRequest('PUT', `/api/records/${id}`, record);
  return response.json();
}

export async function deleteRecord(id: number): Promise<{ success: boolean; message: string }> {
  const response = await apiRequest('DELETE', `/api/records/${id}`);
  return response.json();
}

// API functions for operation logs
export async function getOperationLogs(limit: number = 10): Promise<OperationLog[]> {
  const response = await fetch(`/api/operation-logs?limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  
  return response.json();
}
