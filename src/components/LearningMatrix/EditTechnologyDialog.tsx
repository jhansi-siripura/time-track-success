
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface EditTechnologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology: LearningMatrixUnknown;
  onSuccess: () => void;
}

const EditTechnologyDialog: React.FC<EditTechnologyDialogProps> = ({
  open,
  onOpenChange,
  technology,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    technology_name: '',
    description: '',
    priority_category: 'important-not-urgent',
    urgency_level: 'medium',
    estimated_hours: '',
    expected_roi: 'unknown'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (technology) {
      setFormData({
        technology_name: technology.technology_name,
        description: technology.description || '',
        priority_category: technology.priority_category,
        urgency_level: technology.urgency_level || 'medium',
        estimated_hours: technology.estimated_hours?.toString() || '',
        expected_roi: technology.expected_roi || 'unknown'
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
          technology_name: formData.technology_name,
          description: formData.description || null,
          priority_category: formData.priority_category as any,
          urgency_level: formData.urgency_level as any,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          expected_roi: formData.expected_roi as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', technology.id);

      if (error) throw error;

      toast({
        title: 'Technology updated',
        description: `${formData.technology_name} has been updated in your learning matrix.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating technology:', error);
      toast({
        title: 'Error',
        description: 'Failed to update technology. Please try again.',
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
          <DialogTitle>Edit Technology</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="technology_name">Technology Name</Label>
            <Input
              id="technology_name"
              value={formData.technology_name}
              onChange={(e) => handleInputChange('technology_name', e.target.value)}
              placeholder="e.g., React Native, Docker, GraphQL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of what you want to learn"
              rows={3}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select
                value={formData.urgency_level}
                onValueChange={(value) => handleInputChange('urgency_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
          </div>

          <div className="space-y-2">
            <Label>Expected ROI</Label>
            <Select
              value={formData.expected_roi}
              onValueChange={(value) => handleInputChange('expected_roi', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Updating...' : 'Update Technology'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTechnologyDialog;
