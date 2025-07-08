import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeekData {
  week: string;
  hours: number;
  subjects?: { [subject: string]: number };
}

interface FourWeekConsistencyWidgetProps {
  data: WeekData[];
  getSubjectColor: (subject: string, subjects: string[]) => string;
}

const FourWeekConsistencyWidget = ({ data, getSubjectColor }: FourWeekConsistencyWidgetProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const weekData = payload[0].payload;
      const subjects = weekData.subjects || {};
      
      // Filter out subjects with 0 hours and sort by hours descending
      const subjectData = Object.entries(subjects)
        .filter(([_, hours]) => (hours as number) > 0)
        .map(([subject, hours]) => ({
          subject,
          hours: hours as number,
          color: getSubjectColor(subject, Object.keys(subjects))
        }))
        .sort((a, b) => b.hours - a.hours);
      
      const totalHours = subjectData.reduce((sum, item) => sum + item.hours, 0);

      if (subjectData.length === 0) {
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-900">
              {label} — Total: {totalHours.toFixed(1)} hrs
            </p>
          </div>
        );
      }

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} — Total: {totalHours.toFixed(1)} hrs
          </p>
          <div className="space-y-1">
            {subjectData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">
                  {item.subject}: {item.hours.toFixed(1)} hrs
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
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-3 bg-white">
        <CardTitle className="text-lg">Last 4 Weeks Overview</CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No weekly data available yet.</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FourWeekConsistencyWidget;
