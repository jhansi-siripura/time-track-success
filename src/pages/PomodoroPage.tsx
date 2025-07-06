import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PomodoroTimer from '@/components/Pomodoro/PomodoroTimer';
import PomodoroSettings from '@/components/Pomodoro/PomodoroSettings';
import StudyLogDialog from '@/components/Pomodoro/StudyLogDialog';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
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

  // Monitor for session completion
  React.useEffect(() => {
    if (timeLeft === 0 && isActive && sessionType === 'focus') {
      const duration = getSessionDuration('focus') / 60; // Convert to minutes
      setLastCompletedSession({
        type: 'focus',
        duration,
        cycle: currentCycle
      });
      setShowLogDialog(true);
    }
  }, [timeLeft, isActive, sessionType, currentCycle, getSessionDuration]);
  return <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pomodoro Timer</h1>
        <p className="text-gray-600">Focus on your studies with timed sessions and breaks</p>
      </div>

      <Tabs defaultValue="timer" className="w-full bg-amber-300">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="mt-6">
          <div className="flex justify-center bg-transparent">
            <PomodoroTimer />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <PomodoroSettings />
          </div>
        </TabsContent>
      </Tabs>

      {lastCompletedSession && <StudyLogDialog open={showLogDialog} onOpenChange={setShowLogDialog} sessionType={lastCompletedSession.type} duration={lastCompletedSession.duration} cycle={lastCompletedSession.cycle} />}
    </div>;
};
export default PomodoroPage;