export function calculateSimilarity(str1: string, str2: string): number {  
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
    return similarity;
  }
  