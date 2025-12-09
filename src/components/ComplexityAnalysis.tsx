import { motion } from 'framer-motion';
import { BookOpen, Code, Cpu, Database } from 'lucide-react';

export function ComplexityAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Complexity Analysis
      </h3>
      
      <div className="space-y-6">
        {/* Time Complexity */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-bold text-gray-800">Time Complexity</h4>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Both Iterative and Recursive: O(log n)</p>
              <p className="text-gray-700 mb-2">
                Binary search divides the search space in half with each comparison, 
                resulting in logarithmic time complexity.
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs">
                T(n) = T(n/2) + O(1)<br/>
                By Master Theorem: T(n) = O(log n)
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="font-semibold text-green-800">Best Case</p>
                <p className="text-2xl font-bold text-green-600">O(1)</p>
                <p className="text-xs text-gray-600 mt-1">Target is at middle</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="font-semibold text-yellow-800">Average Case</p>
                <p className="text-2xl font-bold text-yellow-600">O(log n)</p>
                <p className="text-xs text-gray-600 mt-1">Typical searches</p>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="font-semibold text-red-800">Worst Case</p>
                <p className="text-2xl font-bold text-red-600">O(log n)</p>
                <p className="text-xs text-gray-600 mt-1">Target at end or not found</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Space Complexity */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-bold text-gray-800">Space Complexity</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Iterative: O(1)</p>
              <p className="text-gray-700 text-sm">
                Uses only a constant amount of extra space for variables (left, right, mid).
                No recursive call stack overhead.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Recursive: O(log n)</p>
              <p className="text-gray-700 text-sm">
                Each recursive call adds a frame to the call stack. 
                Maximum stack depth is proportional to log n.
              </p>
            </div>
          </div>
        </div>
        
        {/* Implementation Differences */}
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-bold text-gray-800">Implementation Comparison</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold">Aspect</th>
                  <th className="p-3 text-left font-semibold text-blue-700">Iterative</th>
                  <th className="p-3 text-left font-semibold text-red-700">Recursive</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-medium">Code Readability</td>
                  <td className="p-3">More verbose, explicit loop control</td>
                  <td className="p-3">Cleaner, more elegant, mathematical</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">Memory Usage</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Constant O(1)</td>
                  <td className="p-3 text-red-600">Stack overhead O(log n)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Performance</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Slightly faster (no call overhead)</td>
                  <td className="p-3 text-red-600">Function call overhead</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">Stack Overflow Risk</td>
                  <td className="p-3 text-green-600 font-semibold">✓ None</td>
                  <td className="p-3 text-red-600">Possible with very large arrays</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Debugging</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Easier to debug</td>
                  <td className="p-3">More complex call stack</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-800 mb-3">🔑 Key Insights</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Both implementations have identical time complexity O(log n) and perform the same number of comparisons.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Iterative is generally preferred in production due to better space complexity and no stack overflow risk.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Recursive version has overhead from function calls, making it slightly slower in practice.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>The performance difference becomes more noticeable with larger datasets and repeated searches.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Modern compilers may optimize tail recursion, but JavaScript engines typically don't.</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
