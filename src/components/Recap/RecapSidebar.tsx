
import React, { useState } from 'react';
import RevisionWidget from './RevisionWidget';
import CalendarWidget from './CalendarWidget';
import RecapFilters from './RecapFilters';

interface RecapSidebarProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
}

const RecapSidebar = ({ dateFilter, onDateFilterChange }: RecapSidebarProps) => {
  const [calendarReloadTrigger, setCalendarReloadTrigger] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  const handleRevisionStatusChange = () => {
    setCalendarReloadTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <RecapFilters
        dateFilter={dateFilter}
        subjectFilter={subjectFilter}
        topicFilter={topicFilter}
        subjects={subjects}
        topics={topics}
        onDateFilterChange={onDateFilterChange}
        onSubjectFilterChange={setSubjectFilter}
        onTopicFilterChange={setTopicFilter}
      />
      <RevisionWidget 
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
        onRevisionStatusChange={handleRevisionStatusChange}
      />
      <CalendarWidget 
        onRevisionStatusChange={calendarReloadTrigger}
      />
    </div>
  );
};

export default RecapSidebar;
