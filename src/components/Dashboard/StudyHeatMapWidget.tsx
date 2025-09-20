import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StudyLog {
  date: string;
  subject: string;
  duration: number;
}

interface StudyHeatMapWidgetProps {
  studyLogs: StudyLog[];
}

const StudyHeatMapWidget: React.FC<StudyHeatMapWidgetProps> = ({ studyLogs }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get the intensity for a specific date (excluding revision)
  const getDateIntensity = (dateStr: string) => {
    const dayLogs = studyLogs.filter(log => 
      log.date === dateStr && 
      log.subject.toLowerCase() !== 'revision'
    );
    
    if (dayLogs.length === 0) return 0;
    
    const totalMinutes = dayLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalHours = totalMinutes / 60;
    
    // Return intensity level (0-4 based on hours studied)
    if (totalHours >= 4) return 4; // 4+ hours
    if (totalHours >= 2.5) return 3; // 2.5-4 hours
    if (totalHours >= 1.5) return 2; // 1.5-2.5 hours
    if (totalHours >= 0.5) return 1; // 0.5-1.5 hours
    return 0; // No study or less than 30 minutes
  };

  // Get intensity color class
  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100 border-gray-200', // No activity
      'bg-green-100 border-green-200', // Light activity
      'bg-green-300 border-green-400', // Medium activity
      'bg-green-500 border-green-600', // High activity
      'bg-green-700 border-green-800', // Very high activity
    ];
    return colors[intensity] || colors[0];
  };

  // Generate calendar grid for the year
  const generateYearGrid = () => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      const firstDay = new Date(selectedYear, month, 1).getDay();
      
      const monthGrid = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        monthGrid.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const intensity = getDateIntensity(dateStr);
        const totalHours = studyLogs
          .filter(log => log.date === dateStr && log.subject.toLowerCase() !== 'revision')
          .reduce((sum, log) => sum + log.duration, 0) / 60;
        
        monthGrid.push({
          day,
          dateStr,
          intensity,
          totalHours
        });
      }
      
      months.push({
        name: monthNames[month],
        grid: monthGrid
      });
    }
    
    return months;
  };

  const yearGrid = generateYearGrid();
  
  const navigateYear = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Study Heat Map
              </CardTitle>
              <p className="text-slate-600 mt-1 font-normal">
                Daily study activity (excluding revision)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-slate-800 min-w-[4rem] text-center">
              {selectedYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-3 h-3 rounded-sm border ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>

            {/* Heat Map Grid - Compact Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {yearGrid.map((month) => (
                <div key={month.name} className="space-y-1">
                  <h3 className="text-xs font-semibold text-slate-700 text-center">
                    {month.name}
                  </h3>
                  <div className="grid grid-cols-7 gap-0.5">
                    {/* Week day headers */}
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div
                        key={index}
                        className="text-[10px] text-slate-500 text-center font-medium h-4 flex items-center justify-center"
                      >
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {month.grid.map((dayData, index) => (
                      <div key={index} className="h-4 flex items-center justify-center">
                        {dayData ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-sm border cursor-pointer transition-all hover:scale-125 ${getIntensityColor(dayData.intensity)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <div className="font-semibold">{dayData.dateStr}</div>
                                <div className="text-sm">
                                  {dayData.totalHours > 0 
                                    ? `${dayData.totalHours.toFixed(1)} hours studied`
                                    : 'No study activity'
                                  }
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="w-3 h-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default StudyHeatMapWidget;