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
