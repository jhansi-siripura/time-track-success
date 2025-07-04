
import { useCallback, useRef } from 'react';
import { SessionType } from '@/hooks/usePomodoroTimer';
import { usePomodoroSettings } from './usePomodoroSettings';

export const useAudioNotifications = () => {
  const { settings } = usePomodoroSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(async (sessionType: SessionType) => {
    if (!settings) return;
    
    let soundFile = 'bell.mp3';
    switch (sessionType) {
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
      // Create a new audio instance for each play to avoid conflicts
      const audio = new Audio(`/sounds/${soundFile}`);
      audio.volume = 0.7;
      
      // Handle both user interaction requirements and autoplay policies
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('Notification sound played successfully');
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
      
      // Fallback: try with a simple beep
      try {
        const audio = new Audio('/sounds/bell.mp3');
        audio.volume = 0.5;
        await audio.play();
      } catch (fallbackError) {
        console.log('Fallback sound also failed:', fallbackError);
      }
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = sessionType === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!';
      const body = sessionType === 'focus' ? 'Time for a break!' : 'Ready to focus again?';
      new Notification(title, { 
        body, 
        icon: '/favicon.ico',
        tag: 'pomodoro-notification' // Prevent duplicate notifications
      });
    }
  }, [settings]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return {
    playNotificationSound,
    requestNotificationPermission,
  };
};
