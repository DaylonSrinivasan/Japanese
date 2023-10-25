export const EQUIVALENT = 'equivalent';
export const SIMILAR = 'similar';
export const NOT_SIMILAR = 'not_similar';

const SIMILARITY_THRESHOLD = 0.6;

export function getSimilarity(str1: string, str2: string): string {
    function calculateLevenshteinDistance(s1: string, s2: string): number {
      const m = s1.length;
      const n = s2.length;
      const dp: number[][] = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));
  
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
      return dp[m][n];
    }
  
    const distance = calculateLevenshteinDistance(str1.trim().toLowerCase(), str2.trim().toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - distance / maxLength;
    console.log('Similarity between ' + str1 + ' and ' + str2 + ' is ' + similarity);
    if (similarity === 1.0) {
      return EQUIVALENT;
    }
    else if (similarity >= SIMILARITY_THRESHOLD) {
      return SIMILAR;
    }
    else {
      return NOT_SIMILAR;
    }
  }