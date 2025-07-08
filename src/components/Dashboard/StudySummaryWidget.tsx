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
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4 bg-white">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-orange-600" />
          </div>
          Study Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        <div className="space-y-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySummaryWidget;
