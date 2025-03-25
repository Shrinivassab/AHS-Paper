import { adaptiveHybridSort } from './adaptiveHybridSort';
import { countingSort } from './countingSort';
import { quickSort } from './quickSort';
import { radixSort } from './radixSort';

describe('Adaptive Hybrid Sort', () => {
  test('sorts small arrays with Insertion Sort', () => {
    expect(adaptiveHybridSort([5, 2, 3, 1])).toEqual([1, 2, 3, 5]);
  });

  test('handles large-range data with Radix Sort', () => {
    const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1e7));
    expect(adaptiveHybridSort(arr)).toEqual([...arr].sort((a, b) => a - b));
  });

  test('handles empty array', () => {
    expect(adaptiveHybridSort([])).toEqual([]);
  });
  
  test('handles already sorted array', () => {
    expect(adaptiveHybridSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });
  
  test('handles negative numbers correctly', () => {
    expect(adaptiveHybridSort([-3, -1, -2, 0])).toEqual([-3, -2, -1, 0]);
  });
});

describe('Counting Sort', () => {
    test('sorts limited-range arrays', () => {
      const arr = [5, 2, 5, 3, 1, 2];
      expect(countingSort(arr, 1, 5)).toEqual([1, 2, 2, 3, 5, 5]);
    });
  
    test('handles single-value arrays', () => {
      expect(countingSort([3, 3, 3], 3, 3)).toEqual([3, 3, 3]);
    });
  });

  describe('QuickSort', () => {
    test('sorts medium-sized arrays', () => {
      const arr = Array.from({length: 100}, () => Math.floor(Math.random() * 100));
      expect(quickSort([...arr])).toEqual([...arr].sort((a, b) => a - b));
    });
  
    test('handles worst-case scenario', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Already sorted
      expect(quickSort([...arr])).toEqual([...arr]);
    });
  });

  describe('Radix Sort', () => {
    test('handles max integer values', () => {
      const arr = [2147483647, 0, -2147483648];
      expect(radixSort(arr)).toEqual([-2147483648, 0, 2147483647]);
    });
  
    test('sorts large-range data', () => {
      const arr = [1000000, 999999, 1000001];
      expect(radixSort(arr)).toEqual([999999, 1000000, 1000001]);
    });
  });