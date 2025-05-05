import { useQueryClient } from "@tanstack/react-query";
import ConnectionStatus from "@/components/ConnectionStatus";
import RecordForm from "@/components/RecordForm";
import RecordsTable from "@/components/RecordsTable";
import OperationsLog from "@/components/OperationsLog";

export default function DatabaseTesting() {
  const queryClient = useQueryClient();

  return (
    <div className="max-w-7xl mx-auto">
      <ConnectionStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecordForm />
        </div>
        <div className="lg:col-span-2">
          <RecordsTable />
        </div>
      </div>
      
      <OperationsLog />
    </div>
  );
}
