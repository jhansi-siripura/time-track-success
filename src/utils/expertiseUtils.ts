
export interface ExpertiseLevel {
  label: string;
  emoji: string;
  color: string;
  minHours: number;
  maxHours: number;
}

export const EXPERTISE_LEVELS: ExpertiseLevel[] = [
  { label: 'Newbie / Curious', emoji: '🆕', color: 'bg-gray-100 text-gray-800 border-gray-200', minHours: 0, maxHours: 9 },
  { label: 'Beginner', emoji: '🧪', color: 'bg-blue-100 text-blue-800 border-blue-200', minHours: 10, maxHours: 29 },
  { label: 'Intermediate', emoji: '📘', color: 'bg-orange-100 text-orange-800 border-orange-200', minHours: 30, maxHours: 59 },
  { label: 'Advanced', emoji: '🧠', color: 'bg-purple-100 text-purple-800 border-purple-200', minHours: 60, maxHours: 99 },
  { label: 'Expert', emoji: '🌟', color: 'bg-green-100 text-green-800 border-green-200', minHours: 100, maxHours: 199 },
  { label: 'Master / Specialist', emoji: '🚀', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', minHours: 200, maxHours: Infinity }
];

export const getExpertiseLevel = (hours: number): ExpertiseLevel => {
  return EXPERTISE_LEVELS.find(level => hours >= level.minHours && hours <= level.maxHours) || EXPERTISE_LEVELS[0];
};

export const formatHours = (minutes: number): number => {
  return Math.round((minutes / 60) * 10) / 10; // Round to 1 decimal place
};
