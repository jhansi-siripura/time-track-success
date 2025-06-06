
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
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}h`, 
                    name
                  ]}
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc',
                    borderRadius: '6px'
                  }}
                />
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
