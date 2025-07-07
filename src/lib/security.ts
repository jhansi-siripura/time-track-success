// Security utility functions for the application
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

/**
 * Validates that a user_id is a valid UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Enhanced sanitization for user input with comprehensive XSS prevention
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // First pass: Remove dangerous patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, 'blocked:')
    .replace(/data:/gi, 'blocked:')
    .replace(/vbscript:/gi, 'blocked:')
    .replace(/on\w+\s*=/gi, '')
    .replace(/expression\s*\(/gi, 'blocked(')
    .replace(/url\s*\(/gi, 'blocked(');
  
  // Second pass: HTML entity encoding for remaining content
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
    
  return sanitized.trim();
};

/**
 * Sanitizes HTML content for rich text editors
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    ALLOWED_ATTR: ['class', 'style'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'href', 'src'],
  });
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
 * Enhanced Rate limiting helper with per-endpoint tracking
 */
class RateLimiter {
  private requests: { [key: string]: number[] } = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private suspiciousActivity: { [key: string]: number } = {};

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(identifier: string, endpoint?: string): boolean {
    const key = endpoint ? `${identifier}:${endpoint}` : identifier;
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests[key]) {
      this.requests[key] = [];
    }
    
    // Remove old requests outside the window
    this.requests[key] = this.requests[key].filter(time => time > windowStart);
    
    // Check if under the limit
    if (this.requests[key].length >= this.maxRequests) {
      // Track suspicious activity
      this.suspiciousActivity[identifier] = (this.suspiciousActivity[identifier] || 0) + 1;
      console.warn(`Rate limit exceeded for ${identifier} on ${endpoint || 'general'}`);
      return false;
    }
    
    // Add current request
    this.requests[key].push(now);
    return true;
  }

  getSuspiciousActivityCount(identifier: string): number {
    return this.suspiciousActivity[identifier] || 0;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Enhanced file validation with security checks
 */
export const validateFileUpload = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 1024 * 1024; // 1MB
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push('File size too large. Maximum size is 1MB.');
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.php$/i, /\.js$/i, /\.html$/i, /\.htm$/i, /\.exe$/i, /\.bat$/i,
    /\.cmd$/i, /\.scr$/i, /\.vbs$/i, /\.jar$/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File name contains suspicious patterns.');
  }
  
  // Sanitize file name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (sanitizedName !== file.name) {
    console.warn('File name was sanitized:', { original: file.name, sanitized: sanitizedName });
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Enhanced study log data validation with XSS prevention
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
  
  // Data length validation with stricter limits
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
  
  if (data.notes && data.notes.length > 2000) {
    errors.push('Notes must be less than 2000 characters');
  }
  
  // XSS pattern detection
  const xssPatterns = [
    /<script/i, /javascript:/i, /on\w+\s*=/i, /expression\s*\(/i,
    /<iframe/i, /<object/i, /<embed/i, /vbscript:/i, /data:\s*text\/html/i
  ];
  
  const fieldsToCheck = ['subject', 'topic', 'source', 'achievements', 'notes'];
  fieldsToCheck.forEach(field => {
    if (data[field] && typeof data[field] === 'string') {
      if (xssPatterns.some(pattern => pattern.test(data[field]))) {
        errors.push(`${field} contains potentially dangerous content`);
      }
    }
  });
  
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

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();
  
  static generateToken(identifier: string): string {
    const token = crypto.getRandomValues(new Uint8Array(32))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    this.tokens.set(identifier, {
      token,
      expires: Date.now() + (60 * 60 * 1000) // 1 hour
    });
    
    return token;
  }
  
  static validateToken(identifier: string, token: string): boolean {
    const stored = this.tokens.get(identifier);
    if (!stored) return false;
    
    if (Date.now() > stored.expires) {
      this.tokens.delete(identifier);
      return false;
    }
    
    return stored.token === token;
  }
  
  static cleanupExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.tokens.entries()) {
      if (now > value.expires) {
        this.tokens.delete(key);
      }
    }
  }
}

// Clean up expired CSRF tokens every 30 minutes
setInterval(() => CSRFProtection.cleanupExpired(), 30 * 60 * 1000);
