import { getSimilarity, EQUIVALENT, SIMILAR, NOT_SIMILAR } from '../levelstein';

describe('getSimilarity', () => {
  it('should return EQUIVALENT for identical strings', () => {
    const result = getSimilarity('I am eating food', 'I am eating food');
    expect(result).toBe(EQUIVALENT);
  });
  
  it('should return EQUIVALENT for case insensitive identical strings strings', () => {
    const result = getSimilarity('i AM eating FOOD', 'I am eating food');
    expect(result).toBe(EQUIVALENT);
  });

  it('should return SIMILAR for similar strings', () => {
    const result = getSimilarity('I like to watch movies', 'I like watching movies');
    expect(result).toBe(SIMILAR);
  });

  it('should return SIMILAR for rearranged strings', () => {
    const result = getSimilarity('He ate the delicious cake after dinner.', 'After dinner he ate a delicious cake');
    expect(result).toBe(SIMILAR);
  });

//   Challenge!!
//   it('should return SIMILAR for strings with synonyms', () => {
//     const result = getSimilarity('He is fast', 'He is quick.');
//     expect(result).toBe(SIMILAR);
//   });

  it('should return NOT_SIMILAR for dissimilar strings', () => {
    const result = getSimilarity('He is a fast runner', 'She is a very slow runner');
    expect(result).toBe(NOT_SIMILAR);
  });
});
