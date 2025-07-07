
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PomodoroTimer from '@/components/Pomodoro/PomodoroTimer';
import PomodoroSettings from '@/components/Pomodoro/PomodoroSettings';
import StudyLogDialog from '@/components/Pomodoro/StudyLogDialog';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { Timer, Settings } from 'lucide-react';

const PomodoroPage = () => {
  const {
    sessionType,
    currentCycle,
    getSessionDuration,
    timeLeft,
    isActive
  } = usePomodoroTimer();
  const [showLogDialog, setShowLogDialog] = React.useState(false);
  const [lastCompletedSession, setLastCompletedSession] = React.useState<{
    type: any;
    duration: number;
    cycle: number;
  } | null>(null);

  React.useEffect(() => {
    if (timeLeft === 0 && isActive && sessionType === 'focus') {
      const duration = getSessionDuration('focus') / 60;
      setLastCompletedSession({
        type: 'focus',
        duration,
        cycle: currentCycle
      });
      setShowLogDialog(true);
    }
  }, [timeLeft, isActive, sessionType, currentCycle, getSessionDuration]);

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50/30 via-cream-50/20 to-yellow-50/30 min-h-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
            <Timer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Pomodoro Timer
            </h1>
            <p className="text-sm text-gray-600">Focus with timed sessions</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-sm">
          <TabsTrigger 
            value="timer" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Timer className="h-4 w-4 mr-2" />
            Timer
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="mt-6">
          <div className="flex justify-center">
            <PomodoroTimer />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <PomodoroSettings />
          </div>
        </TabsContent>
      </Tabs>

      {lastCompletedSession && (
        <StudyLogDialog 
          open={showLogDialog} 
          onOpenChange={setShowLogDialog} 
          sessionType={lastCompletedSession.type} 
          duration={lastCompletedSession.duration} 
          cycle={lastCompletedSession.cycle} 
        />
      )}
    </div>
  );
};

export default PomodoroPage;
