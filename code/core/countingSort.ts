export function countingSort(arr: number[], min: number, max: number): number[] {
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    for (const num of arr) count[num - min]++;
    for (let i = 1; i < range; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    return output;
}