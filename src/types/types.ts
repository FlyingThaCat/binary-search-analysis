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
