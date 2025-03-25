/**
 * Radix Sort with:
 * - Base-256 optimization for large ranges (k > 1e6)
 * - Signed integer support
 * - Dynamic digit calculation
 */
export function radixSort(arr: number[], base = 256): number[] {
    if (arr.length === 0) return arr;

    // Separate negative and positive numbers
    const negatives = arr.filter(x => x < 0).map(x => -x);
    const positives = arr.filter(x => x >= 0);

    // Sort absolute values
    const sortedNegatives = radixSortCore(negatives, base).reverse().map(x => -x);
    const sortedPositives = radixSortCore(positives, base);

    return [...sortedNegatives, ...sortedPositives];
}

function radixSortCore(arr: number[], base: number): number[] {
    const maxVal = Math.max(...arr);
    let digitPlace = 1;

    while (Math.floor(maxVal / digitPlace) > 0) {
        countingSortByDigit(arr, digitPlace, base);
        digitPlace *= base;
    }
    return arr;
}

function countingSortByDigit(arr: number[], digitPlace: number, base: number): void {
    const count = new Array(base).fill(0);
    const output = new Array(arr.length);

    // Count occurrences of each digit
    for (const num of arr) {
        const digit = Math.floor(num / digitPlace) % base;
        count[digit]++;
    }

    // Compute prefix sums
    for (let i = 1; i < base; i++) {
        count[i] += count[i - 1];
    }

    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / digitPlace) % base;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    // Copy back to original array
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
}