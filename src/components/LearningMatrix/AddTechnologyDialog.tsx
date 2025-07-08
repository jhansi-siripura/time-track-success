
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  technology_name: z.string().min(1, 'Technology name is required'),
  description: z.string().optional(),
  priority_category: z.enum(['job-critical', 'important-not-urgent', 'curious-emerging', 'nice-to-know']),
  urgency_level: z.enum(['high', 'medium', 'low']).optional(),
  estimated_hours: z.string().optional(),
  expected_roi: z.enum(['high', 'medium', 'low', 'unknown']).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddTechnologyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTechnologyDialog = ({ isOpen, onClose, onSuccess }: AddTechnologyDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technology_name: '',
      description: '',
      priority_category: 'important-not-urgent',
      urgency_level: 'medium',
      estimated_hours: '',
      expected_roi: 'unknown',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        user_id: user.id,
        technology_name: data.technology_name,
        description: data.description || null,
        priority_category: data.priority_category,
        urgency_level: data.urgency_level || null,
        estimated_hours: data.estimated_hours ? parseFloat(data.estimated_hours) : null,
        expected_roi: data.expected_roi || null,
      };

      const { error } = await supabase
        .from('learning_matrix_unknown')
        .insert([insertData]);

      if (error) throw error;

      toast.success('Technology added to learning matrix');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding technology:', error);
      toast.error('Failed to add technology');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Technology to Learn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="technology_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React, Python, Docker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why do you want to learn this?"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="job-critical">Job Critical</SelectItem>
                      <SelectItem value="important-not-urgent">Important but Not Urgent</SelectItem>
                      <SelectItem value="curious-emerging">Curious & Emerging</SelectItem>
                      <SelectItem value="nice-to-know">Nice to Know</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="urgency_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="40"
                        min="0"
                        step="0.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expected_roi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected ROI</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Technology'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnologyDialog;
