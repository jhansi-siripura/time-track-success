
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useChangelogNotifications } from '@/hooks/useChangelogNotifications';

interface ChangelogNotificationBadgeProps {
  className?: string;
}

const ChangelogNotificationBadge: React.FC<ChangelogNotificationBadgeProps> = ({ 
  className = "" 
}) => {
  const { unreadCount } = useChangelogNotifications();

  if (unreadCount === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={`ml-1 px-1.5 py-0.5 text-xs ${className}`}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  );
};

export default ChangelogNotificationBadge;
