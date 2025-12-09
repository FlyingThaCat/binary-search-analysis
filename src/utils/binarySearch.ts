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
  maxDepth?: number; // For recursive calls
}

// Iterative Binary Search
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
    // Fixed: Prevent potential integer overflow (though JavaScript uses floating point)
    // Using left + Math.floor((right - left) / 2) is safer for very large arrays
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

// Recursive Binary Search
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
    
    if (left > right) {
      return -1;
    }
    
    // Fixed: Prevent potential integer overflow
    const mid = left + Math.floor((right - left) / 2);
    comparisons++;
    
    steps.push({ left, right, mid, comparing: arr[mid], depth });
    
    if (arr[mid] === target) {
      return mid;
    }
    
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

// Generate sorted array
export function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

// Performance testing
export interface PerformanceData {
  size: number;
  iterativeTime: number;
  recursiveTime: number;
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

export interface DetailedPerformanceMetrics {
  arraySize: number;
  iterations: number;
  iterative: {
    avgTime: number;
    minTime: number;
    maxTime: number;
    stdDev: number;
    median: number;
    p95: number;
    p99: number;
    avgComparisons: number;
    worstCaseComparisons: number;
    bestCaseComparisons: number;
  };
  recursive: {
    avgTime: number;
    minTime: number;
    maxTime: number;
    stdDev: number;
    median: number;
    p95: number;
    p99: number;
    avgComparisons: number;
    worstCaseComparisons: number;
    bestCaseComparisons: number;
    maxDepth: number;
  };
  theoretical: {
    logN: number;
    expectedComparisons: number;
  };
  memoryEstimate: {
    arrayBytes: number;
    iterativeStackDepth: number;
    recursiveStackDepth: number;
  };
}

function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / sorted.length;
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  return {
    avg,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev,
    median,
    p95,
    p99,
  };
}

export function runPerformanceTests(
  sizes: number[],
  iterations: number = 100
): PerformanceData[] {
  return sizes.map((size) => {
    const arr = generateSortedArray(size);
    let iterativeTimeTotal = 0;
    let recursiveTimeTotal = 0;
    let iterativeComparisonsTotal = 0;
    let recursiveComparisonsTotal = 0;
    
    const iterativeTimes: number[] = [];
    const recursiveTimes: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Random target
      const target = Math.floor(Math.random() * size) + 1;
      
      const iterativeResult = binarySearchIterative(arr, target);
      iterativeTimeTotal += iterativeResult.executionTime;
      iterativeComparisonsTotal += iterativeResult.comparisons;
      iterativeTimes.push(iterativeResult.executionTime);
      
      const recursiveResult = binarySearchRecursive(arr, target);
      recursiveTimeTotal += recursiveResult.executionTime;
      recursiveComparisonsTotal += recursiveResult.comparisons;
      recursiveTimes.push(recursiveResult.executionTime);
    }
    
    const iterativeStats = calculateStats(iterativeTimes);
    const recursiveStats = calculateStats(recursiveTimes);
    const theoreticalComparisons = Math.ceil(Math.log2(size));
    const memoryMB = (size * 8) / (1024 * 1024);
    
    return {
      size,
      iterativeTime: iterativeTimeTotal / iterations,
      recursiveTime: recursiveTimeTotal / iterations,
      iterativeComparisons: iterativeComparisonsTotal / iterations,
      recursiveComparisons: recursiveComparisonsTotal / iterations,
      iterativeTimeStdDev: iterativeStats.stdDev,
      recursiveTimeStdDev: recursiveStats.stdDev,
      iterativeMinTime: iterativeStats.min,
      iterativeMaxTime: iterativeStats.max,
      recursiveMinTime: recursiveStats.min,
      recursiveMaxTime: recursiveStats.max,
      theoreticalComparisons,
      memoryEstimate: memoryMB > 1 ? `${memoryMB.toFixed(2)} MB` : `${(size * 8 / 1024).toFixed(2)} KB`,
    };
  });
}

export function runDetailedPerformanceTest(
  arraySize: number,
  iterations: number = 1000
): DetailedPerformanceMetrics {
  console.log(`Running detailed performance test for array size: ${arraySize.toLocaleString()}`);
  const arr = generateSortedArray(arraySize);
  
  const iterativeTimes: number[] = [];
  const recursiveTimes: number[] = [];
  const iterativeComparisons: number[] = [];
  const recursiveComparisons: number[] = [];
  let maxRecursiveDepth = 0;
  
  // Test various scenarios: best case, worst case, average case
  const targets = [
    // Best case: middle element
    ...Array(Math.floor(iterations * 0.2)).fill(Math.floor(arraySize / 2) + 1),
    // Worst case: not in array or at edges
    ...Array(Math.floor(iterations * 0.2)).fill(arraySize + 1),
    // Random targets
    ...Array.from({ length: Math.floor(iterations * 0.6) }, () => 
      Math.floor(Math.random() * arraySize) + 1
    ),
  ];
  
  for (const target of targets) {
    const iterativeResult = binarySearchIterative(arr, target);
    iterativeTimes.push(iterativeResult.executionTime);
    iterativeComparisons.push(iterativeResult.comparisons);
    
    const recursiveResult = binarySearchRecursive(arr, target);
    recursiveTimes.push(recursiveResult.executionTime);
    recursiveComparisons.push(recursiveResult.comparisons);
    maxRecursiveDepth = Math.max(maxRecursiveDepth, recursiveResult.maxDepth || 0);
  }
  
  const iterativeTimeStats = calculateStats(iterativeTimes);
  const recursiveTimeStats = calculateStats(recursiveTimes);
  
  const avgIterativeComparisons = iterativeComparisons.reduce((a, b) => a + b, 0) / iterativeComparisons.length;
  const avgRecursiveComparisons = recursiveComparisons.reduce((a, b) => a + b, 0) / recursiveComparisons.length;
  const worstCaseIterative = Math.max(...iterativeComparisons);
  const worstCaseRecursive = Math.max(...recursiveComparisons);
  const bestCaseIterative = Math.min(...iterativeComparisons);
  const bestCaseRecursive = Math.min(...recursiveComparisons);
  
  const logN = Math.log2(arraySize);
  const expectedComparisons = Math.ceil(logN);
  const arrayBytes = arraySize * 8; // 8 bytes per number in JavaScript
  
  return {
    arraySize,
    iterations,
    iterative: {
      avgTime: iterativeTimeStats.avg,
      minTime: iterativeTimeStats.min,
      maxTime: iterativeTimeStats.max,
      stdDev: iterativeTimeStats.stdDev,
      median: iterativeTimeStats.median,
      p95: iterativeTimeStats.p95,
      p99: iterativeTimeStats.p99,
      avgComparisons: avgIterativeComparisons,
      worstCaseComparisons: worstCaseIterative,
      bestCaseComparisons: bestCaseIterative,
    },
    recursive: {
      avgTime: recursiveTimeStats.avg,
      minTime: recursiveTimeStats.min,
      maxTime: recursiveTimeStats.max,
      stdDev: recursiveTimeStats.stdDev,
      median: recursiveTimeStats.median,
      p95: recursiveTimeStats.p95,
      p99: recursiveTimeStats.p99,
      avgComparisons: avgRecursiveComparisons,
      worstCaseComparisons: worstCaseRecursive,
      bestCaseComparisons: bestCaseRecursive,
      maxDepth: maxRecursiveDepth,
    },
    theoretical: {
      logN,
      expectedComparisons,
    },
    memoryEstimate: {
      arrayBytes,
      iterativeStackDepth: 1, // O(1) space
      recursiveStackDepth: maxRecursiveDepth, // O(log n) space
    },
  };
}
