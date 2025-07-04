
import React, { useEffect } from 'react';
import { useChangelogNotifications } from '@/hooks/useChangelogNotifications';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NewFeatureToast: React.FC = () => {
  const { user } = useAuth();
  const { unreadEntries, hasNewFeatures } = useChangelogNotifications();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !hasNewFeatures || !unreadEntries?.length) return;

    // Show toast for new features only
    const newFeatures = unreadEntries.filter(entry => entry.change_type === 'feature');
    
    if (newFeatures.length > 0) {
      const latestFeature = newFeatures[0];
      
      toast({
        title: "🎉 New Feature Available!",
        description: latestFeature.title,
        action: (
          <div className="flex items-center space-x-1 text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Check it out</span>
          </div>
        ),
        duration: 8000,
      });
    }
  }, [user, hasNewFeatures, unreadEntries, toast]);

  return null;
};

export default NewFeatureToast;
