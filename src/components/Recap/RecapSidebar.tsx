
import React, { useState } from 'react';
import RevisionWidget from './RevisionWidget';
import CalendarWidget from './CalendarWidget';

interface RecapSidebarProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
}

const RecapSidebar = ({ dateFilter, onDateFilterChange }: RecapSidebarProps) => {
  const [calendarReloadTrigger, setCalendarReloadTrigger] = useState(0);

  const handleRevisionStatusChange = () => {
    // Trigger calendar reload by updating the trigger prop
    setCalendarReloadTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
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
