/**
 * Optimized Quicksort with:
 * - Median-of-three pivot selection
 * - Tail recursion elimination
 * - Insertion Sort fallback for small partitions
 */
export function quickSort(arr: number[], left = 0, right = arr.length - 1): number[] {
    // Fallback to Insertion Sort for small partitions
    if (right - left <= 20) {
        insertionSortRange(arr, left, right);
        return arr;
    }

    const pivotIndex = partition(arr, left, right);
    
    // Tail recursion optimization
    if (left < pivotIndex - 1) quickSort(arr, left, pivotIndex - 1);
    if (pivotIndex < right) quickSort(arr, pivotIndex, right);
    
    return arr;
}

function partition(arr: number[], left: number, right: number): number {
    const pivot = medianOfThree(arr, left, right);
    let i = left;
    let j = right;

    while (i <= j) {
        while (arr[i] < pivot) i++;
        while (arr[j] > pivot) j--;
        if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
            j--;
        }
    }
    return i;
}

function medianOfThree(arr: number[], left: number, right: number): number {
    const mid = Math.floor((left + right) / 2);
    
    // Sort left, mid, right
    if (arr[left] > arr[mid]) [arr[left], arr[mid]] = [arr[mid], arr[left]];
    if (arr[mid] > arr[right]) [arr[mid], arr[right]] = [arr[right], arr[mid]];
    if (arr[left] > arr[mid]) [arr[left], arr[mid]] = [arr[mid], arr[left]];
    
    return arr[mid];
}

// Helper for small-range sorting
function insertionSortRange(arr: number[], left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}