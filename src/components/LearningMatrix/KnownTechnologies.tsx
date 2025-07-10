import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getExpertiseLevel, formatHours, EXPERTISE_LEVELS } from '@/utils/expertiseUtils';
interface StudyData {
  subject: string;
  topics: Array<{
    name: string;
    hours: number;
    sessions: number;
  }>;
  totalHours: number;
  totalSessions: number;
}
const KnownTechnologies = () => {
  const [studyData, setStudyData] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetchKnownSubjects();
  }, []);
  const fetchKnownSubjects = async () => {
    try {
      const {
        data: studyLogs,
        error
      } = await supabase.from('study_logs').select('subject, topic, duration').not('subject', 'is', null).not('topic', 'is', null);
      if (error) throw error;

      // Group by subject and aggregate topics with their hours
      const grouped = studyLogs.reduce((acc: Record<string, any>, log) => {
        const subject = log.subject || 'Other';
        const topic = log.topic || 'General';
        const duration = log.duration || 0;
        if (!acc[subject]) {
          acc[subject] = {
            topics: {},
            totalDuration: 0,
            totalSessions: 0
          };
        }
        if (!acc[subject].topics[topic]) {
          acc[subject].topics[topic] = {
            duration: 0,
            sessions: 0
          };
        }
        acc[subject].topics[topic].duration += duration;
        acc[subject].topics[topic].sessions += 1;
        acc[subject].totalDuration += duration;
        acc[subject].totalSessions += 1;
        return acc;
      }, {});

      // Convert to array format with calculated hours
      const processedData: StudyData[] = Object.entries(grouped).map(([subject, data]: [string, any]) => {
        const topics = Object.entries(data.topics).map(([topicName, topicData]: [string, any]) => ({
          name: topicName,
          hours: formatHours(topicData.duration),
          sessions: topicData.sessions
        }));
        return {
          subject,
          topics,
          totalHours: formatHours(data.totalDuration),
          totalSessions: data.totalSessions
        };
      });
      setStudyData(processedData);
    } catch (error) {
      console.error('Error fetching known subjects:', error);
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
    return <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />)}
      </div>;
  }
  if (studyData.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">
        <p>No study history found. Start logging your study sessions to see known subjects here.</p>
      </div>;
  }
  const totalSubjects = studyData.length;
  const totalTopics = studyData.reduce((sum, item) => sum + item.topics.length, 0);
  return <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="text-sm">
          {totalSubjects} Subjects • {totalTopics} Topics
        </Badge>
      </div>

      {studyData.map(item => {
      const subjectExpertise = getExpertiseLevel(item.totalHours);
      return <Collapsible key={item.subject} open={openSections.has(item.subject)}>
            <CollapsibleTrigger onClick={() => toggleSection(item.subject)} className="w-full p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getSubjectIcon(item.subject)}</span>
                <div className="text-left">
                  <h3 className="font-medium text-foreground">{item.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.topics.length} topics • {item.totalHours}h total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${subjectExpertise.color}`}>
                  {subjectExpertise.emoji} {subjectExpertise.label}
                </Badge>
                {openSections.has(item.subject) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-2">
              <div className="mt-2 space-y-2">
                {item.topics.map((topic, index) => {
              const topicExpertise = getExpertiseLevel(topic.hours);
              return <div key={index} className="flex items-center justify-between py-2 px-3 rounded border-l-2 border-primary/20 bg-inherit">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{topic.name}</span>
                        <span className="text-xs text-muted-foreground">({topic.hours}h)</span>
                      </div>
                      <Badge className={`text-xs ${topicExpertise.color}`}>
                        {topicExpertise.emoji} {topicExpertise.label}
                      </Badge>
                    </div>;
            })}
              </div>
            </CollapsibleContent>
          </Collapsible>;
    })}
    </div>;
};
export default KnownTechnologies;