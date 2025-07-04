
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewFeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Array<{
    id: string;
    title: string;
    description: string;
    version: string;
    created_at: string;
  }>;
}

const NewFeatureModal: React.FC<NewFeatureModalProps> = ({ 
  open, 
  onOpenChange, 
  features 
}) => {
  const navigate = useNavigate();
  const [currentFeatureIndex, setCurrentFeatureIndex] = React.useState(0);
  
  if (!features.length) return null;
  
  const currentFeature = features[currentFeatureIndex];
  const hasMultipleFeatures = features.length > 1;

  const handleViewChangelog = () => {
    onOpenChange(false);
    navigate('/changelog');
  };

  const handleNext = () => {
    if (currentFeatureIndex < features.length - 1) {
      setCurrentFeatureIndex(currentFeatureIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFeatureIndex > 0) {
      setCurrentFeatureIndex(currentFeatureIndex - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <DialogTitle>🎉 New Feature Available!</DialogTitle>
          </div>
          {hasMultipleFeatures && (
            <div className="text-sm text-gray-500">
              Feature {currentFeatureIndex + 1} of {features.length}
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              v{currentFeature.version}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(currentFeature.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">{currentFeature.title}</h3>
            <DialogDescription className="text-gray-600">
              {currentFeature.description}
            </DialogDescription>
          </div>
          
          {hasMultipleFeatures && (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevious}
                disabled={currentFeatureIndex === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNext}
                disabled={currentFeatureIndex === features.length - 1}
              >
                Next
              </Button>
            </div>
          )}
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleViewChangelog} className="flex-1">
              View All Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewFeatureModal;
