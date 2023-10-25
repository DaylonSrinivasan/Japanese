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
    const result = getSimilarity('i will have dinner tonight', 'Tonight I am going to have dinner');
    expect(result).toBe(SIMILAR);
  });

  it('should return NOT_SIMILAR for dissimilar strings', () => {
    const result = getSimilarity('He is a fast runner', 'She is a very quick runner');
    expect(result).toBe(NOT_SIMILAR);
  });
});
