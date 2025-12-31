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
  memoryBytes?: number;
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
  iterativeMemoryBytes?: number;
  recursiveMemoryBytes?: number;
}

// Generate sorted array
export function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

// Measure memory usage - throws if not available
export function measureMemory(): number {
  if (typeof performance === 'undefined' || !performance.memory) {
    throw new Error('Pengukuran memori tidak didukung di browser ini');
  }
  return performance.memory.usedJSHeapSize;
}

// Format bytes to readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
    throw error;
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
    throw error;
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
