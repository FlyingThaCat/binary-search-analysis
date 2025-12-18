#!/bin/bash

# Script untuk menjalankan backend dan frontend secara bersamaan

echo "🚀 Memulai Binary Search Analysis..."
echo ""

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go tidak terinstall. Silakan install Go terlebih dahulu:"
    echo "   https://golang.org/doc/install"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall. Silakan install Node.js terlebih dahulu:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✓ Go dan Node.js terdeteksi"
echo ""

# Start Backend (Go)
echo "🔧 Memulai Go Backend API..."
cd backend
go mod download 2>/dev/null || echo "Dependencies sudah terinstall"

# Run Go server in background
go run main.go &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Menunggu backend siap..."
sleep 3

# Start Frontend (Vite)
echo "🎨 Memulai Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Aplikasi berjalan!"
echo ""
echo "📡 Backend API: http://localhost:5353"
echo "🌐 Frontend:    http://localhost:5173"
echo ""
echo "Tekan Ctrl+C untuk menghentikan semua services"
echo ""

# Trap Ctrl+C and cleanup
trap "echo ''; echo '🛑 Menghentikan aplikasi...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for processes
wait
