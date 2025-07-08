
import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import StudyLogDialog from './StudyLogDialog';

const PomodoroTimer = () => {
  const {
    sessionType,
    timeLeft,
    isActive,
    currentCycle,
    totalCycles,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    formatTime,
    getSessionDuration,
    getLastCompletedSession,
    clearLastCompletedSession,
  } = usePomodoroTimer();

  const [showLogDialog, setShowLogDialog] = useState(false);
  const [lastCompletedSession, setLastCompletedSession] = useState<{
    type: any;
    duration: number;
    cycle: number;
  } | null>(null);

  // Check for completed sessions
  useEffect(() => {
    const checkForCompletedSession = () => {
      const completed = getLastCompletedSession();
      if (completed && completed.type === 'focus' && !lastCompletedSession) {
        setLastCompletedSession(completed);
        setShowLogDialog(true);
      }
    };

    const interval = setInterval(checkForCompletedSession, 1000);
    return () => clearInterval(interval);
  }, [getLastCompletedSession, lastCompletedSession]);

  const handleLogDialogClose = (open: boolean) => {
    if (!open) {
      clearLastCompletedSession();
      setLastCompletedSession(null);
    }
    setShowLogDialog(open);
  };

  const totalTime = getSessionDuration(sessionType);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'from-red-400 to-red-600';
      case 'short_break':
        return 'from-green-400 to-green-600';
      case 'long_break':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getSessionTitle = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Time';
      case 'short_break':
        return 'Short Break';
      case 'long_break':
        return 'Long Break';
      default:
        return 'Session';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Card className="w-full max-w-md bg-card border-border shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Session Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{getSessionTitle()}</h2>
              <p className="text-sm text-muted-foreground">
                Cycle {currentCycle} of {totalCycles}
              </p>
            </div>

            {/* Timer Display */}
            <div className={`relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-br ${getSessionColor()} p-2 shadow-lg`}>
              <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {isActive ? 'Running' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(progress)}% complete
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-3">
              <Button
                onClick={isActive ? pauseTimer : startTimer}
                size="lg"
                className={`bg-gradient-to-r ${getSessionColor()} hover:opacity-90 text-white`}
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={resetTimer}
                size="lg"
                variant="outline"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={skipSession}
                size="lg"
                variant="outline"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Info Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md">
        <Card className={`transition-all duration-200 bg-card border-border ${sessionType === 'focus' ? 'ring-2 ring-red-400 shadow-md' : 'hover:shadow-sm'}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mb-1 sm:mb-2"></div>
            <p className="text-xs font-medium text-foreground">Focus</p>
          </CardContent>
        </Card>
        
        <Card className={`transition-all duration-200 bg-card border-border ${sessionType === 'short_break' ? 'ring-2 ring-green-400 shadow-md' : 'hover:shadow-sm'}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-1 sm:mb-2"></div>
            <p className="text-xs font-medium text-foreground">Short Break</p>
          </CardContent>
        </Card>
        
        <Card className={`transition-all duration-200 bg-card border-border ${sessionType === 'long_break' ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-sm'}`}>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-1 sm:mb-2"></div>
            <p className="text-xs font-medium text-foreground">Long Break</p>
          </CardContent>
        </Card>
      </div>

      {/* Study Log Dialog */}
      {lastCompletedSession && (
        <StudyLogDialog
          open={showLogDialog}
          onOpenChange={handleLogDialogClose}
          sessionType={lastCompletedSession.type}
          duration={lastCompletedSession.duration}
          cycle={lastCompletedSession.cycle}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;
