
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Trash2, Plus } from 'lucide-react';
import StudyLogForm from './StudyLogForm';

const StudyLogTable = () => {
  const [studyLogs, setStudyLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchStudyLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;

      setStudyLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch study logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyLogs();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study log?')) return;

    try {
      const { error } = await supabase
        .from('study_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study log deleted successfully!",
      });

      fetchStudyLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete study log",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLog(null);
    fetchStudyLogs();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLog(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (showForm) {
    return (
      <StudyLogForm
        editingLog={editingLog}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Study Logs</CardTitle>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading study logs...</div>
        ) : studyLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No study logs found.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add Your First Study Session
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-20">Time</TableHead>
                  <TableHead className="w-20">Duration</TableHead>
                  <TableHead className="w-28">Subject</TableHead>
                  <TableHead className="w-32">Topic</TableHead>
                  <TableHead className="w-24">Source</TableHead>
                  <TableHead className="w-32 max-w-32">Achievements</TableHead>
                  
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studyLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="w-24">{log.date}</TableCell>
                    <TableCell className="w-20">{log.time}</TableCell>
                    <TableCell className="w-20">{formatDuration(log.duration)}</TableCell>
                    <TableCell className="w-28">{log.subject}</TableCell>
                    <TableCell className="w-32 truncate">{log.topic || '-'}</TableCell>
                    <TableCell className="w-24 truncate">{log.source || '-'}</TableCell>
                    <TableCell className="w-32 max-w-32 truncate">{log.achievements}</TableCell>
                   
                    <TableCell className="w-20">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(log)}
                          className="h-7 w-7 p-0"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(log.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyLogTable;
