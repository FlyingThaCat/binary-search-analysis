Write-Host " Memulai Binary Search Analysis..."
Write-Host ""
 
# Check Go
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
    Write-Host " Go tidak terinstall. Install dulu:"
    Write-Host "   https://golang.org/doc/install"
    exit 1
}
 
# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host " Node.js tidak terinstall. Install dulu:"
    Write-Host "   https://nodejs.org/"
    exit 1
}
 
Write-Host " Go dan Node.js terdeteksi"
Write-Host ""
 
# Start Backend
Write-Host " Memulai Go Backend API..."
Push-Location backend
go mod download 2>$null
Start-Process powershell -ArgumentList "go run main.go" -WindowStyle Normal
Pop-Location
 
Write-Host " Menunggu backend siap..."
Start-Sleep -Seconds 3
 
if (-not (Test-Path node_modules)) {
    Write-Host "Menginstall dependency frontend..."
    npm install
}

# Start Frontend
Write-Host " Memulai Frontend..."
Start-Process powershell -ArgumentList "npm run dev" -WindowStyle Normal
 
Write-Host ""
Write-Host " Aplikasi berjalan!"
Write-Host ""
Write-Host " Backend API: http://localhost:5353"
Write-Host " Frontend:    http://localhost:5173"
Write-Host ""
Write-Host "Tutup window untuk menghentikan services"

Read-Host