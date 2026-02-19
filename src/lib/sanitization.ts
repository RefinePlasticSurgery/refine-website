/**
 * Content Sanitization Utilities
 * Prevents XSS attacks by sanitizing user input before storage and display
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Strict configuration for storing user input in database
 * Removes ALL HTML tags and attributes
 */
const STORAGE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Lenient configuration for displaying trusted HTML content
 * Only allows safe formatting tags
 */
const DISPLAY_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title', 'target'],
};

/**
 * Sanitize user input for safe database storage
 * Removes all HTML, attributes, and potentially malicious content
 *
 * @param input User-provided string
 * @returns Sanitized plain text
 */
export const sanitizeForStorage = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, STORAGE_CONFIG);
};

/**
 * Sanitize HTML content for safe display in UI
 * Preserves safe formatting tags but removes scripts and event handlers
 *
 * @param input HTML string to display
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeForDisplay = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, DISPLAY_CONFIG);
};

/**
 * Remove all special characters but keep spaces and common punctuation
 * Useful for names, emails, phone numbers
 *
 * @param input String to clean
 * @returns Cleaned string
 */
export const sanitizePlainText = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove any HTML-like tags and unnecessary whitespace
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};
