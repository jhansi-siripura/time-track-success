
import { useEffect, useCallback, useRef } from 'react';
import { usePomodoroSettings } from './usePomodoroSettings';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useAudioNotifications } from './useAudioNotifications';

export type SessionType = 'focus' | 'short_break' | 'long_break';

export const usePomodoroTimer = () => {
  const { settings } = usePomodoroSettings();
  const { state, dispatch, formatTime } = usePomodoro();
  const { playNotificationSound, requestNotificationPermission } = useAudioNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedSessionRef = useRef<{ type: SessionType; duration: number; cycle: number } | null>(null);

  // Initialize timer with settings
  useEffect(() => {
    if (settings) {
      dispatch({
        type: 'INITIALIZE_SETTINGS',
        focusDuration: settings.focus_duration,
        totalCycles: settings.cycles_until_long_break,
      });
    }
  }, [settings, dispatch]);

  const getSessionDuration = useCallback((type: SessionType): number => {
    if (!settings) return 25 * 60;
    
    switch (type) {
      case 'focus':
        return settings.focus_duration * 60;
      case 'short_break':
        return settings.short_break_duration * 60;
      case 'long_break':
        return settings.long_break_duration * 60;
      default:
        return 25 * 60;
    }
  }, [settings]);

  const startTimer = useCallback(() => {
    dispatch({ type: 'START_TIMER' });
    requestNotificationPermission();
  }, [dispatch, requestNotificationPermission]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    dispatch({
      type: 'RESET_TIMER',
      sessionType: state.sessionType,
      duration: getSessionDuration(state.sessionType),
    });
  }, [dispatch, state.sessionType, getSessionDuration]);

  const skipSession = useCallback(() => {
    const isLastCycle = state.currentCycle >= state.totalCycles;
    let nextSessionType: SessionType;
    let nextCycle = state.currentCycle;

    if (state.sessionType === 'focus') {
      nextSessionType = isLastCycle ? 'long_break' : 'short_break';
      if (isLastCycle) {
        nextCycle = 1;
      }
    } else {
      nextSessionType = 'focus';
      if (state.sessionType === 'short_break') {
        nextCycle = state.currentCycle + 1;
      }
    }

    dispatch({
      type: 'SKIP_SESSION',
      nextSessionType,
      nextDuration: getSessionDuration(nextSessionType),
      nextCycle,
    });
  }, [dispatch, state.sessionType, state.currentCycle, state.totalCycles, getSessionDuration]);

  // Timer countdown effect
  useEffect(() => {
    if (state.isActive && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, state.timeLeft, dispatch]);

  // Handle session completion
  useEffect(() => {
    if (state.timeLeft === 0 && state.isActive) {
      // Complete the session
      const sessionDuration = getSessionDuration(state.sessionType);
      dispatch({
        type: 'COMPLETE_SESSION',
        sessionType: state.sessionType,
        cycle: state.currentCycle,
        duration: sessionDuration / 60, // Convert to minutes
      });

      // Store completed session for dialog
      completedSessionRef.current = {
        type: state.sessionType,
        duration: sessionDuration / 60,
        cycle: state.currentCycle,
      };

      // Play notification sound
      playNotificationSound(state.sessionType);
      
      // Auto-advance to next session if enabled
      if (
        (state.sessionType === 'focus' && settings?.auto_start_breaks) ||
        (state.sessionType !== 'focus' && settings?.auto_start_pomodoros)
      ) {
        setTimeout(() => {
          skipSession();
          setTimeout(() => {
            startTimer();
          }, 1000);
        }, 2000);
      } else {
        // Just pause the timer
        dispatch({ type: 'PAUSE_TIMER' });
      }
    }
  }, [state.timeLeft, state.isActive, state.sessionType, state.currentCycle, settings, dispatch, getSessionDuration, playNotificationSound, skipSession, startTimer]);

  const getLastCompletedSession = useCallback(() => {
    return completedSessionRef.current;
  }, []);

  const clearLastCompletedSession = useCallback(() => {
    completedSessionRef.current = null;
  }, []);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    formatTime,
    getSessionDuration,
    getLastCompletedSession,
    clearLastCompletedSession,
  };
};
