// API Service untuk berkomunikasi dengan Go Backend

const API_BASE_URL = 'http://localhost:5353/api';

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

// Generate sorted array
export function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

// Search using Iterative method via API
export async function binarySearchIterative(
  arr: number[],
  target: number
): Promise<SearchResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/search/iterative`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ array: arr, target }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling iterative search API:', error);
    // Fallback ke client-side jika API gagal
    return binarySearchIterativeLocal(arr, target);
  }
}

// Search using Recursive method via API
export async function binarySearchRecursive(
  arr: number[],
  target: number
): Promise<SearchResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/search/recursive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ array: arr, target }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling recursive search API:', error);
    // Fallback ke client-side jika API gagal
    return binarySearchRecursiveLocal(arr, target);
  }
}

// Run performance tests via API
export async function runPerformanceTests(
  sizes: number[],
  batches: number = 20,
  runsPerBatch: number = 1000
): Promise<PerformanceData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/performance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sizes, batches, runsPerBatch }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling performance test API:', error);
    throw error;
  }
}

// Fallback: Local iterative implementation
function binarySearchIterativeLocal(
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

// Fallback: Local recursive implementation
function binarySearchRecursiveLocal(
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

// Check if API is available
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5353/health', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
