
import React from 'react';
import RevisionWidget from './RevisionWidget';
import CalendarWidget from './CalendarWidget';

interface RecapSidebarProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
}

const RecapSidebar = ({ dateFilter, onDateFilterChange }: RecapSidebarProps) => {
  return (
    <div className="space-y-6">
      <RevisionWidget 
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
      />
      <CalendarWidget />
    </div>
  );
};

export default RecapSidebar;
