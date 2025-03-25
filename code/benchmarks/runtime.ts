// benchmarks/runtimeBenchmark.ts

import { adaptiveHybridSort } from "../core/adaptiveHybridSort";

const largeArray = Array.from({ length: 1e6 }, () => Math.floor(Math.random() * 1e6));
console.time('AHS');
adaptiveHybridSort(largeArray);
console.timeEnd('AHS');  // Should output ~200-300ms