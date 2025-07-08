
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import QuadrantView from './QuadrantView';
import TableView from './TableView';
import AddTechnologyDialog from './AddTechnologyDialog';

interface UnknownTechnologiesProps {
  viewMode: 'overview' | 'full';
}

const UnknownTechnologies = ({ viewMode }: UnknownTechnologiesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'quadrant' | 'table'>('quadrant');

  const { data: unknownTechs, isLoading, refetch } = useQuery({
    queryKey: ['unknown-technologies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_matrix_unknown')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (viewMode === 'overview') {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Learning Backlog</CardTitle>
            <Button
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : unknownTechs && unknownTechs.length > 0 ? (
            <div className="space-y-2">
              {unknownTechs.slice(0, 5).map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{tech.technology_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {tech.priority_category.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              ))}
              {unknownTechs.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{unknownTechs.length - 5} more technologies
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add technologies you want to learn
            </p>
          )}
        </CardContent>
        <AddTechnologyDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={() => {
            refetch();
            setIsAddDialogOpen(false);
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Technologies to Learn</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Technology
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'quadrant' | 'table')}>
        <TabsList>
          <TabsTrigger value="quadrant">Quadrant View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quadrant" className="mt-6">
          <QuadrantView data={unknownTechs || []} onUpdate={refetch} />
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          <TableView data={unknownTechs || []} onUpdate={refetch} />
        </TabsContent>
      </Tabs>

      <AddTechnologyDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          refetch();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
};

export default UnknownTechnologies;
