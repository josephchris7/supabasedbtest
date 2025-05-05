import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "@/lib/supabase";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecordForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      status: "active",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      toast({
        title: "Record created",
        description: "The record was successfully created.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/operation-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create record",
        description: error instanceof Error ? error.message : "An error occurred while creating the record.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Add New Record</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md">
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
                        <RadioGroupItem value="active" id="active" className="text-primary" />
                        <Label htmlFor="active" className="ml-2 text-sm text-gray-700">
                          Active
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="inactive" id="inactive" className="text-primary" />
                        <Label htmlFor="inactive" className="ml-2 text-sm text-gray-700">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
