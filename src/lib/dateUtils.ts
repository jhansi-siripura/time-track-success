
/**
 * Date utilities for consistent timezone handling across the app
 */

/**
 * Get today's date in YYYY-MM-DD format using user's local timezone
 * This ensures "today" is calculated based on the user's location, not UTC
 */
export const getTodayDate = (): string => {
  return new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format
};

/**
 * Get yesterday's date in YYYY-MM-DD format using user's local timezone
 */
export const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString('en-CA');
};

/**
 * Get a date N days ago in YYYY-MM-DD format using user's local timezone
 */
export const getDaysAgoDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-CA');
};

/**
 * Get an array of dates for the last N days in YYYY-MM-DD format
 */
export const getLastNDates = (n: number): string[] => {
  return Array.from({ length: n }, (_, i) => getDaysAgoDate(i));
};

/**
 * Get the start of the current week (Monday) in user's local timezone
 */
export const getStartOfWeek = (): Date => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Get current month in YYYY-MM format using user's local timezone
 */
export const getCurrentMonth = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Check if two date strings represent the same day
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Check if a date string represents today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDate();
};

/**
 * Check if a date string represents yesterday
 */
export const isYesterday = (dateString: string): boolean => {
  return dateString === getYesterdayDate();
};
