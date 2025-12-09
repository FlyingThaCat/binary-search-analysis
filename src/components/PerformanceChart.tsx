import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PerformanceData } from '../utils/binarySearch';
import { motion } from 'framer-motion';

interface PerformanceChartProps {
  data: PerformanceData[];
  metric: 'time' | 'comparisons';
}

export function PerformanceChart({ data, metric }: PerformanceChartProps) {
  const chartData = data.map((item) => ({
    size: item.size,
    Iterative: metric === 'time' ? item.iterativeTime : item.iterativeComparisons,
    Recursive: metric === 'time' ? item.recursiveTime : item.recursiveComparisons,
  }));
  
  const yAxisLabel = metric === 'time' ? 'Time (ms)' : 'Comparisons';
  const title = metric === 'time' ? 'Execution Time Comparison' : 'Number of Comparisons';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="size" 
            label={{ value: 'Array Size', position: 'insideBottom', offset: -5 }}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
            formatter={(value: number) => metric === 'time' ? `${value.toFixed(6)} ms` : `${value.toFixed(2)}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Iterative" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Recursive" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
