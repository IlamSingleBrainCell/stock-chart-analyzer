// Helper function to be tested (normally imported from a utils file)
const formatPatternName = (name) => {
  if (!name) return '';
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper function to be tested (normally imported from a utils file)
const shuffleArray = (array) => {
  if (!array) return [];
  const newArray = [...array]; // Clone to avoid modifying the original array directly if passed by reference
  let currentIndex = newArray.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

describe('PatternRecognitionGame Utilities', () => {
  describe('formatPatternName', () => {
    it('should correctly format a multi-word hyphenated name', () => {
      expect(formatPatternName('head-and-shoulders')).toBe('Head And Shoulders');
    });

    it('should correctly format a two-word hyphenated name', () => {
      expect(formatPatternName('double-top')).toBe('Double Top');
    });

    it('should correctly format a single-word name', () => {
      expect(formatPatternName('flag')).toBe('Flag');
    });

    it('should return an empty string for null or undefined input', () => {
      expect(formatPatternName(null)).toBe('');
      expect(formatPatternName(undefined)).toBe('');
    });

    it('should return an empty string for an empty string input', () => {
      expect(formatPatternName('')).toBe('');
    });
  });

  describe('shuffleArray', () => {
    const originalArray = [1, 2, 3, 4, 5, 'a', 'b', 'c'];

    it('should return an array of the same length', () => {
      const shuffled = shuffleArray(originalArray);
      expect(shuffled.length).toBe(originalArray.length);
    });

    it('should contain the same elements as the original array', () => {
      const shuffled = shuffleArray(originalArray);
      originalArray.forEach(item => {
        expect(shuffled).toContain(item);
      });
      shuffled.forEach(item => {
        expect(originalArray).toContain(item);
      });
    });

    it('should produce a different order than the original for a non-trivial array', () => {
      // This test might occasionally fail by pure chance if the shuffle results in the same order.
      // For robust testing of "shuffled-ness", multiple iterations or statistical checks are needed.
      // For this demonstration, we check it's not identical.
      const shuffled = shuffleArray(originalArray);
      // Only expect them to be different if the array has more than 1 element to shuffle
      if (originalArray.length > 1) {
        expect(shuffled).not.toEqual(originalArray);
      } else {
        expect(shuffled).toEqual(originalArray);
      }
    });

    it('should handle an empty array', () => {
      expect(shuffleArray([])).toEqual([]);
    });

    it('should handle an array with one element', () => {
      expect(shuffleArray([1])).toEqual([1]);
    });

    it('should return a new array instance', () => {
      const arr = [1, 2, 3];
      const shuffled = shuffleArray(arr);
      expect(shuffled).not.toBe(arr); // Check for different reference
    });
  });
});

// To run these tests, you would typically use a test runner like Jest.
// For example, if Jest is set up in your project (common with Create React App),
// you can run `npm test` or `yarn test` in your terminal.
// This file (PatternRecognitionGame.test.js) should be picked up automatically.

// Note: For testing React components themselves (interactions, rendering, state changes),
// tools like React Testing Library (@testing-library/react) are commonly used.
// The tests above focus on pure utility functions that might be part of the component.
