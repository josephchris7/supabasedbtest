import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deleteRecord } from "@/lib/supabase";
import { Record } from "@shared/schema";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  record: Record;
  open: boolean;
  onClose: () => void;
}

export default function DeleteConfirmDialog({ record, open, onClose }: DeleteConfirmDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteRecord(record.id),
    onSuccess: () => {
      toast({
        title: "Record deleted",
        description: `Record "${record.name}" was successfully deleted.`,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/operation-logs'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete record",
        description: error instanceof Error ? error.message : "An error occurred while deleting the record.",
        variant: "destructive",
      });
      onClose();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">Delete Record</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete this record? All of the data will be permanently removed from the database. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
