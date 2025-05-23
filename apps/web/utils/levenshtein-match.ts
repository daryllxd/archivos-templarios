import levenshtein from "js-levenshtein";

/**
 * Checks if two strings are similar enough based on Levenshtein distance
 * @param str1 First string (user's answer)
 * @param str2 Second string (correct answer)
 * @param threshold Similarity threshold (0 to 1, default: 0.8)
 * @returns Object containing whether strings match and the similarity ratio
 */
export const isSimilarEnough = (
  str1: string,
  str2: string,
  threshold = 0.8
): { isMatch: boolean; similarityRatio: number } => {
  // Normalize strings for comparison
  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();

  // Calculate Levenshtein distance
  const distance = levenshtein(normalized1, normalized2);

  // Calculate similarity ratio (0 to 1)
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const similarityRatio = 1 - distance / maxLength;

  return {
    isMatch: similarityRatio >= threshold,
    similarityRatio,
  };
};
