
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

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
  onTopicFilterChange,
}) => {
  // Filter out empty, null, or undefined values
  const validSubjects = subjects.filter(subject => subject && subject.trim() !== '');
  const validTopics = topics.filter(topic => topic && topic.trim() !== '');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-filter">Date</Label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject-filter">Subject</Label>
            <Select value={subjectFilter} onValueChange={onSubjectFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {validSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-filter">Topic</Label>
            <Select value={topicFilter} onValueChange={onTopicFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {validTopics.map((topic) => (
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
