export interface SearchStep {
  left: number;
  right: number;
  mid: number;
  comparing: number;
  depth?: number;
}

export interface SearchResult {
  found: boolean;
  index: number;
  comparisons: number;
  steps: SearchStep[];
  executionTime: number;
  maxDepth?: number;
}


export interface PerformanceData {
  size: number;
  iterativeTimeAvg: number;
  recursiveTimeAvg: number;
  iterativeComparisons: number;
  recursiveComparisons: number;
  iterativeTimeStdDev?: number;
  recursiveTimeStdDev?: number;
  iterativeMinTime?: number;
  iterativeMaxTime?: number;
  recursiveMinTime?: number;
  recursiveMaxTime?: number;
  theoreticalComparisons?: number;
  memoryEstimate?: string;
}

export function binarySearchIterative(
  arr: number[],
  target: number
): SearchResult {
  const steps: SearchStep[] = [];
  let comparisons = 0;
  let left = 0;
  let right = arr.length - 1;
  
  const startTime = performance.now();
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    comparisons++;
    
    steps.push({ left, right, mid, comparing: arr[mid] });
    
    if (arr[mid] === target) {
      const executionTime = performance.now() - startTime;
      return {
        found: true,
        index: mid,
        comparisons,
        steps,
        executionTime,
      };
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  const executionTime = performance.now() - startTime;
  return {
    found: false,
    index: -1,
    comparisons,
    steps,
    executionTime,
  };
}

export function binarySearchRecursive(
  arr: number[],
  target: number
): SearchResult {
  const steps: SearchStep[] = [];
  let comparisons = 0;
  let maxDepth = 0;
  
  const startTime = performance.now();
  
  function search(left: number, right: number, depth: number): number {
    maxDepth = Math.max(maxDepth, depth);
    
    if (left > right) return -1;
    
    const mid = left + Math.floor((right - left) / 2);
    comparisons++;
    
    steps.push({ left, right, mid, comparing: arr[mid], depth });
    
    if (arr[mid] === target) return mid;
    
    if (arr[mid] < target) {
      return search(mid + 1, right, depth + 1);
    } else {
      return search(left, mid - 1, depth + 1);
    }
  }
  
  const index = search(0, arr.length - 1, 0);
  const executionTime = performance.now() - startTime;
  
  return {
    found: index !== -1,
    index,
    comparisons,
    steps,
    executionTime,
    maxDepth,
  };
}

// =======================
// Utils
// =======================

export function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

function calculateStats(values: number[]) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) /
    (values.length - 1);
  const stdDev = Math.sqrt(variance);

  return {
    avg,
    min: Math.min(...values),
    max: Math.max(...values),
    stdDev,
  };
}

// =======================
// Performance Test Helpers
// =======================

function binarySearchIterativeFast(
  arr: number[],
  target: number
): number {
  let comparisons = 0;
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    comparisons++;

    if (arr[mid] === target) return comparisons;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return comparisons;
}

function binarySearchRecursiveFast(
  arr: number[],
  target: number
): number {
  let comparisons = 0;

  function search(left: number, right: number): number {
    if (left > right) return -1;

    const mid = left + Math.floor((right - left) / 2);
    comparisons++;

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      return search(mid + 1, right);
    } else {
      return search(left, mid - 1);
    }
  }

  search(0, arr.length - 1);
  return comparisons;
}

// =======================
// Performance Test
// =======================

export function runPerformanceTests(
  sizes: number[],
  batches: number = 20,
  runsPerBatch: number = 1000
) {
  return sizes.map((size) => {
    const arr = generateSortedArray(size);
    const target = arr[Math.floor(size / 2)];

    const iterativeTimes: number[] = [];
    const recursiveTimes: number[] = [];
    const iterativeComparisons: number[] = [];
    const recursiveComparisons: number[] = [];

    // 🔥 Warm-up (JIT)
    for (let i = 0; i < 1000; i++) {
      binarySearchIterativeFast(arr, target);
      binarySearchRecursiveFast(arr, target);
    }

    for (let b = 0; b < batches; b++) {
      // Iterative
      let compIter = 0;
      let start = performance.now();
      for (let i = 0; i < runsPerBatch; i++) {
        compIter += binarySearchIterativeFast(arr, target);
      }
      const iterTime = (performance.now() - start) / runsPerBatch;
      iterativeTimes.push(iterTime);
      iterativeComparisons.push(compIter / runsPerBatch);

      // Recursive
      let compRec = 0;
      start = performance.now();
      for (let i = 0; i < runsPerBatch; i++) {
        compRec += binarySearchRecursiveFast(arr, target);
      }
      const recTime = (performance.now() - start) / runsPerBatch;
      recursiveTimes.push(recTime);
      recursiveComparisons.push(compRec / runsPerBatch);
    }

    const iterStats = calculateStats(iterativeTimes);
    const recStats = calculateStats(recursiveTimes);

    const iterCompAvg = iterativeComparisons.reduce((a, b) => a + b, 0) / batches;
    const recCompAvg = recursiveComparisons.reduce((a, b) => a + b, 0) / batches;
    const theoreticalComp = Math.ceil(Math.log2(size));
    const memoryMB = (size * 8) / (1024 * 1024);

    return {
      size,
      iterativeTimeAvg: iterStats.avg,
      recursiveTimeAvg: recStats.avg,
      iterativeComparisons: iterCompAvg,
      recursiveComparisons: recCompAvg,
      iterativeTimeStdDev: iterStats.stdDev,
      recursiveTimeStdDev: recStats.stdDev,
      iterativeMinTime: iterStats.min,
      iterativeMaxTime: iterStats.max,
      recursiveMinTime: recStats.min,
      recursiveMaxTime: recStats.max,
      theoreticalComparisons: theoreticalComp,
      memoryEstimate: memoryMB > 1 ? `${memoryMB.toFixed(2)} MB` : `${(size * 8 / 1024).toFixed(2)} KB`,
    };
  });
}
