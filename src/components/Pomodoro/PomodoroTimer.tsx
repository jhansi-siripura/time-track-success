
import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';

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
  } = usePomodoroTimer();

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
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Session Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getSessionTitle()}</h2>
              <p className="text-sm text-gray-600">
                Cycle {currentCycle} of {totalCycles}
              </p>
            </div>

            {/* Timer Display */}
            <div className={`relative w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getSessionColor()} p-2 shadow-lg`}>
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-gray-900">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isActive ? 'Running' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
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
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <Card className={`${sessionType === 'focus' ? 'ring-2 ring-red-400' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Focus</p>
          </CardContent>
        </Card>
        
        <Card className={`${sessionType === 'short_break' ? 'ring-2 ring-green-400' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Short Break</p>
          </CardContent>
        </Card>
        
        <Card className={`${sessionType === 'long_break' ? 'ring-2 ring-blue-400' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium">Long Break</p>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={(el) => { if (el) (window as any).pomodoroAudio = el; }} preload="auto" />
    </div>
  );
};

export default PomodoroTimer;
