
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
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
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm">
              <Timer className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Pomodoro Timer
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Focus with timed sessions</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="timer" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border shadow-sm h-12">
            <TabsTrigger 
              value="timer" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white h-10 text-sm sm:text-base"
            >
              <Timer className="h-4 w-4 mr-1 sm:mr-2" />
              Timer
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground h-10 text-sm sm:text-base"
            >
              <Settings className="h-4 w-4 mr-1 sm:mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="mt-6 sm:mt-8">
            <div className="flex justify-center">
              <PomodoroTimer />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6 sm:mt-8">
            <div className="max-w-3xl mx-auto">
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
    </MainLayout>
  );
};

export default PomodoroPage;
