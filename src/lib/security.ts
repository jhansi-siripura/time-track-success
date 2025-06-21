
// Security utility functions for the application
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates that a user_id is a valid UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential script tags and dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates authentication state before performing operations
 */
export const validateAuthState = async (): Promise<{ isValid: boolean; userId?: string; error?: string }> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth validation error:', error);
      return { isValid: false, error: 'Authentication error' };
    }
    
    if (!session?.user) {
      return { isValid: false, error: 'Not authenticated' };
    }
    
    if (!isValidUUID(session.user.id)) {
      return { isValid: false, error: 'Invalid user ID format' };
    }
    
    return { isValid: true, userId: session.user.id };
  } catch (error) {
    console.error('Auth validation exception:', error);
    return { isValid: false, error: 'Authentication validation failed' };
  }
};

/**
 * Rate limiting helper - simple client-side implementation
 */
class RateLimiter {
  private requests: { [key: string]: number[] } = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests[identifier]) {
      this.requests[identifier] = [];
    }
    
    // Remove old requests outside the window
    this.requests[identifier] = this.requests[identifier].filter(time => time > windowStart);
    
    // Check if under the limit
    if (this.requests[identifier].length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    this.requests[identifier].push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Validates study log data before submission
 */
export const validateStudyLogData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields validation
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  }
  
  if (!data.date || typeof data.date !== 'string') {
    errors.push('Date is required');
  }
  
  if (!data.time || typeof data.time !== 'string') {
    errors.push('Time is required');
  }
  
  if (!data.duration || typeof data.duration !== 'number' || data.duration <= 0) {
    errors.push('Duration must be a positive number');
  }
  
  // Data length validation
  if (data.subject && data.subject.length > 100) {
    errors.push('Subject must be less than 100 characters');
  }
  
  if (data.topic && data.topic.length > 100) {
    errors.push('Topic must be less than 100 characters');
  }
  
  if (data.source && data.source.length > 200) {
    errors.push('Source must be less than 200 characters');
  }
  
  if (data.achievements && data.achievements.length > 500) {
    errors.push('Achievements must be less than 500 characters');
  }
  
  if (data.comments && data.comments.length > 500) {
    errors.push('Comments must be less than 500 characters');
  }
  
  // Date validation
  if (data.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.push('Date must be in YYYY-MM-DD format');
    }
  }
  
  // Time validation
  if (data.time) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.time)) {
      errors.push('Time must be in HH:MM format');
    }
  }
  
  // Duration validation (max 24 hours = 1440 minutes)
  if (data.duration && data.duration > 1440) {
    errors.push('Duration cannot exceed 24 hours');
  }
  
  return { isValid: errors.length === 0, errors };
};
