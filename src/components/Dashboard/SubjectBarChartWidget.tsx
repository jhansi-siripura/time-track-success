
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubjectData {
  subject: string;
  hours: number;
}

interface SubjectBarChartWidgetProps {
  data: SubjectData[];
}

const SubjectBarChartWidget = ({ data }: SubjectBarChartWidgetProps) => {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length]
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Study Time by Subject</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No study data available yet.</p>
            <p className="text-sm">Start logging your study sessions to see analytics!</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithColors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Study Time']}
                />
                <Bar dataKey="hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectBarChartWidget;
