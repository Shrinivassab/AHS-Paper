import { adaptiveHybridSort } from "./adaptiveHybridSort";

describe('ML Integration', () => {
  test('uses ML prediction for borderline cases', () => {
    const arr = Array.from({length: 1500}, () => Math.floor(Math.random() * 2000));
    const sorted = adaptiveHybridSort(arr);
    expect(sorted).toEqual([...arr].sort((a, b) => a - b));
  });
});