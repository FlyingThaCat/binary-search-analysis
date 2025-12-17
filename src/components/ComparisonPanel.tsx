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
        <h3 className="text-xl font-bold text-gray-800 mb-4">Perbandingan Performa</h3>
        <p className="text-gray-600">Jalankan pencarian untuk melihat perbandingan...</p>
      </div>
    );
  }
  
  const timeDiff = recursiveResult.executionTime - iterativeResult.executionTime;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">Perbandingan Performa</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Iterative Stats */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-bold text-blue-800 mb-3 text-lg">Iteratif</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Waktu Eksekusi</p>
                <p className="font-bold text-lg">{iterativeResult.executionTime.toFixed(6)} ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Perbandingan</p>
                <p className="font-bold text-lg">{iterativeResult.comparisons}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Langkah</p>
                <p className="font-bold text-lg">{iterativeResult.steps.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recursive Stats */}
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <h4 className="font-bold text-red-800 mb-3 text-lg">Rekursif</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Waktu Eksekusi</p>
                <p className="font-bold text-lg">{recursiveResult.executionTime.toFixed(6)} ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Perbandingan</p>
                <p className="font-bold text-lg">{recursiveResult.comparisons}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Kedalaman Rekursi Maks</p>
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
          Analisis
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Perbedaan Waktu:</span>
            <span className={`font-bold ${Math.abs(timeDiff) < 0.001 ? 'text-gray-600' : timeDiff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {timeDiff > 0 ? 'Iteratif lebih cepat ' : 'Rekursif lebih cepat '}
              {Math.abs(timeDiff).toFixed(6)} ms
              {Math.abs(timeDiff) < 0.001 && ' (Tidak signifikan)'}
            </span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-gray-700">
              <span className="font-semibold">Catatan:</span> Kedua algoritma memiliki jumlah perbandingan yang sama (O(log n)), 
              tetapi implementasi rekursif memiliki overhead dari call stack fungsi.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
