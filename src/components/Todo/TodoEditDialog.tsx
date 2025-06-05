
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string | null;
  assigned_date: string;
  actual_duration: number | null;
  notes: string | null;
  courses?: {
    trainer: string | null;
    duration_hours: number | null;
  };
}

interface TodoEditDialogProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoId: string, updates: Partial<Todo>) => void;
}

const TodoEditDialog = ({ todo, isOpen, onClose, onSave }: TodoEditDialogProps) => {
  const [title, setTitle] = useState('');
  const [trainer, setTrainer] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setTrainer(todo.courses?.trainer || '');
      setDate(todo.assigned_date);
      setDuration(todo.actual_duration?.toString() || todo.courses?.duration_hours?.toString() || '');
      setNotes(todo.notes || '');
    }
  }, [todo]);

  const handleSave = () => {
    if (!todo) return;

    const updates = {
      title,
      assigned_date: date,
      actual_duration: duration ? parseFloat(duration) : null,
      notes,
    };

    onSave(todo.id, updates);
    onClose();
  };

  if (!todo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div>
            <Label htmlFor="trainer">Trainer</Label>
            <Input
              id="trainer"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              placeholder="Trainer name"
              disabled
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoEditDialog;
