
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckSquare, RotateCcw, Calendar } from 'lucide-react';

interface TodoSummaryProps {
  totalStudyTimeToday: number;
  completedTasksToday: number;
  revisionRoundsCompleted: number;
  weeklyStreak: number;
}

const TodoSummary = ({
  totalStudyTimeToday,
  completedTasksToday,
  revisionRoundsCompleted,
  weeklyStreak,
}: TodoSummaryProps) => {
  const summaryCards = [
    {
      title: 'Study Time Today',
      value: `${totalStudyTimeToday.toFixed(1)}h`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tasks Completed',
      value: completedTasksToday.toString(),
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revisions Done',
      value: revisionRoundsCompleted.toString(),
      icon: RotateCcw,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Weekly Streak',
      value: `${weeklyStreak} days`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className={`${card.bgColor} border-0`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-white`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TodoSummary;
