/**
 * Priority utility functions - wrapper around priorityScorer
 * Kept for backward compatibility
 */

import {
  calculatePriorityScore,
  getPriorityColor,
  getPriorityIcon,
  getPriorityLabel,
  type PriorityLevel,
  type ScoringResult,
} from './priorityScorer';

export type { PriorityLevel, ScoringResult };

interface ComplaintData {
  category?: string;
  urgency?: string;
  description?: string;
  attachments?: any[];
  status?: string;
  createdAt?: any;
  [key: string]: any;
}

/**
 * Calculate priority level based on complaint data or description
 * Uses the advanced rule-based scoring system
 * @param complaintOrDescription - The complaint object or description string
 * @returns Priority level (CRITICAL, HIGH, MEDIUM, LOW)
 */
export function calculatePriority(
  complaintOrDescription: ComplaintData | string
): PriorityLevel {
  // Handle string input (description)
  if (typeof complaintOrDescription === 'string') {
    const result = calculatePriorityScore(complaintOrDescription);
    return result.priorityLevel;
  }

  const complaint = complaintOrDescription;
  const result = calculatePriorityScore(
    complaint.description || '',
    complaint.category,
    complaint.createdAt,
    complaint.status
  );

  return result.priorityLevel;
}

/**
 * Calculate full scoring result with breakdown
 */
export function calculatePriorityWithScore(
  complaintOrDescription: ComplaintData | string
): ScoringResult {
  if (typeof complaintOrDescription === 'string') {
    return calculatePriorityScore(complaintOrDescription);
  }

  const complaint = complaintOrDescription;
  return calculatePriorityScore(
    complaint.description || '',
    complaint.category,
    complaint.createdAt,
    complaint.status
  );
}

// Re-export UI helpers for backward compatibility
export { getPriorityColor, getPriorityIcon, getPriorityLabel };
