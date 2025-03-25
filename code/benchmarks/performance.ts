import * as timsort from 'timsort';
import { writeFileSync } from 'fs';
import path from 'path';
import { adaptiveHybridSort } from '../core/adaptiveHybridSort';

// Define the result type with memory metrics
type BenchmarkResult = {
    Dataset: string;
    Size: string;
    'AHS Time (ms)': string;
    'Timsort Time (ms)': string;
    'Speedup (%)': string;
    'AHS Mem (MB)': string;
    'Timsort Mem (MB)': string;
    'Mem Reduction (%)': string;
};

const configs: Array<{name: string, size: number, range: number}> = [
    { name: 'Tiny', size: 100, range: 100 },
    { name: 'Small', size: 1_000, range: 1_000 },
    { name: 'Medium', size: 100_000, range: 100_000 },
    { name: 'Large', size: 1_000_000, range: 1_000_000 }
];

// Memory measurement utility - FIXED SYNTAX ERROR HERE
function getMemoryUsageMB(): number {
    if (process.memoryUsage) {
        const usage = process.memoryUsage();
        return parseFloat((usage.heapUsed / (1024 * 1024)).toFixed(2));
    }
    return 0;
}

async function runBenchmark() {
    const results: BenchmarkResult[] = [];
    const RESULTS_PATH = path.join(__dirname, 'benchmark_results.json');
    
    try {
        for (const {name, size, range} of configs) {
            console.log(`\n=== Benchmarking ${name} dataset (${size.toLocaleString()} elements) ===`);
            
            // Generate dataset in chunks to avoid memory issues
            const arr: number[] = [];
            for (let i = 0; i < size; i += 100_000) {
                const chunkSize = Math.min(100_000, size - i);
                arr.push(...Array.from({length: chunkSize}, () => Math.floor(Math.random() * range)));
            }

            // Warm-up runs (3 iterations)
            console.log('Running warm-up...');
            for (let i = 0; i < 3; i++) {
                adaptiveHybridSort([...arr]);
                timsort.sort([...arr]);
            }

            // Benchmark AHS
            console.log('Testing Adaptive Hybrid Sort...');
            let ahsTime = 0;
            let ahsMem = 0;
            for (let i = 0; i < 5; i++) { // More iterations for stable results
                const copy = [...arr];
                const beforeMem = getMemoryUsageMB();
                const start = process.hrtime.bigint();
                adaptiveHybridSort(copy);
                ahsTime += Number(process.hrtime.bigint() - start) / 1e6;
                ahsMem += getMemoryUsageMB() - beforeMem;
            }

            // Benchmark Timsort
            console.log('Testing Timsort...');
            let timsortTime = 0;
            let timsortMem = 0;
            for (let i = 0; i < 5; i++) {
                const copy = [...arr];
                const beforeMem = getMemoryUsageMB();
                const start = process.hrtime.bigint();
                timsort.sort(copy);
                timsortTime += Number(process.hrtime.bigint() - start) / 1e6;
                timsortMem += getMemoryUsageMB() - beforeMem;
            }

            // Calculate averages
            const avgAhsTime = (ahsTime / 5).toFixed(2);
            const avgTimsortTime = (timsortTime / 5).toFixed(2);
            const avgAhsMem = (ahsMem / 5).toFixed(2);
            const avgTimsortMem = (timsortMem / 5).toFixed(2);

            results.push({
                Dataset: name,
                Size: size.toLocaleString(),
                'AHS Time (ms)': avgAhsTime,
                'Timsort Time (ms)': avgTimsortTime,
                'Speedup (%)': (((timsortTime/ahsTime) - 1) * 100).toFixed(1),
                'AHS Mem (MB)': avgAhsMem,
                'Timsort Mem (MB)': avgTimsortMem,
                'Mem Reduction (%)': (((timsortMem/ahsMem) - 1) * 100).toFixed(1)
            });
        }

        // Save and display results
        writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
        console.log('\n=== Final Results ===');
        console.table(results);
        console.log(`\nResults saved to ${RESULTS_PATH}`);

        return results;
    } catch (err) {
        console.error('Benchmark failed:', err);
        throw err;
    }
}

// Run with error handling
runBenchmark()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));