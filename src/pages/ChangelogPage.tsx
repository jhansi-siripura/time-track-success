
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Zap, Bug, Wrench } from 'lucide-react';
import { useChangelogNotifications } from '@/hooks/useChangelogNotifications';

const ChangelogPage = () => {
  const { markAsViewed } = useChangelogNotifications();
  
  const { data: changelog, isLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_changelog')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Mark all changelog entries as viewed when user visits the page
  useEffect(() => {
    if (changelog && changelog.length > 0) {
      changelog.forEach(entry => {
        markAsViewed(entry.id);
      });
    }
  }, [changelog, markAsViewed]);

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Zap className="w-4 h-4" />;
      case 'bugfix':
        return <Bug className="w-4 h-4" />;
      case 'improvement':
        return <Wrench className="w-4 h-4" />;
      default:
        return <CalendarDays className="w-4 w-4" />;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'bugfix':
        return 'bg-red-100 text-red-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Changelog</h1>
          <p className="text-gray-600">What's new in Study Tracker</p>
        </div>
        <div className="flex justify-center">
          <div>Loading changelog...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Changelog</h1>
        <p className="text-gray-600">What's new in Study Tracker</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {changelog?.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{entry.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getChangeTypeColor(entry.change_type)}>
                    {getChangeTypeIcon(entry.change_type)}
                    <span className="ml-1 capitalize">{entry.change_type}</span>
                  </Badge>
                  <Badge variant="secondary">v{entry.version}</Badge>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="w-4 h-4 mr-1" />
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{entry.description}</p>
            </CardContent>
          </Card>
        ))}

        {changelog?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No changelog entries found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChangelogPage;
