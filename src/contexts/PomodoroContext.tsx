
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SessionType } from '@/hooks/usePomodoroTimer';

interface PomodoroState {
  sessionType: SessionType;
  timeLeft: number;
  isActive: boolean;
  currentCycle: number;
  totalCycles: number;
  sessionStartTime: number | null;
  completedSessions: Array<{
    type: SessionType;
    duration: number;
    cycle: number;
    completedAt: number;
  }>;
}

type PomodoroAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'TICK' }
  | { type: 'RESET_TIMER'; sessionType: SessionType; duration: number }
  | { type: 'SKIP_SESSION'; nextSessionType: SessionType; nextDuration: number; nextCycle: number }
  | { type: 'COMPLETE_SESSION'; sessionType: SessionType; cycle: number; duration: number }
  | { type: 'INITIALIZE_SETTINGS'; focusDuration: number; totalCycles: number };

interface PomodoroContextType {
  state: PomodoroState;
  dispatch: React.Dispatch<PomodoroAction>;
  formatTime: (seconds: number) => string;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const initialState: PomodoroState = {
  sessionType: 'focus',
  timeLeft: 25 * 60,
  isActive: false,
  currentCycle: 1,
  totalCycles: 4,
  sessionStartTime: null,
  completedSessions: [],
};

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isActive: true,
        sessionStartTime: state.sessionStartTime || Date.now(),
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        isActive: false,
      };
    
    case 'TICK':
      if (!state.isActive || state.timeLeft <= 0) return state;
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    
    case 'RESET_TIMER':
      return {
        ...state,
        isActive: false,
        timeLeft: action.duration,
        sessionStartTime: null,
      };
    
    case 'SKIP_SESSION':
      return {
        ...state,
        sessionType: action.nextSessionType,
        timeLeft: action.nextDuration,
        currentCycle: action.nextCycle,
        isActive: false,
        sessionStartTime: null,
      };
    
    case 'COMPLETE_SESSION':
      const newCompletedSession = {
        type: action.sessionType,
        duration: action.duration,
        cycle: action.cycle,
        completedAt: Date.now(),
      };
      
      return {
        ...state,
        completedSessions: [...state.completedSessions, newCompletedSession],
        sessionStartTime: null,
      };
    
    case 'INITIALIZE_SETTINGS':
      return {
        ...state,
        timeLeft: action.focusDuration * 60,
        totalCycles: action.totalCycles,
      };
    
    default:
      return state;
  }
}

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Initialize with saved state but don't auto-start
        dispatch({ type: 'SKIP_SESSION', nextSessionType: parsed.sessionType, nextDuration: parsed.timeLeft, nextCycle: parsed.currentCycle });
      } catch (error) {
        console.log('Could not restore pomodoro state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PomodoroContext.Provider value={{ state, dispatch, formatTime }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
