
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StudyLogGroup {
  subject: string;
  topics: string[];
  totalSessions: number;
  totalHours: number;
}

const KnownTechnologies = () => {
  const { data: studyLogs, isLoading } = useQuery({
    queryKey: ['known-technologies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_logs')
        .select('subject, topic, duration')
        .not('subject', 'is', null)
        .not('topic', 'is', null);
      
      if (error) throw error;
      return data;
    },
  });

  const groupedData = React.useMemo(() => {
    if (!studyLogs) return [];
    
    const groups: Record<string, StudyLogGroup> = {};
    
    studyLogs.forEach((log) => {
      const subject = log.subject || 'Other';
      const topic = log.topic || 'General';
      const duration = log.duration || 0;
      
      if (!groups[subject]) {
        groups[subject] = {
          subject,
          topics: [],
          totalSessions: 0,
          totalHours: 0,
        };
      }
      
      if (!groups[subject].topics.includes(topic)) {
        groups[subject].topics.push(topic);
      }
      
      groups[subject].totalSessions += 1;
      groups[subject].totalHours += duration / 60;
    });
    
    return Object.values(groups).sort((a, b) => b.totalHours - a.totalHours);
  }, [studyLogs]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (groupedData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Start studying to see your known technologies here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Your Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {groupedData.map((group) => (
          <KnownTechnologyGroup key={group.subject} group={group} />
        ))}
      </CardContent>
    </Card>
  );
};

const KnownTechnologyGroup = ({ group }: { group: StudyLogGroup }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="text-left">
              <h4 className="font-medium text-sm">{group.subject}</h4>
              <p className="text-xs text-muted-foreground">
                {group.topics.length} topic{group.topics.length !== 1 ? 's' : ''} • {Math.round(group.totalHours)}h studied
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {group.totalSessions}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-7 pr-3 pb-2">
        <div className="space-y-1">
          {group.topics.map((topic) => (
            <div
              key={topic}
              className="text-sm text-muted-foreground py-1 px-2 rounded hover:bg-muted/30"
            >
              {topic}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default KnownTechnologies;
