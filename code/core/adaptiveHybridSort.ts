import { insertionSort } from './insertionSort';
import { countingSort } from './countingSort';
import { radixSort } from './radixSort';
import { quickSort } from './quickSort';
import { execSync } from 'child_process';
import path from 'path';

// Strategy type for better type safety
type SortingStrategy = 'insertion' | 'counting' | 'radix' | 'quick';

/**
 * Adaptive Hybrid Sort (AHS) - Core Algorithm with ML Integration
 * Dynamically selects between:
 * - Insertion Sort (n ≤ 20)
 * - Counting Sort (k ≤ 1000)
 * - Radix Sort (k > 1e6 && H < 8.0)
 * - ML-predicted strategy (fallback)
 */
export function adaptiveHybridSort(arr: number[]): number[] {
    // Edge cases
    if (arr.length <= 1) return arr;
    if (new Set(arr).size === 1) return arr; // All elements identical

    const n = arr.length;
    const min = safeMin(arr);
    const max = safeMax(arr);
    const k = max - min + 1;
    const H = calculateEntropy(arr);

    // Threshold-based strategies
    if (n <= 20) return insertionSort([...arr]);
    if (k <= 1000) return countingSort([...arr], min, max);
    if (k > 1e6 && H < 8.0) return radixSort([...arr]);

    // ML-based fallback strategy
    const strategy = predictStrategy(n, k, H);
    return executeStrategy(strategy, arr, min, max);
}

// Helper functions
function safeMin(arr: number[]): number {
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}

function safeMax(arr: number[]): number {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

function calculateEntropy(arr: number[]): number {
    const frequency = new Map<number, number>();
    for (const num of arr) {
        frequency.set(num, (frequency.get(num) || 0) + 1);
    }

    let entropy = 0;
    const n = arr.length;
    for (const count of frequency.values()) {
        const p = count / n;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

function predictStrategy(n: number, k: number, H: number): SortingStrategy {
    try {
        // Use local Python executable path if needed
        const pythonPath = process.env.PYTHON_PATH || 'python';
        const scriptPath = path.join(__dirname, '../ml/predict.py');
        
        const command = `${pythonPath} ${scriptPath} ${n} ${k} ${H}`;
        const result = execSync(command, { 
            stdio: 'pipe',
            timeout: 2000 // 2 second timeout
        }).toString().trim();
        
        return validateStrategy(result);
    } catch (err) {
        console.error('Strategy prediction failed:', err);
        return 'quick'; // Default fallback
    }
}

function validateStrategy(str: string): SortingStrategy {
    const validStrategies: SortingStrategy[] = ['insertion', 'counting', 'radix', 'quick'];
    return validStrategies.includes(str as SortingStrategy) 
        ? str as SortingStrategy 
        : 'quick';
}

function executeStrategy(
    strategy: SortingStrategy,
    arr: number[],
    min?: number,
    max?: number
): number[] {
    switch (strategy) {
        case 'insertion':
            return insertionSort([...arr]);
        case 'counting':
            if (min === undefined || max === undefined) {
                throw new Error('Min/max required for counting sort');
            }
            return countingSort([...arr], min, max);
        case 'radix':
            return radixSort([...arr]);
        case 'quick':
            return quickSort([...arr]);
        default:
            return quickSort([...arr]);
    }
}