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
  checkAPIHealth,
} from './services/api';
import type { SearchResult, PerformanceData } from './services/api';

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
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  
  // Check API health on mount
  useEffect(() => {
    checkAPIHealth().then(setApiAvailable);
  }, []);
  
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
  
  const handleSearch = async () => {
    try {
      const [iterative, recursive] = await Promise.all([
        binarySearchIterative(array, target),
        binarySearchRecursive(array, target),
      ]);
      
      setIterativeResult(iterative);
      setRecursiveResult(recursive);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error during search:', error);
    }
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
  
  const runPerformanceAnalysis = async () => {
    setIsLoadingPerformance(true);
    
    try {
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
      
      console.log('Memulai tes performa dengan array besar menggunakan Go API...');
      const data = await runPerformanceTests(sizes, 20, 1000);
      console.log('Tes performa selesai!');
      setPerformanceData(data);
    } catch (error) {
      console.error('Error running performance tests:', error);
      alert('Tidak dapat menjalankan tes performa. Pastikan Go API berjalan di http://localhost:5353');
    } finally {
      setIsLoadingPerformance(false);
    }
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
            Analisis Algoritma Binary Search
          </h1>
          <p className="text-lg text-gray-600">
            Perbandingan Kompleksitas: Iteratif vs Rekursif
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex justify-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              apiAvailable 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiAvailable ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></div>
              {apiAvailable 
                ? '🚀 Go API Aktif' 
                : '⚠️ Go API Tidak Tersedia'}
            </div>
          </div>
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Konfigurasi</h3>
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
                      Ukuran Array: {arraySize}
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
                      Rentang: 10 - 100 elemen
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nilai Target: {target}
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
                      Rentang: 1 - {arraySize}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kecepatan Animasi: {playSpeed}ms
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
                      {playSpeed < 500 ? 'Cepat' : playSpeed < 1000 ? 'Sedang' : playSpeed < 1500 ? 'Lambat' : 'Sangat Lambat'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTarget(Math.floor(Math.random() * arraySize) + 1)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      Target Acak
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
              Mulai Pencarian
            </button>
            
            {iterativeResult && (
              <>
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Jeda' : 'Putar'}
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
                  Ulang
                </button>
              </>
            )}
          </div>
          
          {iterativeResult && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Langkah {currentStep + 1} dari {iterativeResult.steps.length}
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
        
        
        
        {/* Performance Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-lg mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Analisis Performa</h3>
          
          {/* Explanation Box */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <h4 className="font-bold text-gray-800 mb-2">📊 Apa itu "Efisiensi"?</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Efisiensi</strong> mengukur seberapa dekat performa algoritma dengan teoritis optimal O(log n).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
              <div className="bg-green-100 p-2 rounded">
                <strong className="text-green-800">✓ 95-100% (Hijau)</strong>
                <p className="text-gray-700">Sangat baik! Hampir optimal</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <strong className="text-yellow-800">⚠ 85-95% (Kuning)</strong>
                <p className="text-gray-700">Baik, ada sedikit overhead</p>
              </div>
              <div className="bg-red-100 p-2 rounded">
                <strong className="text-red-800">✗ {'<'}85% (Merah)</strong>
                <p className="text-gray-700">Di bawah optimal, perlu investigasi</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Rumus:</strong> Efisiensi = (Perbandingan Teoritis / Perbandingan Aktual) × 100%
              <br/>
              <strong>Catatan:</strong> Iteratif dan rekursif memiliki efisiensi serupa, tapi iteratif biasanya sedikit lebih cepat dalam waktu eksekusi.
            </p>
          </div>
          
          <p className="text-gray-600 mb-4">
            Jalankan tes performa komprehensif dengan <strong>array masif hingga 100 juta elemen</strong> untuk melihat karakteristik performa dunia nyata.
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
                  Menjalankan Tes...
                </>
              ) : (
                <>Jalankan Tes Array Masif</>
              )}
            </button>
          </div>
          
          {performanceData.length > 0 && (
            <>
              <PerformanceChart data={performanceData} />
              
              {/* Detailed Statistics Table */}
              <div className="mt-6 overflow-x-auto">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Statistik Terperinci</h4>
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 border">Ukuran Array</th>
                      <th className="px-4 py-3 border">Memori</th>
                      <th className="px-4 py-3 border">Iteratif Rata-rata</th>
                      <th className="px-4 py-3 border">Rekursif Rata-rata</th>
                      <th className="px-4 py-3 border">StdDev Iter</th>
                      <th className="px-4 py-3 border">StdDev Rek</th>
                      <th className="px-4 py-3 border">Rata-rata Perbandingan</th>
                      <th className="px-4 py-3 border">Teoritis</th>
                      <th className="px-4 py-3 border" title="Seberapa dekat dengan optimal O(log n) - Semakin tinggi semakin baik!">
                        Efisiensi
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
                            {data.iterativeTimeAvg.toFixed(6)} ms
                          </td>
                          <td className="px-4 py-2 border font-mono text-red-600">
                            {data.recursiveTimeAvg.toFixed(6)} ms
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
        
        {/* Complexity Analysis */}
        <div className="mb-6">
          <ComplexityAnalysis />
        </div>
      </div>
    </div>
  );
}

export default App;
