
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StudyData {
  subject: string;
  topics: string[];
  totalSessions: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const KnownTechnologies = () => {
  const [studyData, setStudyData] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchKnownTechnologies();
  }, []);

  const fetchKnownTechnologies = async () => {
    try {
      const { data: studyLogs, error } = await supabase
        .from('study_logs')
        .select('subject, topic, duration')
        .not('subject', 'is', null)
        .not('topic', 'is', null);

      if (error) throw error;

      // Group by subject and aggregate topics
      const grouped = studyLogs.reduce((acc: Record<string, any>, log) => {
        const subject = log.subject || 'Other';
        const topic = log.topic || 'General';
        
        if (!acc[subject]) {
          acc[subject] = {
            topics: new Set(),
            totalDuration: 0,
            sessions: 0
          };
        }
        
        acc[subject].topics.add(topic);
        acc[subject].totalDuration += log.duration || 0;
        acc[subject].sessions += 1;
        
        return acc;
      }, {});

      // Convert to array and determine levels
      const processedData: StudyData[] = Object.entries(grouped).map(([subject, data]: [string, any]) => {
        const totalHours = data.totalDuration / 60;
        let level: StudyData['level'] = 'Beginner';
        
        if (totalHours >= 100) level = 'Expert';
        else if (totalHours >= 50) level = 'Advanced';
        else if (totalHours >= 20) level = 'Intermediate';
        
        return {
          subject,
          topics: Array.from(data.topics),
          totalSessions: data.sessions,
          level
        };
      });

      setStudyData(processedData);
    } catch (error) {
      console.error('Error fetching known technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (subject: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(subject)) {
      newOpenSections.delete(subject);
    } else {
      newOpenSections.add(subject);
    }
    setOpenSections(newOpenSections);
  };

  const getLevelColor = (level: StudyData['level']) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubjectIcon = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('frontend') || lowerSubject.includes('react') || lowerSubject.includes('javascript')) {
      return '💻';
    } else if (lowerSubject.includes('backend') || lowerSubject.includes('server') || lowerSubject.includes('api')) {
      return '⚙️';
    } else if (lowerSubject.includes('database') || lowerSubject.includes('sql')) {
      return '🗄️';
    } else if (lowerSubject.includes('design') || lowerSubject.includes('ui') || lowerSubject.includes('ux')) {
      return '🎨';
    }
    return '📚';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (studyData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No study history found. Start logging your study sessions to see known technologies here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="text-sm">
          {studyData.reduce((sum, item) => sum + item.topics.length, 0)} Topics
        </Badge>
      </div>

      {studyData.map((item) => (
        <Collapsible key={item.subject} open={openSections.has(item.subject)}>
          <CollapsibleTrigger
            onClick={() => toggleSection(item.subject)}
            className="w-full p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getSubjectIcon(item.subject)}</span>
              <div className="text-left">
                <h3 className="font-medium text-foreground">{item.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.topics.length} topics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getLevelColor(item.level)}`}>
                {item.level}
              </Badge>
              {openSections.has(item.subject) ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-2">
            <div className="mt-2 space-y-2">
              {item.topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 py-2 px-3 bg-background rounded border-l-2 border-primary/20">
                  <span className="text-sm font-medium text-foreground">{topic}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default KnownTechnologies;
