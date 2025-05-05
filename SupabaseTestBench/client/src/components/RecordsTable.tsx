import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Search, RefreshCw } from "lucide-react";
import { Record } from "@shared/schema";
import EditRecordDialog from "./EditRecordDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function RecordsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Record | null>(null);
  
  const { data: records, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['/api/records'],
    queryFn: getRecords,
  });

  const filteredRecords = records?.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    record.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
  };

  const handleDelete = (record: Record) => {
    setDeletingRecord(record);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <Card className="bg-white rounded-lg shadow">
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900">Database Records</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              className="bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-red-500">
                    Error loading records: {error instanceof Error ? error.message : "Unknown error"}
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    {searchQuery ? "No records match your search" : "No records found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.email}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {record.role.charAt(0).toUpperCase() + record.role.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(record)}
                          className="text-primary hover:text-blue-700 p-0 h-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(record)}
                          className="text-red-500 hover:text-red-700 p-0 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {records && records.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRecords.length}</span> of <span className="font-medium">{records.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {editingRecord && (
        <EditRecordDialog
          record={editingRecord}
          open={!!editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {deletingRecord && (
        <DeleteConfirmDialog
          record={deletingRecord}
          open={!!deletingRecord}
          onClose={() => setDeletingRecord(null)}
        />
      )}
    </>
  );
}
