import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StudyData {
  subject: string;
  topic: string;
  hours: number;
}

interface SubjectBarChartWidgetProps {
  data: StudyData[];
}

const SubjectBarChartWidget = ({ data }: SubjectBarChartWidgetProps) => {
  // Process data to create stacked bar chart format
  const processedData = React.useMemo(() => {
    if (data.length === 0) return [];

    // Group by subject and topic
    const subjectTopicMap = new Map<string, Map<string, number>>();
    
    data.forEach(item => {
      const subject = item.subject || 'Unknown';
      const topic = item.topic || 'General'; // Use "General" instead of empty or "Uncategorized"
      
      if (!subjectTopicMap.has(subject)) {
        subjectTopicMap.set(subject, new Map());
      }
      
      const topicMap = subjectTopicMap.get(subject)!;
      const currentHours = topicMap.get(topic) || 0;
      topicMap.set(topic, currentHours + item.hours);
    });

    // Get all unique topics across all subjects for consistent coloring
    const allTopics = new Set<string>();
    subjectTopicMap.forEach(topicMap => {
      topicMap.forEach((_, topic) => allTopics.add(topic));
    });
    
    const sortedTopics = Array.from(allTopics).sort();
    
    // Convert to chart format
    const chartData = Array.from(subjectTopicMap.entries()).map(([subject, topicMap]) => {
      const subjectData: any = { subject };
      
      // Add each topic as a property
      sortedTopics.forEach(topic => {
        subjectData[topic] = topicMap.get(topic) || 0;
      });
      
      // Calculate total for sorting
      subjectData.total = Array.from(topicMap.values()).reduce((sum, hours) => sum + hours, 0);
      
      return subjectData;
    });

    // Sort by total hours descending
    return chartData.sort((a, b) => b.total - a.total);
  }, [data]);

  // Generate colors for topics
  const topicColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98',
    '#ffa07a', '#20b2aa', '#778899', '#b0c4de', '#ffb6c1',
    '#daa520', '#cd853f', '#5f9ea0', '#7b68ee', '#6b8e23'
  ];

  const allTopics = React.useMemo(() => {
    const topics = new Set<string>();
    processedData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'subject' && key !== 'total' && item[key] > 0) {
          topics.add(key);
        }
      });
    });
    return Array.from(topics).sort();
  }, [processedData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Calculate total and sort topics by hours
      const topicData = payload
        .filter((item: any) => item.value > 0)
        .map((item: any) => ({
          topic: item.dataKey,
          hours: item.value,
          color: item.color
        }))
        .sort((a: any, b: any) => b.hours - a.hours);
      
      const totalHours = topicData.reduce((sum: number, item: any) => sum + item.hours, 0);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} — Total: {totalHours.toFixed(1)} hrs
          </p>
          <div className="space-y-1">
            {topicData.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">
                  {item.topic}: {item.hours.toFixed(1)} hrs
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Study Time by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No study data available yet.</p>
            <p className="text-sm">Start logging your study sessions to see analytics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Study Time by Subject</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[30rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="subject" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
                interval={0}
              />
              <YAxis 
                fontSize={12}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              {allTopics.map((topic, index) => (
                <Bar 
                  key={topic}
                  dataKey={topic} 
                  stackId="topics"
                  fill={topicColors[index % topicColors.length]}
                  name={topic}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectBarChartWidget;
