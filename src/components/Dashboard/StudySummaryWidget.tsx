
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Target } from 'lucide-react';

interface StudySummaryWidgetProps {
  totalSessions: number;
  totalHours: number;
  totalSubjects: number;
}

const StudySummaryWidget = ({ totalSessions, totalHours, totalSubjects }: StudySummaryWidgetProps) => {
  const summaryItems = [
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Study Hours',
      value: `${totalHours.toFixed(1)} hrs`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Unique Subjects',
      value: totalSubjects.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Study Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`flex items-center p-3 rounded-lg ${item.bgColor}`}>
                <Icon className={`h-5 w-5 ${item.color} mr-3`} />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySummaryWidget;
