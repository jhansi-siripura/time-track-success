
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getTodayDate } from '@/lib/dateUtils';
import { Calendar, Filter, BookOpen } from 'lucide-react';

interface RecapFiltersProps {
  dateFilter: string;
  subjectFilter: string;
  topicFilter: string;
  subjects: string[];
  topics: string[];
  onDateFilterChange: (date: string) => void;
  onSubjectFilterChange: (subject: string) => void;
  onTopicFilterChange: (topic: string) => void;
}

const RecapFilters: React.FC<RecapFiltersProps> = ({
  dateFilter,
  subjectFilter,
  topicFilter,
  subjects,
  topics,
  onDateFilterChange,
  onSubjectFilterChange,
  onTopicFilterChange
}) => {
  // Filter out empty, null, or undefined values
  const validSubjects = subjects.filter(subject => subject && subject.trim() !== '');
  const validTopics = topics.filter(topic => topic && topic.trim() !== '');

  // Use local timezone for default date if no date filter is set
  const displayDate = dateFilter || getTodayDate();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-amber-200/50 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Filter Study Sessions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-filter" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span>Date</span>
            </Label>
            <Input 
              id="date-filter" 
              type="date" 
              value={displayDate} 
              onChange={e => onDateFilterChange(e.target.value)}
              className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject-filter" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Subject</span>
            </Label>
            <Select value={subjectFilter} onValueChange={onSubjectFilterChange}>
              <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {validSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-filter" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4 text-purple-600" />
              <span>Topic</span>
            </Label>
            <Select value={topicFilter} onValueChange={onTopicFilterChange}>
              <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {validTopics.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecapFilters;
