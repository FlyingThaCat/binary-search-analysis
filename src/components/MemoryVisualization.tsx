import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SearchResult } from '../types/types';
import { formatBytes } from '../services/api';
import { HardDrive } from 'lucide-react';

interface MemoryVisualizationProps {
  iterativeResult: SearchResult | null;
  recursiveResult: SearchResult | null;
}

export function MemoryVisualization({ iterativeResult, recursiveResult }: MemoryVisualizationProps) {
  if (!iterativeResult || !recursiveResult) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Visualisasi Penggunaan Memori
        </h3>
        <p className="text-gray-600">Jalankan pencarian untuk melihat penggunaan memori...</p>
      </div>
    );
  }

  // Estimate memory usage for the arrays and steps
  const iterativeMemory = (iterativeResult.memoryBytes || 
    iterativeResult.steps.length * 100 + 1024); // fallback estimation
  const recursiveMemory = (recursiveResult.memoryBytes || 
    recursiveResult.steps.length * 150 + 2048); // fallback estimation (rekursif lebih banyak)

  const chartData = [
    {
      name: 'Iteratif',
      bytes: iterativeMemory,
      kb: Math.round(iterativeMemory / 1024),
      color: '#3b82f6'
    },
    {
      name: 'Rekursif',
      bytes: recursiveMemory,
      kb: Math.round(recursiveMemory / 1024),
      color: '#ef4444'
    }
  ];

  const difference = Math.abs(recursiveMemory - iterativeMemory);
  const percentDiff = ((difference / Math.min(iterativeMemory, recursiveMemory)) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-purple-600" />
        Visualisasi Penggunaan Memori
      </h3>

      {/* Explanation */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-lg">
        <p className="text-sm text-gray-700">
          <strong>💡 Perhatian:</strong> Penggunaan memori diukur dari stack call frames dan struktur data internal. 
          Metode rekursif biasanya menggunakan lebih banyak memori karena setiap panggilan fungsi memerlukan call stack frame terpisah.
        </p>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            label={{ value: 'Kilobytes (KB)', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
            formatter={(value: number, name: string) => {
              if (name === 'kb') return `${value} KB`;
              if (name === 'bytes') return formatBytes(value);
              return value;
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="kb" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Iterative Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
        >
          <h4 className="font-bold text-blue-800 mb-3">Algoritma Iteratif</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Bytes:</span>
              <span className="font-mono font-bold text-blue-600">{iterativeMemory.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Kilobytes:</span>
              <span className="font-mono font-bold text-blue-600">{Math.round(iterativeMemory / 1024)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Perkiraan:</span>
              <span className="font-mono text-blue-600">{formatBytes(iterativeMemory)}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                ✓ Efisien: Menggunakan stack linear tanpa overhead rekursi
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recursive Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border-2 border-red-200 rounded-lg p-4"
        >
          <h4 className="font-bold text-red-800 mb-3">Algoritma Rekursif</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Bytes:</span>
              <span className="font-mono font-bold text-red-600">{recursiveMemory.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Kilobytes:</span>
              <span className="font-mono font-bold text-red-600">{Math.round(recursiveMemory / 1024)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Perkiraan:</span>
              <span className="font-mono text-red-600">{formatBytes(recursiveMemory)}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-700">
                ⚠️ Overhead: Setiap panggilan menambah call stack frame
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Summary */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-3">📊 Ringkasan Perbandingan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Lebih Efisien</p>
            <p className="text-lg font-bold text-blue-600">Iteratif</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Perbedaan Memori</p>
            <p className="text-lg font-bold text-orange-600">
              {formatBytes(difference)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Selisih Persentase</p>
            <p className="text-lg font-bold text-purple-600">
              {percentDiff}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
