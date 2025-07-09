
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTodayDate } from '@/lib/dateUtils';
import { Calendar, Filter, BookOpen, X } from 'lucide-react';

interface RecapFiltersProps {
  dateFilter: string;
  subjectFilter: string;
  topicFilter: string;
  subjects: string[];
  topics: string[];
  onDateFilterChange: (date: string) => void;
  onSubjectFilterChange: (subject: string) => void;
  onTopicFilterChange: (topic: string) => void;
  onClearAllFilters: () => void;
}

const RecapFilters: React.FC<RecapFiltersProps> = ({
  dateFilter,
  subjectFilter,
  topicFilter,
  subjects,
  topics,
  onDateFilterChange,
  onSubjectFilterChange,
  onTopicFilterChange,
  onClearAllFilters
}) => {
  const validSubjects = subjects.filter(subject => subject && subject.trim() !== '');
  const validTopics = topics.filter(topic => topic && topic.trim() !== '');

  const handleDateClear = () => {
    onDateFilterChange('');
  };

  const handleSubjectChange = (subject: string) => {
    onSubjectFilterChange(subject);
    // When subject changes, reset topic to "all" to avoid invalid combinations
    if (subject === 'all') {
      onTopicFilterChange('all');
    } else {
      // If a specific subject is selected, reset topic to allow user to choose
      onTopicFilterChange('all');
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-amber-200/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="h-6 px-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="space-y-1">
          <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-amber-600" />
            <span>Date</span>
          </Label>
          <div className="flex space-x-1">
            <Input 
              id="date-filter" 
              type="date" 
              value={dateFilter || ''} 
              onChange={e => onDateFilterChange(e.target.value)}
              className="h-8 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400 flex-1"
            />
            {dateFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDateClear}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="subject-filter" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <BookOpen className="h-3 w-3 text-blue-600" />
            <span>Subject</span>
          </Label>
          <Select value={subjectFilter} onValueChange={handleSubjectChange}>
            <SelectTrigger className="h-8 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400">
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

        <div className="space-y-1">
          <Label htmlFor="topic-filter" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Filter className="h-3 w-3 text-purple-600" />
            <span>Topic</span>
          </Label>
          <Select value={topicFilter} onValueChange={onTopicFilterChange}>
            <SelectTrigger className="h-8 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400">
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
      </CardContent>
    </Card>
  );
};

export default RecapFilters;
