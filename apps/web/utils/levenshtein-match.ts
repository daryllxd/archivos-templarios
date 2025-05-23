import levenshtein from "js-levenshtein";

const DEFAULT_THRESHOLD = 0.8;

/**
 * Checks if two strings are similar enough based on Levenshtein distance
 * @param str1 First string (user's answer)
 * @param str2 Second string (correct answer)
 * @param threshold Similarity threshold (0 to 1, default: 0.8)
 * @returns Object containing whether strings match and the similarity ratio
 * @throws {RangeError} If threshold is not between 0 and 1
 */
export const isSimilarEnough = (
  str1: string,
  str2: string,
  threshold = DEFAULT_THRESHOLD
): { isMatch: boolean; similarityRatio: number } => {
  // Validate threshold
  if (threshold < 0 || threshold > 1) {
    throw new RangeError(`threshold must be between 0 and 1, got ${threshold}`);
  }

  // Normalize strings for comparison
  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();

  // Handle empty strings
  if (normalized1 === "" && normalized2 === "") {
    return { isMatch: true, similarityRatio: 1 };
  }

  // Calculate Levenshtein distance
  const distance = levenshtein(normalized1, normalized2);

  // Calculate similarity ratio (0 to 1)
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const similarityRatio = maxLength === 0 ? 1 : 1 - distance / maxLength;

  return {
    isMatch: similarityRatio >= threshold,
    similarityRatio,
  };
};
