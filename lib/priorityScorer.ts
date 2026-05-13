/**
 * Advanced Rule-Based Priority Scoring System
 * 
 * NOT machine learning or AI - purely rule-based and explainable.
 * Suitable for mini project/viva defense.
 */

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScoringResult {
  totalScore: number;
  priorityLevel: PriorityLevel;
  breakdown: {
    keywordScore: number;
    severityBoost: number;
    categoryBoost: number;
    recencyBoost: number;
  };
  matchedKeywords: string[];
  explanation: string;
}

// ============================================================================
// KEYWORD SCORING DICTIONARY
// ============================================================================
// Each keyword has a base score indicating its severity

const KEYWORD_SCORES: { [key: string]: number } = {
  // CRITICAL EMERGENCY (50-60 points)
  fire: 60,
  'on fire': 60,
  burning: 55,
  explosion: 55,
  'chemical leak': 55,
  'gas leak': 55,

  // SEVERE INCIDENTS (40-50 points)
  accident: 50,
  'hit and run': 50,
  'road accident': 50,
  collision: 48,
  injury: 45,
  injured: 45,
  hospital: 45,
  'medical emergency': 45,
  death: 45,
  fatal: 45,

  // SERIOUS ISSUES (25-40 points)
  'water leakage': 35,
  'water shortage': 32,
  'power outage': 35,
  'electricity cut': 35,
  'no electricity': 35,
  flooding: 38,
  flood: 38,
  'open manhole': 30,
  'gas odor': 30,
  stink: 28,
  'bad smell': 28,
  drainage: 25,
  'blocked drain': 28,
  sewer: 25,

  // MODERATE ISSUES (15-25 points)
  pothole: 22,
  'broken road': 22,
  'road damage': 20,
  garbage: 18,
  'garbage dump': 20,
  litter: 15,
  'street light': 18,
  'broken light': 18,
  'streetlight not working': 20,
  construction: 15,
  noise: 12,
  pollution: 20,
  corruption: 25,
  'bribe demand': 28,

  // MINOR ISSUES (5-15 points)
  maintenance: 10,
  repair: 10,
  complaint: 5,
  issue: 5,
  problem: 5,
  feedback: 3,
};

// ============================================================================
// SEVERITY BOOST KEYWORDS
// ============================================================================
// These words boost the final score if found in complaint

const SEVERITY_BOOST_KEYWORDS: { [key: string]: number } = {
  urgent: 15,
  emergency: 20,
  immediately: 15,
  asap: 15,
  critical: 20,
  severe: 15,
  dangerous: 18,
  'life threatening': 25,
  'threat to life': 25,
  risky: 12,
  hazardous: 18,
  children: 10,
  elderly: 10,
  disabled: 10,
  'senior citizen': 10,
  pregnant: 10,
};

// ============================================================================
// CATEGORY BOOST MAPPING
// ============================================================================
// Complaint categories get additional score boost

const CATEGORY_BOOST: { [key: string]: number } = {
  'Water Supply': 15,
  Electricity: 18,
  'Roads & Drainage': 12,
  Sanitation: 10,
  Traffic: 15,
  'Street Lights': 8,
  'Public Health': 20,
  Others: 0,
};

// ============================================================================
// TEXT NORMALIZATION
// ============================================================================

/**
 * Normalize text for keyword matching
 * - Convert to lowercase
 * - Remove punctuation
 * - Remove extra whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()\-]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// ============================================================================
// KEYWORD MATCHING & SCORING
// ============================================================================

/**
 * Extract matched keywords and calculate keyword score
 * Supports multi-word keywords and partial matches
 */
function extractKeywordsAndScore(text: string): {
  score: number;
  keywords: string[];
} {
  const normalizedText = normalizeText(text);
  let totalScore = 0;
  const matchedKeywords: Set<string> = new Set();

  // Sort keywords by length (longest first) to match multi-word keywords first
  const sortedKeywords = Object.keys(KEYWORD_SCORES).sort(
    (a, b) => b.length - a.length
  );

  for (const keyword of sortedKeywords) {
    // Use word boundary matching for single words
    const pattern = keyword.includes(' ')
      ? keyword
      : `\\b${keyword}\\b`;

    const regex = new RegExp(pattern, 'g');
    const matches = (normalizedText.match(regex) || []).length;

    if (matches > 0) {
      const score = KEYWORD_SCORES[keyword];
      // If keyword appears multiple times, count it multiple times
      totalScore += score * matches;
      matchedKeywords.add(keyword);
    }
  }

  return {
    score: totalScore,
    keywords: Array.from(matchedKeywords),
  };
}

// ============================================================================
// SEVERITY BOOST CALCULATION
// ============================================================================

/**
 * Calculate severity boost based on urgent/critical keywords
 */
function calculateSeverityBoost(text: string): number {
  const normalizedText = normalizeText(text);
  let severityBoost = 0;
  const foundSeverityKeywords: string[] = [];

  for (const keyword of Object.keys(SEVERITY_BOOST_KEYWORDS)) {
    const pattern = keyword.includes(' ')
      ? keyword
      : `\\b${keyword}\\b`;

    const regex = new RegExp(pattern, 'g');
    const matches = (normalizedText.match(regex) || []).length;

    if (matches > 0) {
      severityBoost += SEVERITY_BOOST_KEYWORDS[keyword] * matches;
      foundSeverityKeywords.push(keyword);
    }
  }

  // Boost if multiple severity keywords exist (compound threat)
  if (foundSeverityKeywords.length >= 2) {
    severityBoost += 10;
  }

  return severityBoost;
}

// ============================================================================
// CATEGORY BOOST
// ============================================================================

/**
 * Get category boost based on complaint category
 */
function getCategoryBoost(category?: string): number {
  if (!category) return 0;
  return CATEGORY_BOOST[category] || 0;
}

// ============================================================================
// RECENCY BOOST
// ============================================================================

/**
 * Calculate recency boost for old pending complaints
 * Older complaints should get higher priority
 */
function getRecencyBoost(createdAt?: any, status?: string): number {
  if (!createdAt || status !== 'PENDING') return 0;

  try {
    const createdDate = new Date(
      createdAt?.seconds ? createdAt.seconds * 1000 : createdAt
    );
    const daysDifference = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference > 30) return 25; // Very old: +25
    if (daysDifference > 14) return 15; // Old: +15
    if (daysDifference > 7) return 10; // Moderately old: +10
    return 0;
  } catch {
    return 0;
  }
}

// ============================================================================
// PRIORITY LEVEL DETERMINATION
// ============================================================================

/**
 * Determine priority level based on total score
 */
function getPriorityLevelFromScore(score: number): PriorityLevel {
  if (score >= 70) return 'CRITICAL';
  if (score >= 40) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'LOW';
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate comprehensive priority score for a complaint
 *
 * @param complaintText - The complaint description
 * @param category - The complaint category
 * @param createdAt - When the complaint was created
 * @param status - Current status of complaint
 * @returns ScoringResult with score, priority level, and breakdown
 *
 * SCORING BREAKDOWN:
 * 1. Keyword Score: Base score from matched keywords
 * 2. Severity Boost: Extra points for urgent/critical keywords
 * 3. Category Boost: Additional points based on category type
 * 4. Recency Boost: Extra points for old pending complaints
 *
 * PRIORITY LEVELS:
 * - CRITICAL: 70+ points (immediate action required)
 * - HIGH: 40-69 points (urgent attention needed)
 * - MEDIUM: 20-39 points (normal priority)
 * - LOW: <20 points (routine issue)
 */
export function calculatePriorityScore(
  complaintText: string,
  category?: string,
  createdAt?: any,
  status?: string
): ScoringResult {
  // Validate input
  if (!complaintText || typeof complaintText !== 'string') {
    return getDefaultScoringResult(0, 'LOW', 'Invalid complaint text');
  }

  // Extract keywords and calculate base keyword score
  const { score: keywordScore, keywords: matchedKeywords } =
    extractKeywordsAndScore(complaintText);

  // Calculate severity boost for urgent/critical language
  const severityBoost = calculateSeverityBoost(complaintText);

  // Get category boost
  const categoryBoost = getCategoryBoost(category);

  // Get recency boost for old pending complaints
  const recencyBoost = getRecencyBoost(createdAt, status);

  // Calculate total score
  const totalScore = keywordScore + severityBoost + categoryBoost + recencyBoost;

  // Determine priority level
  const priorityLevel = getPriorityLevelFromScore(totalScore);

  // Generate explanation
  const explanation = generateExplanation(
    totalScore,
    {
      keywordScore,
      severityBoost,
      categoryBoost,
      recencyBoost,
    },
    matchedKeywords,
    priorityLevel
  );

  return {
    totalScore,
    priorityLevel,
    breakdown: {
      keywordScore,
      severityBoost,
      categoryBoost,
      recencyBoost,
    },
    matchedKeywords,
    explanation,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate human-readable explanation of the score
 */
function generateExplanation(
  totalScore: number,
  breakdown: ScoringResult['breakdown'],
  keywords: string[],
  priority: PriorityLevel
): string {
  let explanation = `[${priority}] Score: ${totalScore} | `;

  const parts: string[] = [];

  if (breakdown.keywordScore > 0) {
    parts.push(`Keywords: ${breakdown.keywordScore}`);
  }
  if (breakdown.severityBoost > 0) {
    parts.push(`Urgency: +${breakdown.severityBoost}`);
  }
  if (breakdown.categoryBoost > 0) {
    parts.push(`Category: +${breakdown.categoryBoost}`);
  }
  if (breakdown.recencyBoost > 0) {
    parts.push(`Age: +${breakdown.recencyBoost}`);
  }

  explanation += parts.join(' | ');

  if (keywords.length > 0) {
    explanation += ` | Keywords: ${keywords.slice(0, 3).join(', ')}`;
    if (keywords.length > 3) {
      explanation += ` +${keywords.length - 3} more`;
    }
  }

  return explanation;
}

/**
 * Get default scoring result for invalid input
 */
function getDefaultScoringResult(
  score: number,
  priority: PriorityLevel,
  reason: string
): ScoringResult {
  return {
    totalScore: score,
    priorityLevel: priority,
    breakdown: {
      keywordScore: 0,
      severityBoost: 0,
      categoryBoost: 0,
      recencyBoost: 0,
    },
    matchedKeywords: [],
    explanation: `[${priority}] ${reason}`,
  };
}

// ============================================================================
// UTILITY FUNCTIONS FOR UI
// ============================================================================

/**
 * Get color for priority badge
 */
export function getPriorityColor(priority?: PriorityLevel | string): string {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get icon for priority
 */
export function getPriorityIcon(priority?: PriorityLevel | string): string {
  switch (priority) {
    case 'CRITICAL':
      return '🚨';
    case 'HIGH':
      return '⚠️';
    case 'MEDIUM':
      return '⏱️';
    case 'LOW':
      return '✅';
    default:
      return '❓';
  }
}

/**
 * Get label for priority
 */
export function getPriorityLabel(priority?: PriorityLevel | string): string {
  switch (priority) {
    case 'CRITICAL':
      return 'Critical';
    case 'HIGH':
      return 'High';
    case 'MEDIUM':
      return 'Medium';
    case 'LOW':
      return 'Low';
    default:
      return 'Unknown';
  }
}

/**
 * Get scoring thresholds for reference
 */
export function getScoringThresholds() {
  return {
    CRITICAL: { min: 70, icon: '🚨', color: 'red' },
    HIGH: { min: 40, max: 69, icon: '⚠️', color: 'orange' },
    MEDIUM: { min: 20, max: 39, icon: '⏱️', color: 'yellow' },
    LOW: { min: 0, max: 19, icon: '✅', color: 'green' },
  };
}

/**
 * Get keyword dictionary for reference
 */
export function getKeywordDictionary() {
  return {
    criticalEmergency: {
      keywords: ['fire', 'burning', 'explosion', 'chemical leak'],
      range: '50-60 points',
    },
    severeIncidents: {
      keywords: ['accident', 'injury', 'hospital', 'death'],
      range: '40-50 points',
    },
    seriousIssues: {
      keywords: ['water leakage', 'power outage', 'flooding'],
      range: '25-40 points',
    },
    moderateIssues: {
      keywords: ['pothole', 'garbage', 'street light'],
      range: '15-25 points',
    },
    minorIssues: {
      keywords: ['maintenance', 'repair', 'feedback'],
      range: '5-15 points',
    },
  };
}
