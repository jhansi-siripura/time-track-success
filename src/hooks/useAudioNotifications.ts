
import { useCallback, useRef, useState } from 'react';
import { SessionType } from '@/hooks/usePomodoroTimer';
import { usePomodoroSettings } from './usePomodoroSettings';

export const useAudioNotifications = () => {
  const { settings } = usePomodoroSettings();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Initialize audio context with user interaction
  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setAudioSupported(true);
      console.log('Audio context initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      setAudioSupported(false);
      setLastError('Audio context initialization failed');
      return false;
    }
  }, []);

  const testAudioFile = useCallback(async (soundFile: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio(`/sounds/${soundFile}.mp3`);
      
      const onLoad = () => {
        cleanup();
        console.log(`Audio file ${soundFile}.mp3 loaded successfully`);
        resolve(true);
      };
      
      const onError = (e: any) => {
        cleanup();
        console.error(`Failed to load audio file ${soundFile}.mp3:`, e);
        resolve(false);
      };
      
      const cleanup = () => {
        audio.removeEventListener('canplaythrough', onLoad);
        audio.removeEventListener('error', onError);
      };
      
      audio.addEventListener('canplaythrough', onLoad);
      audio.addEventListener('error', onError);
      
      // Timeout after 3 seconds
      setTimeout(() => {
        cleanup();
        resolve(false);
      }, 3000);
    });
  }, []);

  const playNotificationSound = useCallback(async (sessionType: SessionType) => {
    if (!settings) {
      console.log('No settings available for audio notification');
      return;
    }

    setLastError(null);
    
    let soundFile = 'bell';
    switch (sessionType) {
      case 'focus':
        soundFile = settings.sound_focus || 'bell';
        break;
      case 'short_break':
        soundFile = settings.sound_short_break || 'chime';
        break;
      case 'long_break':
        soundFile = settings.sound_long_break || 'gong';
        break;
    }

    console.log(`Attempting to play sound: ${soundFile}.mp3 for ${sessionType}`);

    // Test if audio file exists first
    const audioFileExists = await testAudioFile(soundFile);
    if (!audioFileExists) {
      console.warn(`Audio file ${soundFile}.mp3 not found, falling back to bell.mp3`);
      soundFile = 'bell';
    }

    try {
      // Initialize audio context if needed
      await initializeAudioContext();
      
      // Create new audio instance
      const audio = new Audio(`/sounds/${soundFile}.mp3`);
      audio.volume = 0.7;
      
      // Add event listeners for debugging
      audio.addEventListener('loadstart', () => console.log('Audio load started'));
      audio.addEventListener('canplay', () => console.log('Audio can play'));
      audio.addEventListener('play', () => console.log('Audio play event fired'));
      audio.addEventListener('ended', () => console.log('Audio playback ended'));
      audio.addEventListener('error', (e) => console.error('Audio error:', e));

      // Try to play the audio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`Successfully played notification sound: ${soundFile}.mp3`);
      }
    } catch (error: any) {
      console.error('Audio playback failed:', error);
      setLastError(error.message || 'Audio playback failed');
      
      // Try fallback with bell sound if not already using it
      if (soundFile !== 'bell') {
        try {
          console.log('Attempting fallback to bell.mp3');
          const fallbackAudio = new Audio('/sounds/bell.mp3');
          fallbackAudio.volume = 0.5;
          await fallbackAudio.play();
          console.log('Fallback audio played successfully');
        } catch (fallbackError) {
          console.error('Fallback audio also failed:', fallbackError);
          setLastError('All audio playback attempts failed');
        }
      }
    }

    // Browser notification as backup
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = sessionType === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!';
      const body = sessionType === 'focus' ? 'Time for a break!' : 'Ready to focus again?';
      
      try {
        new Notification(title, { 
          body, 
          icon: '/favicon.ico',
          tag: 'pomodoro-notification',
          requireInteraction: false
        });
        console.log('Browser notification sent successfully');
      } catch (notificationError) {
        console.error('Browser notification failed:', notificationError);
      }
    }
  }, [settings, initializeAudioContext, testAudioFile]);

  const testSound = useCallback(async (soundName: string) => {
    console.log(`Testing sound: ${soundName}`);
    setLastError(null);
    
    try {
      await initializeAudioContext();
      
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = 0.7;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`Test sound ${soundName} played successfully`);
        return true;
      }
      return true;
    } catch (error: any) {
      console.error(`Test sound ${soundName} failed:`, error);
      setLastError(`Test failed: ${error.message}`);
      return false;
    }
  }, [initializeAudioContext]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  const getAudioDiagnostics = useCallback(() => {
    const diagnostics = {
      audioContextSupported: !!(window.AudioContext || (window as any).webkitAudioContext),
      audioContextState: audioContextRef.current?.state || 'not-initialized',
      notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported',
      audioSupported,
      lastError,
      userAgent: navigator.userAgent,
    };
    
    console.log('Audio diagnostics:', diagnostics);
    return diagnostics;
  }, [audioSupported, lastError]);

  return {
    playNotificationSound,
    testSound,
    requestNotificationPermission,
    initializeAudioContext,
    getAudioDiagnostics,
    audioSupported,
    lastError,
  };
};
