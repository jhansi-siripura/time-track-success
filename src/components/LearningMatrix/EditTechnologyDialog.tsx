
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface EditSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology: LearningMatrixUnknown;
  onSuccess: () => void;
}

const EditSubjectDialog: React.FC<EditSubjectDialogProps> = ({
  open,
  onOpenChange,
  technology,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject_name: '',
    topic_name: '',
    priority_category: 'important-not-urgent',
    estimated_hours: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (technology) {
      setFormData({
        subject_name: technology.subject_name,
        topic_name: technology.topic_name || '',
        priority_category: technology.priority_category,
        estimated_hours: technology.estimated_hours?.toString() || ''
      });
    }
  }, [technology]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('learning_matrix_unknown')
        .update({
          subject_name: formData.subject_name,
          topic_name: formData.topic_name || null,
          priority_category: formData.priority_category as any,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', technology.id);

      if (error) throw error;

      toast({
        title: 'Subject updated',
        description: `${formData.subject_name} has been updated in your learning matrix.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subject. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject_name">Subject</Label>
            <Input
              id="subject_name"
              value={formData.subject_name}
              onChange={(e) => handleInputChange('subject_name', e.target.value)}
              placeholder="e.g., React, Python, Machine Learning"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic_name">Topic (Optional)</Label>
            <Input
              id="topic_name"
              value={formData.topic_name}
              onChange={(e) => handleInputChange('topic_name', e.target.value)}
              placeholder="e.g., Hooks, Data Structures, Neural Networks"
            />
          </div>

          <div className="space-y-2">
            <Label>Priority Category</Label>
            <Select
              value={formData.priority_category}
              onValueChange={(value) => handleInputChange('priority_category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-critical">Job-Critical</SelectItem>
                <SelectItem value="important-not-urgent">Important but Not Urgent</SelectItem>
                <SelectItem value="curious-emerging">Curious & Emerging</SelectItem>
                <SelectItem value="nice-to-know">Nice to Know</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_hours">Estimated Hours</Label>
            <Input
              id="estimated_hours"
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
              placeholder="e.g., 40"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Subject'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
