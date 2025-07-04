
import React, { useEffect, useState } from 'react';
import { useChangelogNotifications } from '@/hooks/useChangelogNotifications';
import { useAuth } from '@/contexts/AuthContext';
import NewFeatureModal from './NewFeatureModal';

const NewFeatureNotification: React.FC = () => {
  const { user } = useAuth();
  const { unreadEntries, hasNewFeatures } = useChangelogNotifications();
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    if (!user || !hasNewFeatures || !unreadEntries?.length || hasShownModal) return;

    // Show modal for new features only
    const newFeatures = unreadEntries.filter(entry => entry.change_type === 'feature');
    
    if (newFeatures.length > 0) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowModal(true);
        setHasShownModal(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasNewFeatures, unreadEntries, hasShownModal]);

  const newFeatures = unreadEntries?.filter(entry => entry.change_type === 'feature') || [];

  return (
    <NewFeatureModal
      open={showModal}
      onOpenChange={setShowModal}
      features={newFeatures}
    />
  );
};

export default NewFeatureNotification;
