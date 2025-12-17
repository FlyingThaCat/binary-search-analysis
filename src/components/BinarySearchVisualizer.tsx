import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import type { SearchStep } from '../utils/binarySearch';

interface VisualizerProps {
  array: number[];
  steps: SearchStep[];
  currentStep: number;
  target: number;
  isRecursive?: boolean;
}

export function BinarySearchVisualizer({
  array,
  steps,
  currentStep,
  target,
  isRecursive = false,
}: VisualizerProps) {
  const step = steps[currentStep] || null;
  
  const getCellColor = (index: number) => {
    if (!step) return 'bg-gray-100 border-gray-300';
    
    // Found the target
    if (index === step.mid && array[index] === target) {
      return 'bg-green-500 border-green-600 text-white animate-pulse';
    }
    
    // Currently checking middle
    if (index === step.mid) {
      return 'bg-yellow-400 border-yellow-600 text-gray-900 shadow-lg scale-110';
    }
    
    // Left boundary
    if (index === step.left) {
      return 'bg-blue-500 border-blue-600 text-white font-bold';
    }
    
    // Right boundary
    if (index === step.right) {
      return 'bg-purple-500 border-purple-600 text-white font-bold';
    }
    
    // Active search range
    if (index >= step.left && index <= step.right) {
      return 'bg-blue-100 border-blue-300 text-gray-800';
    }
    
    // Eliminated from search
    return 'bg-gray-200 border-gray-300 text-gray-400 opacity-40';
  };
  
  const getLabel = (index: number) => {
    if (!step) return null;
    
    const labels = [];
    if (index === step.left) labels.push('L');
    if (index === step.mid) labels.push('M');
    if (index === step.right) labels.push('R');
    
    return labels.length > 0 ? labels.join('/') : null;
  };
  
  // Smart display: show only relevant elements for large arrays
  const getDisplayArray = () => {
    if (!step || array.length <= 30) {
      return array.map((val, idx) => ({ value: val, index: idx, isEllipsis: false }));
    }
    
    const { left, right, mid } = step;
    const displayed: Array<{ value: number; index: number; isEllipsis: boolean }> = [];
    
    // Show context around important indices
    const contextSize = 5; // Show 5 elements around each important point
    const importantIndices = new Set<number>();
    
    // Add left boundary context
    for (let i = Math.max(0, left - contextSize); i <= Math.min(array.length - 1, left + contextSize); i++) {
      importantIndices.add(i);
    }
    
    // Add middle context
    for (let i = Math.max(0, mid - contextSize); i <= Math.min(array.length - 1, mid + contextSize); i++) {
      importantIndices.add(i);
    }
    
    // Add right boundary context
    for (let i = Math.max(0, right - contextSize); i <= Math.min(array.length - 1, right + contextSize); i++) {
      importantIndices.add(i);
    }
    
    const sortedIndices = Array.from(importantIndices).sort((a, b) => a - b);
    
    for (let i = 0; i < sortedIndices.length; i++) {
      const idx = sortedIndices[i];
      
      // Add ellipsis if there's a gap
      if (i > 0 && sortedIndices[i - 1] < idx - 1) {
        displayed.push({ value: -1, index: -1, isEllipsis: true });
      }
      
      displayed.push({ value: array[idx], index: idx, isEllipsis: false });
    }
    
    return displayed;
  };
  
  const displayArray = getDisplayArray();
  
  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-lg border-2 border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${
          isRecursive ? 'text-red-700' : 'text-blue-700'
        }`}>
          {isRecursive ? '🔄 Rekursif' : '➡️ Iteratif'} Binary Search
        </h3>
        
        {/* Legend */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
          <p className="font-bold text-gray-800 mb-2 text-sm">📍 Keterangan:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded text-white text-center font-bold text-xs leading-6">L</div>
              <span className="font-semibold">Batas kiri</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-600 rounded text-gray-900 text-center font-bold text-xs leading-6">M</div>
              <span className="font-semibold">Tengah (sedang dicek)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 border-2 border-purple-600 rounded text-white text-center font-bold text-xs leading-6">R</div>
              <span className="font-semibold">Batas kanan</span>
            </div>
          </div>
        </div>
        
        {/* Step Information */}
        {step && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-gray-800">Langkah {currentStep + 1} dari {steps.length}</span>
              {step.depth !== undefined && (
                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold">
                  Kedalaman Rekursi: {step.depth}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Rentang Pencarian</p>
                <p className="font-bold text-blue-700">Indeks {step.left} → {step.right}</p>
                <p className="text-xs text-gray-500">{step.right - step.left + 1} elemen</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <p className="text-xs text-gray-600">Mengecek Tengah</p>
                <p className="font-bold text-yellow-700">Indeks {step.mid} = {step.comparing}</p>
                <p className="text-xs text-gray-500">Target: {target}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg text-sm font-semibold border-2
              ${step.comparing === target ? 'bg-green-50 border-green-300 text-green-700' : 
                step.comparing < target ? 'bg-orange-50 border-orange-300 text-orange-700' : 
                'bg-orange-50 border-orange-300 text-orange-700'}">
              {step.comparing === target ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✓ Ditemukan! {step.comparing} = {target} di indeks {step.mid}</span>
                </>
              ) : step.comparing < target ? (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>{step.comparing} {'<'} {target} → Cari KANAN (buang setengah kiri)</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>{step.comparing} {'>'} {target} → Cari KIRI (buang setengah kanan)</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Array Visualization */}
      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3 text-center">
          VISUALISASI ARRAY {array.length > 30 && `(Hanya menampilkan elemen relevan)`}
        </p>
        <div className="flex flex-wrap justify-center gap-1">
          {displayArray.map((item, idx) => {
            if (item.isEllipsis) {
              return (
                <div key={`ellipsis-${idx}`} className="flex flex-col items-center justify-center px-2">
                  <div className="text-2xl text-gray-400 font-bold">⋯</div>
                  <div className="text-xs text-gray-400">hidden</div>
                </div>
              );
            }
            
            const actualIndex = item.index;
            const value = item.value;
            const label = getLabel(actualIndex);
            const colorClass = getCellColor(actualIndex);
            
            return (
              <motion.div 
                key={actualIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="flex flex-col items-center"
              >
                {/* Label above */}
                <div className="h-5 flex items-center justify-center">
                  {label && (
                    <span className="text-xs font-bold text-gray-700 bg-white px-1 rounded border border-gray-300">
                      {label}
                    </span>
                  )}
                </div>
                
                {/* Cell */}
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center 
                    border-2 rounded-lg transition-all duration-300 ${colorClass}`}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <span className="text-xs sm:text-sm font-bold">{value}</span>
                </motion.div>
                
                {/* Index below */}
                <div className="text-[10px] text-gray-500 mt-1">
                  {actualIndex}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Legend at bottom */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Active Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded"></div>
          <span>Checking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
          <span>Found!</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded opacity-50"></div>
          <span>Eliminated</span>
        </div>
      </div>
    </div>
  );
}
