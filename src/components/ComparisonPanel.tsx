import { motion } from 'framer-motion';
import type { SearchResult } from '../utils/binarySearch';
import { Clock, Hash, Layers, TrendingUp } from 'lucide-react';

interface ComparisonProps {
  iterativeResult: SearchResult | null;
  recursiveResult: SearchResult | null;
}

export function ComparisonPanel({ iterativeResult, recursiveResult }: ComparisonProps) {
  if (!iterativeResult || !recursiveResult) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Comparison</h3>
        <p className="text-gray-600">Run a search to see the comparison...</p>
      </div>
    );
  }
  
  const timeDiff = recursiveResult.executionTime - iterativeResult.executionTime;
  const comparisonDiff = recursiveResult.comparisons - iterativeResult.comparisons;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Iterative Stats */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-bold text-blue-800 mb-3 text-lg">Iterative</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Execution Time</p>
                <p className="font-bold text-lg">{iterativeResult.executionTime.toFixed(6)} ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Comparisons</p>
                <p className="font-bold text-lg">{iterativeResult.comparisons}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Steps</p>
                <p className="font-bold text-lg">{iterativeResult.steps.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recursive Stats */}
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <h4 className="font-bold text-red-800 mb-3 text-lg">Recursive</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Execution Time</p>
                <p className="font-bold text-lg">{recursiveResult.executionTime.toFixed(6)} ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Comparisons</p>
                <p className="font-bold text-lg">{recursiveResult.comparisons}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Max Recursion Depth</p>
                <p className="font-bold text-lg">{recursiveResult.maxDepth}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Difference Analysis */}
      <div className="border-t pt-4">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analysis
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Time Difference:</span>
            <span className={`font-bold ${Math.abs(timeDiff) < 0.001 ? 'text-gray-600' : timeDiff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {timeDiff > 0 ? 'Iterative faster by ' : 'Recursive faster by '}
              {Math.abs(timeDiff).toFixed(6)} ms
              {Math.abs(timeDiff) < 0.001 && ' (Negligible)'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Comparison Difference:</span>
            <span className={`font-bold ${comparisonDiff === 0 ? 'text-gray-600' : 'text-blue-600'}`}>
              {comparisonDiff === 0 ? 'Same' : `Δ ${comparisonDiff}`}
            </span>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-gray-700">
              <span className="font-semibold">Note:</span> Both algorithms have the same number of comparisons (O(log n)), 
              but recursive implementation has overhead from function call stack.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
