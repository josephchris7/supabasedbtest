import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecord } from "@/lib/supabase";
import { Record } from "@shared/schema";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRecordDialogProps {
  record: Record;
  open: boolean;
  onClose: () => void;
}

export default function EditRecordDialog({ record, open, onClose }: EditRecordDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status,
      notes: record.notes || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => updateRecord(record.id, data),
    onSuccess: () => {
      toast({
        title: "Record updated",
        description: "The record was successfully updated.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/operation-logs'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to update record",
        description: error instanceof Error ? error.message : "An error occurred while updating the record.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">Edit Record</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full border border-gray-300 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      className="w-full border border-gray-300 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full border border-gray-300 rounded-md">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="active" id="edit-status-active" className="text-primary" />
                        <Label htmlFor="edit-status-active" className="ml-2 text-sm text-gray-700">
                          Active
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="inactive" id="edit-status-inactive" className="text-primary" />
                        <Label htmlFor="edit-status-inactive" className="ml-2 text-sm text-gray-700">
                          Inactive
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="w-full border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-white hover:bg-blue-700"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
