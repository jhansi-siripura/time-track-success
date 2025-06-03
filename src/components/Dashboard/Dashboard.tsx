
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [studyData, setStudyData] = useState<any[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('study_logs')
          .select('subject, duration')
          .eq('user_id', user.id);

        if (error) throw error;

        // Calculate subject-wise study time
        const subjectMap = new Map();
        let totalMinutes = 0;

        data?.forEach((log) => {
          const subject = log.subject || 'Unknown';
          const duration = log.duration || 0;
          
          if (subjectMap.has(subject)) {
            subjectMap.set(subject, subjectMap.get(subject) + duration);
          } else {
            subjectMap.set(subject, duration);
          }
          
          totalMinutes += duration;
        });

        // Convert to chart data
        const chartData = Array.from(subjectMap.entries()).map(([subject, minutes]) => ({
          subject,
          hours: Number((minutes / 60).toFixed(1)),
          sessions: data?.filter(log => log.subject === subject).length || 0,
        }));

        // Sort by hours studied
        chartData.sort((a, b) => b.hours - a.hours);

        setStudyData(chartData);
        setTotalSessions(data?.length || 0);
        setTotalHours(Number((totalMinutes / 60).toFixed(1)));
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Study sessions logged</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours studied</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyData.length}</div>
            <p className="text-xs text-muted-foreground">Different subjects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Time by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          {studyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No study data available yet.</p>
              <p className="text-sm">Start logging your study sessions to see analytics!</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'hours' ? `${value} hours` : value,
                      name === 'hours' ? 'Study Time' : 'Sessions'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
