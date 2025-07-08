
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UnknownTechQuadrants from './UnknownTechQuadrants';
import UnknownTechTable from './UnknownTechTable';
import AddTechnologyDialog from './AddTechnologyDialog';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

const UnknownTechnologies = () => {
  const [technologies, setTechnologies] = useState<LearningMatrixUnknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchUnknownTechnologies();
  }, []);

  const fetchUnknownTechnologies = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_matrix_unknown')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTechnologies(data || []);
    } catch (error) {
      console.error('Error fetching unknown technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTechnology = () => {
    fetchUnknownTechnologies(); // Refresh the list
    setShowAddDialog(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Prioritize and organize technologies you want to learn
        </p>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <Tabs defaultValue="quadrants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quadrants">Quadrant View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quadrants" className="mt-4">
          <UnknownTechQuadrants 
            technologies={technologies} 
            onUpdate={fetchUnknownTechnologies}
          />
        </TabsContent>
        
        <TabsContent value="table" className="mt-4">
          <UnknownTechTable 
            technologies={technologies} 
            onUpdate={fetchUnknownTechnologies}
          />
        </TabsContent>
      </Tabs>

      <AddTechnologyDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddTechnology}
      />
    </div>
  );
};

export default UnknownTechnologies;
