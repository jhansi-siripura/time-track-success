
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
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Total Study Hours',
      value: `${totalHours.toFixed(1)} hrs`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      label: 'Unique Subjects',
      value: totalSubjects.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4 bg-white border-b border-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <BookOpen className="h-5 w-5 text-orange-600" />
          </div>
          Study Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <div className="space-y-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor} border ${item.borderColor}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
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
