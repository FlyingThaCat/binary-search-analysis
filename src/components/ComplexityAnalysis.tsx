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
        Analisis Kompleksitas
      </h3>
      
      <div className="space-y-6">
        {/* Time Complexity */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-bold text-gray-800">Kompleksitas Waktu</h4>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Iteratif dan Rekursif: O(log n)</p>
              <p className="text-gray-700 mb-2">
                Binary search membagi ruang pencarian menjadi setengah pada setiap perbandingan, 
                menghasilkan kompleksitas waktu logaritmik.
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs">
                T(n) = T(n/2) + O(1)<br/>
                Dengan Master Theorem: T(n) = O(log n)
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="font-semibold text-green-800">Kasus Terbaik</p>
                <p className="text-2xl font-bold text-green-600">O(1)</p>
                <p className="text-xs text-gray-600 mt-1">Target di tengah</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="font-semibold text-yellow-800">Kasus Rata-rata</p>
                <p className="text-2xl font-bold text-yellow-600">O(log n)</p>
                <p className="text-xs text-gray-600 mt-1">Pencarian biasa</p>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="font-semibold text-red-800">Kasus Terburuk</p>
                <p className="text-2xl font-bold text-red-600">O(log n)</p>
                <p className="text-xs text-gray-600 mt-1">Target di ujung atau tidak ada</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Space Complexity */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-bold text-gray-800">Kompleksitas Ruang</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Iteratif: O(1)</p>
              <p className="text-gray-700 text-sm">
                Hanya menggunakan ruang konstan untuk variabel (left, right, mid).
                Tidak ada overhead call stack rekursif.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Rekursif: O(log n)</p>
              <p className="text-gray-700 text-sm">
                Setiap pemanggilan rekursif menambah frame ke call stack. 
                Kedalaman stack maksimum proporsional dengan log n.
              </p>
            </div>
          </div>
        </div>
        
        {/* Implementation Differences */}
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-bold text-gray-800">Perbandingan Implementasi</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold">Aspek</th>
                  <th className="p-3 text-left font-semibold text-blue-700">Iteratif</th>
                  <th className="p-3 text-left font-semibold text-red-700">Rekursif</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-medium">Keterbacaan Kode</td>
                  <td className="p-3">Lebih verbose, kontrol loop eksplisit</td>
                  <td className="p-3">Lebih bersih, elegan, matematis</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">Penggunaan Memori</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Konstan O(1)</td>
                  <td className="p-3 text-red-600">Overhead stack O(log n)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Performa</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Sedikit lebih cepat (tanpa overhead pemanggilan)</td>
                  <td className="p-3 text-red-600">Ada overhead pemanggilan fungsi</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">Risiko Stack Overflow</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Tidak ada</td>
                  <td className="p-3 text-red-600">Mungkin pada array sangat besar</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Debugging</td>
                  <td className="p-3 text-green-600 font-semibold">✓ Lebih mudah di-debug</td>
                  <td className="p-3">Call stack lebih kompleks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-800 mb-3">🔑 Poin Penting</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Kedua implementasi memiliki kompleksitas waktu identik O(log n) dan melakukan jumlah perbandingan yang sama.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Iteratif umumnya lebih dipilih dalam produksi karena kompleksitas ruang lebih baik dan tidak ada risiko stack overflow.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Versi rekursif memiliki overhead dari pemanggilan fungsi, membuatnya sedikit lebih lambat dalam praktik.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Perbedaan performa menjadi lebih terlihat dengan dataset yang lebih besar dan pencarian berulang.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Compiler modern mungkin mengoptimalkan tail recursion, tetapi JavaScript engine biasanya tidak.</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
