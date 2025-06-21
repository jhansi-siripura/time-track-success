
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  day: string;
  [subject: string]: string | number;
}

interface WeeklyDistributionWidgetProps {
  data: WeeklyData[];
  subjects: string[];
  getSubjectColor: (subject: string, subjects: string[]) => string;
}

const WeeklyDistributionWidget = ({ data, subjects, getSubjectColor }: WeeklyDistributionWidgetProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Filter out subjects with 0 hours and sort by hours descending
      const subjectData = payload
        .filter((item: any) => item.value > 0)
        .map((item: any) => ({
          subject: item.dataKey,
          hours: item.value,
          color: item.color
        }))
        .sort((a: any, b: any) => b.hours - a.hours);
      
      const totalHours = subjectData.reduce((sum: number, item: any) => sum + item.hours, 0);

      if (subjectData.length === 0) {
        return null; // Don't show tooltip if no subjects have study time
      }

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} — Total: {totalHours.toFixed(1)} hrs
          </p>
          <div className="space-y-1">
            {subjectData.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">
                  • {item.subject}: {item.hours.toFixed(1)} hrs
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Current Week Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No data for this week yet.</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  fontSize={10}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                {subjects.map((subject) => (
                  <Bar 
                    key={subject}
                    dataKey={subject}
                    stackId="a"
                    fill={getSubjectColor(subject, subjects)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyDistributionWidget;
