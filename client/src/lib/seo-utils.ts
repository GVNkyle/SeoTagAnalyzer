/**
 * Utility functions for SEO analysis
 */

/**
 * Format a URL by adding https:// if missing protocol
 */
export function formatUrl(url: string): string {
  if (!url) return '';
  
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}

/**
 * Extracts domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(formatUrl(url));
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

/**
 * Determines the color for a score
 */
export function getScoreColor(score: number): string {
  if (score < 50) return 'red';
  if (score < 70) return 'amber';
  if (score < 90) return 'green';
  return 'emerald';
}

/**
 * Truncates text with ellipsis if longer than maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '…';
}

/**
 * Converts a score to a rating text
 */
export function scoreToRating(score: number): 'Poor' | 'Fair' | 'Good' | 'Excellent' {
  if (score < 50) return 'Poor';
  if (score < 70) return 'Fair';
  if (score < 90) return 'Good';
  return 'Excellent';
}

/**
 * Checks if title length is optimal
 */
export function isTitleLengthOptimal(length: number): boolean {
  return length >= 30 && length <= 60;
}

/**
 * Checks if description length is optimal
 */
export function isDescriptionLengthOptimal(length: number): boolean {
  return length >= 120 && length <= 160;
}
