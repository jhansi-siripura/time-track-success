
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Medal } from 'lucide-react';

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
    <Card className={`relative overflow-hidden ${
      celebrationLevel === 'celebration' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' :
      celebrationLevel === 'upgraded' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
      celebrationLevel === 'gold' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
      ''
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Today's Goal 🎯
          {celebrationLevel === 'celebration' && <Trophy className="h-5 w-5 text-yellow-600 animate-bounce" />}
          {celebrationLevel === 'upgraded' && <Medal className="h-5 w-5 text-yellow-600" />}
          {celebrationLevel === 'gold' && <Target className="h-5 w-5 text-yellow-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${target1Met ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50'}`}>
            <div className="text-xs text-muted-foreground">21-Day Avg</div>
            <div className="text-sm font-semibold">{avg21Days.toFixed(1)}h</div>
          </div>
          <div className={`p-3 rounded-lg ${target2Met ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50'}`}>
            <div className="text-xs text-muted-foreground">7-Day Avg</div>
            <div className="text-sm font-semibold">{avg7Days.toFixed(1)}h</div>
          </div>
          <div className={`p-3 rounded-lg ${target3Met ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50'}`}>
            <div className="text-xs text-muted-foreground">Yesterday</div>
            <div className="text-sm font-semibold">{yesterdayHours.toFixed(1)}h</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-xs text-muted-foreground">Today's Total</div>
            <div className="text-lg font-bold text-blue-600">{todayHours.toFixed(1)}h</div>
          </div>
        </div>
        
        {celebrationLevel === 'celebration' && (
          <div className="text-center py-2">
            <div className="text-sm font-medium text-yellow-700 animate-pulse">
              🎉 All targets achieved! Amazing work! 🎉
            </div>
          </div>
        )}
        {celebrationLevel === 'upgraded' && (
          <div className="text-center py-1">
            <div className="text-sm font-medium text-yellow-600">
              ⭐ Great progress! Keep it up!
            </div>
          </div>
        )}
        {celebrationLevel === 'gold' && (
          <div className="text-center py-1">
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
