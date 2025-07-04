
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePomodoroSettings } from './usePomodoroSettings';

export type SessionType = 'focus' | 'short_break' | 'long_break';

export interface PomodoroState {
  sessionType: SessionType;
  timeLeft: number;
  isActive: boolean;
  currentCycle: number;
  totalCycles: number;
}

export const usePomodoroTimer = () => {
  const { settings } = usePomodoroSettings();
  const [state, setState] = useState<PomodoroState>({
    sessionType: 'focus',
    timeLeft: 25 * 60, // 25 minutes in seconds
    isActive: false,
    currentCycle: 1,
    totalCycles: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize timer with settings
  useEffect(() => {
    if (settings) {
      setState(prev => ({
        ...prev,
        timeLeft: settings.focus_duration * 60,
        totalCycles: settings.cycles_until_long_break,
      }));
    }
  }, [settings]);

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

  const playNotificationSound = useCallback((type: SessionType) => {
    if (!settings) return;
    
    let soundFile = 'bell.mp3';
    switch (type) {
      case 'focus':
        soundFile = `${settings.sound_focus}.mp3`;
        break;
      case 'short_break':
        soundFile = `${settings.sound_short_break}.mp3`;
        break;
      case 'long_break':
        soundFile = `${settings.sound_long_break}.mp3`;
        break;
    }

    try {
      if (audioRef.current) {
        audioRef.current.src = `/sounds/${soundFile}`;
        audioRef.current.play();
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = type === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!';
      const body = type === 'focus' ? 'Time for a break!' : 'Ready to focus again?';
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, [settings]);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      timeLeft: getSessionDuration(prev.sessionType),
    }));
  }, [getSessionDuration]);

  const skipSession = useCallback(() => {
    setState(prev => {
      const isLastCycle = prev.currentCycle >= prev.totalCycles;
      let nextSessionType: SessionType;
      let nextCycle = prev.currentCycle;

      if (prev.sessionType === 'focus') {
        nextSessionType = isLastCycle ? 'long_break' : 'short_break';
        if (isLastCycle) {
          nextCycle = 1;
        }
      } else {
        nextSessionType = 'focus';
        if (prev.sessionType === 'short_break') {
          nextCycle = prev.currentCycle + 1;
        }
      }

      return {
        ...prev,
        sessionType: nextSessionType,
        timeLeft: getSessionDuration(nextSessionType),
        currentCycle: nextCycle,
        isActive: false,
      };
    });
  }, [getSessionDuration]);

  // Timer countdown effect
  useEffect(() => {
    if (state.isActive && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
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
  }, [state.isActive, state.timeLeft]);

  // Handle session completion
  useEffect(() => {
    if (state.timeLeft === 0 && state.isActive) {
      playNotificationSound(state.sessionType);
      
      // Auto-advance to next session if enabled
      if (
        (state.sessionType === 'focus' && settings?.auto_start_breaks) ||
        (state.sessionType !== 'focus' && settings?.auto_start_pomodoros)
      ) {
        setTimeout(() => {
          skipSession();
          startTimer();
        }, 2000);
      } else {
        setState(prev => ({ ...prev, isActive: false }));
      }
    }
  }, [state.timeLeft, state.isActive, state.sessionType, settings, playNotificationSound, skipSession, startTimer]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    formatTime,
    getSessionDuration,
  };
};
