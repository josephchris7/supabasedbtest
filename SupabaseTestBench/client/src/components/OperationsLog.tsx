import { useQuery } from "@tanstack/react-query";
import { getOperationLogs } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Info, PenLine, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function OperationsLog() {
  const { data: logs, isLoading, isError, error } = useQuery({
    queryKey: ['/api/operation-logs'],
    queryFn: () => getOperationLogs(10),
  });

  const getLogIcon = (operation: string) => {
    switch (operation) {
      case "CREATE":
        return <CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-700" />;
      case "READ":
        return <Info className="h-4 w-4 mt-1 mr-2 text-blue-700" />;
      case "UPDATE":
        return <PenLine className="h-4 w-4 mt-1 mr-2 text-yellow-700" />;
      case "DELETE":
        return <AlertCircle className="h-4 w-4 mt-1 mr-2 text-red-700" />;
      default:
        return <Info className="h-4 w-4 mt-1 mr-2 text-gray-700" />;
    }
  };

  const getLogStyle = (operation: string) => {
    switch (operation) {
      case "CREATE":
        return "bg-green-50 text-green-700";
      case "READ":
        return "bg-blue-50 text-blue-700";
      case "UPDATE":
        return "bg-yellow-50 text-yellow-700";
      case "DELETE":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const formatDateTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Card className="mt-6 bg-white rounded-lg shadow">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Database Operations Log</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-y-auto max-h-48 space-y-2">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="p-2 rounded-md bg-gray-50 flex">
                <Skeleton className="h-4 w-4 mt-1 mr-2" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="p-2 rounded-md bg-red-50 text-red-700">
              Error loading logs: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          ) : logs && logs.length === 0 ? (
            <div className="p-2 rounded-md bg-gray-50 text-gray-700">
              No operation logs found
            </div>
          ) : (
            logs?.map((log) => (
              <div key={log.id} className={`p-2 rounded-md ${getLogStyle(log.operation)} flex items-start`}>
                {getLogIcon(log.operation)}
                <div>
                  <div className="font-medium">{log.operation} operation {log.status}</div>
                  <div className="text-sm">{log.message}</div>
                  <div className={`text-xs ${
                    log.operation === "CREATE" ? "text-green-600" : 
                    log.operation === "READ" ? "text-blue-600" : 
                    log.operation === "UPDATE" ? "text-yellow-600" : 
                    "text-red-600"
                  }`}>
                    {formatDateTime(log.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
