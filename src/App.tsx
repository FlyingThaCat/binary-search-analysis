import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BinarySearchVisualizer } from './components/BinarySearchVisualizer';
import { ComparisonPanel } from './components/ComparisonPanel';
import { PerformanceChart } from './components/PerformanceChart';
import { ComplexityAnalysis } from './components/ComplexityAnalysis';
import {
  generateSortedArray,
  binarySearchIterative,
  binarySearchRecursive,
  runPerformanceTests,
  runDetailedPerformanceTest,
} from './utils/binarySearch';
import type { SearchResult, PerformanceData, DetailedPerformanceMetrics } from './utils/binarySearch';

function App() {
  const [arraySize, setArraySize] = useState(20);
  const [target, setTarget] = useState(15);
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [iterativeResult, setIterativeResult] = useState<SearchResult | null>(null);
  const [recursiveResult, setRecursiveResult] = useState<SearchResult | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedPerformanceMetrics | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'comparisons'>('time');
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [massiveArraySize, setMassiveArraySize] = useState(10000000); // 10 million
  
  useEffect(() => {
    const newArray = generateSortedArray(arraySize);
    setArray(newArray);
    setTarget(Math.floor(arraySize / 2) + 1);
  }, [arraySize]);
  
  useEffect(() => {
    if (isPlaying && iterativeResult && currentStep < iterativeResult.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, playSpeed);
      return () => clearTimeout(timer);
    } else if (isPlaying && iterativeResult && currentStep >= iterativeResult.steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, iterativeResult, playSpeed]);
  
  const handleSearch = () => {
    const iterative = binarySearchIterative(array, target);
    const recursive = binarySearchRecursive(array, target);
    
    setIterativeResult(iterative);
    setRecursiveResult(recursive);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNextStep = () => {
    if (iterativeResult && currentStep < iterativeResult.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const runPerformanceAnalysis = () => {
    setIsLoadingPerformance(true);
    
    setTimeout(() => {
      // Test with massive arrays: up to 100 million elements
      const sizes = [
        100,
        1000,
        10000,
        100000,
        1000000,      // 1 million
        5000000,      // 5 million
        10000000,     // 10 million
        50000000,     // 50 million
        100000000,    // 100 million
      ];
      console.log('Starting performance tests with massive arrays...');
      const data = runPerformanceTests(sizes, 100);
      console.log('Performance tests completed!');
      setPerformanceData(data);
      setIsLoadingPerformance(false);
    }, 100);
  };
  
  const runDetailedAnalysis = () => {
    setIsLoadingPerformance(true);
    
    setTimeout(() => {
      console.log(`Running detailed analysis for ${massiveArraySize.toLocaleString()} elements...`);
      const metrics = runDetailedPerformanceTest(massiveArraySize, 1000);
      console.log('Detailed analysis completed!', metrics);
      setDetailedMetrics(metrics);
      setIsLoadingPerformance(false);
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Binary Search Algorithm Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Analisa Kompleksitas Algoritma: Iteratif vs Rekursif
          </p>
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Configuration</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Array Size: {arraySize}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={arraySize}
                      onChange={(e) => setArraySize(Number(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Range: 10 - 100 elements
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Value: {target}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max={arraySize}
                      value={target}
                      onChange={(e) => setTarget(Number(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Range: 1 - {arraySize}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Animation Speed: {playSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="100"
                      value={playSpeed}
                      onChange={(e) => setPlaySpeed(Number(e.target.value))}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {playSpeed < 500 ? 'Fast' : playSpeed < 1000 ? 'Medium' : playSpeed < 1500 ? 'Slow' : 'Very Slow'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTarget(Math.floor(Math.random() * arraySize) + 1)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      Random Target
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              <Play className="w-5 h-5" />
              Start Search
            </button>
            
            {iterativeResult && (
              <>
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStep >= iterativeResult.steps.length - 1}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </>
            )}
          </div>
          
          {iterativeResult && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Step {currentStep + 1} of {iterativeResult.steps.length}
            </div>
          )}
        </motion.div>
        
        {/* Visualizers */}
        {iterativeResult && recursiveResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BinarySearchVisualizer
              array={array}
              steps={iterativeResult.steps}
              currentStep={currentStep}
              target={target}
              isRecursive={false}
            />
            <BinarySearchVisualizer
              array={array}
              steps={recursiveResult.steps}
              currentStep={currentStep}
              target={target}
              isRecursive={true}
            />
          </div>
        )}
        
        {/* Comparison Panel */}
        {iterativeResult && recursiveResult && (
          <div className="mb-6">
            <ComparisonPanel
              iterativeResult={iterativeResult}
              recursiveResult={recursiveResult}
            />
          </div>
        )}
        
        {/* Complexity Analysis */}
        <div className="mb-6">
          <ComplexityAnalysis />
        </div>
        
        {/* Performance Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-lg mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Performance Analysis</h3>
          
          {/* Explanation Box */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <h4 className="font-bold text-gray-800 mb-2">📊 What is "Efficiency"?</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Efficiency</strong> measures how close the algorithm performs to the theoretical optimal O(log n).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
              <div className="bg-green-100 p-2 rounded">
                <strong className="text-green-800">✓ 95-100% (Green)</strong>
                <p className="text-gray-700">Excellent! Nearly optimal performance</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <strong className="text-yellow-800">⚠ 85-95% (Yellow)</strong>
                <p className="text-gray-700">Good, slight overhead exists</p>
              </div>
              <div className="bg-red-100 p-2 rounded">
                <strong className="text-red-800">✗ {'<'}85% (Red)</strong>
                <p className="text-gray-700">Below optimal, needs investigation</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Formula:</strong> Efficiency = (Theoretical Comparisons / Actual Comparisons) × 100%
              <br/>
              <strong>Note:</strong> Both iterative and recursive have similar efficiency, but iterative is usually slightly faster in execution time.
            </p>
          </div>
          
          <p className="text-gray-600 mb-4">
            Run comprehensive performance tests with <strong>massive arrays up to 100 million elements</strong> to see real-world performance characteristics.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <button
              onClick={runPerformanceAnalysis}
              disabled={isLoadingPerformance}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {isLoadingPerformance ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  Running Tests...
                </>
              ) : (
                <>Run Massive Array Tests</>
              )}
            </button>
            
            {performanceData.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMetric('time')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMetric === 'time'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Execution Time
                </button>
                <button
                  onClick={() => setSelectedMetric('comparisons')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMetric === 'comparisons'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Comparisons
                </button>
              </div>
            )}
          </div>
          
          {performanceData.length > 0 && (
            <>
              <PerformanceChart data={performanceData} metric={selectedMetric} />
              
              {/* Detailed Statistics Table */}
              <div className="mt-6 overflow-x-auto">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Detailed Statistics</h4>
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 border">Array Size</th>
                      <th className="px-4 py-3 border">Memory</th>
                      <th className="px-4 py-3 border">Iterative Avg</th>
                      <th className="px-4 py-3 border">Recursive Avg</th>
                      <th className="px-4 py-3 border">Iter StdDev</th>
                      <th className="px-4 py-3 border">Rec StdDev</th>
                      <th className="px-4 py-3 border">Avg Comparisons</th>
                      <th className="px-4 py-3 border">Theoretical</th>
                      <th className="px-4 py-3 border" title="How close to optimal O(log n) - Higher is better!">
                        Efficiency
                        <span className="ml-1 text-xs text-gray-500">(ℹ️)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((data, idx) => {
                      const efficiency = ((data.theoreticalComparisons || 0) / data.iterativeComparisons * 100).toFixed(1);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border font-mono">{data.size.toLocaleString()}</td>
                          <td className="px-4 py-2 border text-xs">{data.memoryEstimate}</td>
                          <td className="px-4 py-2 border font-mono text-blue-600">
                            {data.iterativeTime.toFixed(6)} ms
                          </td>
                          <td className="px-4 py-2 border font-mono text-red-600">
                            {data.recursiveTime.toFixed(6)} ms
                          </td>
                          <td className="px-4 py-2 border font-mono text-xs">
                            ±{(data.iterativeTimeStdDev || 0).toFixed(6)}
                          </td>
                          <td className="px-4 py-2 border font-mono text-xs">
                            ±{(data.recursiveTimeStdDev || 0).toFixed(6)}
                          </td>
                          <td className="px-4 py-2 border font-mono">
                            {data.iterativeComparisons.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 border font-mono">
                            {data.theoreticalComparisons}
                          </td>
                          <td className="px-4 py-2 border">
                            <span className={`font-semibold ${
                              parseFloat(efficiency) > 95 ? 'text-green-600' : 
                              parseFloat(efficiency) > 85 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {efficiency}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
        
        {/* Detailed Analytics for Specific Array Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-lg mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Detailed Analytics</h3>
          <p className="text-gray-600 mb-4">
            Run in-depth statistical analysis on a specific array size with 1000 iterations covering best, worst, and average cases.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Array Size: {massiveArraySize.toLocaleString()} elements
              </label>
              <input
                type="range"
                min="100000"
                max="100000000"
                step="100000"
                value={massiveArraySize}
                onChange={(e) => setMassiveArraySize(Number(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Range: 100K - 100M elements
              </p>
            </div>
            
            <button
              onClick={runDetailedAnalysis}
              disabled={isLoadingPerformance}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {isLoadingPerformance ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>Run Detailed Analysis</>
              )}
            </button>
          </div>
          
          {detailedMetrics && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-bold text-gray-700 mb-2">Array Info</h5>
                  <p className="text-sm"><strong>Size:</strong> {detailedMetrics.arraySize.toLocaleString()} elements</p>
                  <p className="text-sm"><strong>Memory:</strong> {(detailedMetrics.memoryEstimate.arrayBytes / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-sm"><strong>Iterations:</strong> {detailedMetrics.iterations}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-bold text-gray-700 mb-2">Theoretical</h5>
                  <p className="text-sm"><strong>log₂(n):</strong> {detailedMetrics.theoretical.logN.toFixed(2)}</p>
                  <p className="text-sm"><strong>Expected Comparisons:</strong> {detailedMetrics.theoretical.expectedComparisons}</p>
                  <p className="text-sm"><strong>Complexity:</strong> O(log n)</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h5 className="font-bold text-gray-700 mb-2">Stack Depth</h5>
                  <p className="text-sm"><strong>Iterative:</strong> {detailedMetrics.memoryEstimate.iterativeStackDepth} (O(1))</p>
                  <p className="text-sm"><strong>Recursive:</strong> {detailedMetrics.memoryEstimate.recursiveStackDepth} (O(log n))</p>
                  <p className="text-sm"><strong>Max Depth:</strong> {detailedMetrics.recursive.maxDepth}</p>
                </div>
              </div>
              
              {/* Detailed Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Iterative Stats */}
                <div className="border border-blue-200 rounded-lg p-4">
                  <h5 className="text-lg font-bold text-blue-700 mb-3">Iterative Implementation</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Average Time:</span>
                      <span className="font-mono text-blue-600">{detailedMetrics.iterative.avgTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Median Time:</span>
                      <span className="font-mono">{detailedMetrics.iterative.median.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Min Time:</span>
                      <span className="font-mono text-green-600">{detailedMetrics.iterative.minTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Max Time:</span>
                      <span className="font-mono text-red-600">{detailedMetrics.iterative.maxTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Std Deviation:</span>
                      <span className="font-mono">±{detailedMetrics.iterative.stdDev.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">95th Percentile:</span>
                      <span className="font-mono">{detailedMetrics.iterative.p95.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">99th Percentile:</span>
                      <span className="font-mono">{detailedMetrics.iterative.p99.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 mt-3">
                      <span className="font-semibold">Avg Comparisons:</span>
                      <span className="font-mono">{detailedMetrics.iterative.avgComparisons.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Best Case:</span>
                      <span className="font-mono text-green-600">{detailedMetrics.iterative.bestCaseComparisons}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Worst Case:</span>
                      <span className="font-mono text-red-600">{detailedMetrics.iterative.worstCaseComparisons}</span>
                    </div>
                  </div>
                </div>
                
                {/* Recursive Stats */}
                <div className="border border-red-200 rounded-lg p-4">
                  <h5 className="text-lg font-bold text-red-700 mb-3">Recursive Implementation</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Average Time:</span>
                      <span className="font-mono text-red-600">{detailedMetrics.recursive.avgTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Median Time:</span>
                      <span className="font-mono">{detailedMetrics.recursive.median.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Min Time:</span>
                      <span className="font-mono text-green-600">{detailedMetrics.recursive.minTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Max Time:</span>
                      <span className="font-mono text-red-600">{detailedMetrics.recursive.maxTime.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Std Deviation:</span>
                      <span className="font-mono">±{detailedMetrics.recursive.stdDev.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">95th Percentile:</span>
                      <span className="font-mono">{detailedMetrics.recursive.p95.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">99th Percentile:</span>
                      <span className="font-mono">{detailedMetrics.recursive.p99.toFixed(6)} ms</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 mt-3">
                      <span className="font-semibold">Avg Comparisons:</span>
                      <span className="font-mono">{detailedMetrics.recursive.avgComparisons.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Best Case:</span>
                      <span className="font-mono text-green-600">{detailedMetrics.recursive.bestCaseComparisons}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-semibold">Worst Case:</span>
                      <span className="font-mono text-red-600">{detailedMetrics.recursive.worstCaseComparisons}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Comparison */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h5 className="text-lg font-bold text-gray-800 mb-4">Performance Insights</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-2">
                      <strong>Speed Comparison:</strong> {
                        detailedMetrics.iterative.avgTime < detailedMetrics.recursive.avgTime
                          ? `Iterative is ${((detailedMetrics.recursive.avgTime / detailedMetrics.iterative.avgTime - 1) * 100).toFixed(1)}% faster`
                          : `Recursive is ${((detailedMetrics.iterative.avgTime / detailedMetrics.recursive.avgTime - 1) * 100).toFixed(1)}% faster`
                      }
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Consistency:</strong> {
                        detailedMetrics.iterative.stdDev < detailedMetrics.recursive.stdDev
                          ? 'Iterative is more consistent'
                          : 'Recursive is more consistent'
                      } (lower std dev)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-2">
                      <strong>Theoretical Efficiency:</strong> {
                        ((detailedMetrics.theoretical.expectedComparisons / detailedMetrics.iterative.avgComparisons) * 100).toFixed(1)
                      }% (iterative)
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Memory Usage:</strong> Iterative uses O(1) space, Recursive uses O(log n) ≈ {detailedMetrics.recursive.maxDepth} stack frames
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-sm"
        >
          <p>Binary Search Algorithm Complexity Analysis</p>
          <p className="mt-1">Iterative vs Recursive Implementation Comparison</p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
