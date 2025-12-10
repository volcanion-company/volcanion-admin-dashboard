import { format, parseISO, formatDistance, formatDistanceToNow } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format datetime to readable string
 */
export const formatDateTime = (
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy HH:mm'
): string => {
  return formatDate(date, formatStr);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format distance between two dates
 */
export const formatDateDistance = (
  dateLeft: string | Date,
  dateRight: string | Date
): string => {
  try {
    const leftObj = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const rightObj = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return formatDistance(leftObj, rightObj);
  } catch (error) {
    console.error('Error formatting date distance:', error);
    return 'Invalid date';
  }
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};
