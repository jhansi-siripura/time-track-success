
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Medal, Clock } from 'lucide-react';

interface DailyTargetWidgetProps {
  avg21Days: number;
  avg7Days: number;
  yesterdayHours: number;
  todayHours: number;
}

const DailyTargetWidget = ({ avg21Days, avg7Days, yesterdayHours, todayHours }: DailyTargetWidgetProps) => {
  const target1Met = todayHours >= avg21Days;
  const target2Met = todayHours >= avg7Days;
  const target3Met = todayHours >= yesterdayHours;

  const getCelebrationLevel = () => {
    if (target1Met && target2Met && target3Met) return 'celebration';
    if (target1Met && target2Met) return 'upgraded';
    if (target1Met) return 'gold';
    return 'default';
  };

  const celebrationLevel = getCelebrationLevel();

  return (
    <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4 bg-white border-b border-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          Today's Goal
          {celebrationLevel === 'celebration' && <Trophy className="h-5 w-5 text-yellow-600 animate-bounce" />}
          {celebrationLevel === 'upgraded' && <Medal className="h-5 w-5 text-yellow-600" />}
          {celebrationLevel === 'gold' && <Target className="h-5 w-5 text-yellow-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{avg21Days.toFixed(1)}h</div>
            <div className="text-sm text-gray-500">21-Day Avg</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{avg7Days.toFixed(1)}h</div>
            <div className="text-sm text-gray-500">7-Day Avg</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{yesterdayHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-500">Yesterday</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{todayHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-500">Today's Total</div>
          </div>
        </div>
        
        {celebrationLevel === 'celebration' && (
          <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-700">
              🎉 All targets achieved! Amazing work! 🎉
            </div>
          </div>
        )}
        {celebrationLevel === 'upgraded' && (
          <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600">
              ⭐ Great progress! Keep it up!
            </div>
          </div>
        )}
        {celebrationLevel === 'gold' && (
          <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600">
              🏆 21-day target achieved!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTargetWidget;
