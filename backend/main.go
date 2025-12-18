package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// SearchStep represents a single step in the search process
type SearchStep struct {
	Left      int `json:"left"`
	Right     int `json:"right"`
	Mid       int `json:"mid"`
	Comparing int `json:"comparing"`
	Depth     int `json:"depth,omitempty"`
}

// SearchResult represents the result of a binary search
type SearchResult struct {
	Found         bool         `json:"found"`
	Index         int          `json:"index"`
	Comparisons   int          `json:"comparisons"`
	Steps         []SearchStep `json:"steps"`
	ExecutionTime float64      `json:"executionTime"` // in nanoseconds
	MaxDepth      int          `json:"maxDepth,omitempty"`
}

// PerformanceData represents performance metrics for a given array size
type PerformanceData struct {
	Size                   int     `json:"size"`
	IterativeTimeAvg       float64 `json:"iterativeTimeAvg"`
	RecursiveTimeAvg       float64 `json:"recursiveTimeAvg"`
	IterativeComparisons   float64 `json:"iterativeComparisons"`
	RecursiveComparisons   float64 `json:"recursiveComparisons"`
	IterativeTimeStdDev    float64 `json:"iterativeTimeStdDev"`
	RecursiveTimeStdDev    float64 `json:"recursiveTimeStdDev"`
	IterativeMinTime       float64 `json:"iterativeMinTime"`
	IterativeMaxTime       float64 `json:"iterativeMaxTime"`
	RecursiveMinTime       float64 `json:"recursiveMinTime"`
	RecursiveMaxTime       float64 `json:"recursiveMaxTime"`
	TheoreticalComparisons int     `json:"theoreticalComparisons"`
	MemoryEstimate         string  `json:"memoryEstimate"`
}

// SearchRequest represents a search request
type SearchRequest struct {
	Array  []int `json:"array"`
	Target int   `json:"target"`
}

// PerformanceTestRequest represents a performance test request
type PerformanceTestRequest struct {
	Sizes        []int `json:"sizes"`
	Batches      int   `json:"batches"`
	RunsPerBatch int   `json:"runsPerBatch"`
}

// Binary Search - Iterative
func binarySearchIterative(arr []int, target int) SearchResult {
	steps := []SearchStep{}
	comparisons := 0
	left := 0
	right := len(arr) - 1

	start := time.Now()

	for left <= right {
		mid := left + (right-left)/2
		comparisons++

		steps = append(steps, SearchStep{
			Left:      left,
			Right:     right,
			Mid:       mid,
			Comparing: arr[mid],
		})

		if arr[mid] == target {
			execTime := float64(time.Since(start).Nanoseconds())
			return SearchResult{
				Found:         true,
				Index:         mid,
				Comparisons:   comparisons,
				Steps:         steps,
				ExecutionTime: execTime,
			}
		}

		if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}

	execTime := float64(time.Since(start).Nanoseconds())
	return SearchResult{
		Found:         false,
		Index:         -1,
		Comparisons:   comparisons,
		Steps:         steps,
		ExecutionTime: execTime,
	}
}

// Binary Search - Recursive
func binarySearchRecursive(arr []int, target int) SearchResult {
	steps := []SearchStep{}
	comparisons := 0
	maxDepth := 0

	start := time.Now()

	var search func(left, right, depth int) int
	search = func(left, right, depth int) int {
		if depth > maxDepth {
			maxDepth = depth
		}

		if left > right {
			return -1
		}

		mid := left + (right-left)/2
		comparisons++

		steps = append(steps, SearchStep{
			Left:      left,
			Right:     right,
			Mid:       mid,
			Comparing: arr[mid],
			Depth:     depth,
		})

		if arr[mid] == target {
			return mid
		}

		if arr[mid] < target {
			return search(mid+1, right, depth+1)
		}
		return search(left, mid-1, depth+1)
	}

	index := search(0, len(arr)-1, 0)
	execTime := float64(time.Since(start).Nanoseconds())

	return SearchResult{
		Found:         index != -1,
		Index:         index,
		Comparisons:   comparisons,
		Steps:         steps,
		ExecutionTime: execTime,
		MaxDepth:      maxDepth,
	}
}

// Fast versions for performance testing (no step tracking)
func binarySearchIterativeFast(arr []int, target int) int {
	comparisons := 0
	left := 0
	right := len(arr) - 1

	for left <= right {
		mid := left + (right-left)/2
		comparisons++

		if arr[mid] == target {
			return comparisons
		}
		if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return comparisons
}

func binarySearchRecursiveFast(arr []int, target int) int {
	comparisons := 0

	var search func(left, right int) int
	search = func(left, right int) int {
		if left > right {
			return -1
		}

		mid := left + (right-left)/2
		comparisons++

		if arr[mid] == target {
			return mid
		}
		if arr[mid] < target {
			return search(mid+1, right)
		}
		return search(left, mid-1)
	}

	search(0, len(arr)-1)
	return comparisons
}

// Generate sorted array
func generateSortedArray(size int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = i + 1
	}
	return arr
}

// Calculate statistics
func calculateStats(values []float64) (avg, min, max, stdDev float64) {
	if len(values) == 0 {
		return 0, 0, 0, 0
	}

	sum := 0.0
	min = values[0]
	max = values[0]

	for _, v := range values {
		sum += v
		if v < min {
			min = v
		}
		if v > max {
			max = v
		}
	}

	avg = sum / float64(len(values))

	variance := 0.0
	for _, v := range values {
		variance += math.Pow(v-avg, 2)
	}
	variance /= float64(len(values) - 1)
	stdDev = math.Sqrt(variance)

	return
}

// API Handlers

func handleSearchIterative(w http.ResponseWriter, r *http.Request) {
	var req SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := binarySearchIterative(req.Array, req.Target)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleSearchRecursive(w http.ResponseWriter, r *http.Request) {
	var req SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := binarySearchRecursive(req.Array, req.Target)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handlePerformanceTest(w http.ResponseWriter, r *http.Request) {
	var req PerformanceTestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Default values
	if req.Batches == 0 {
		req.Batches = 20
	}
	if req.RunsPerBatch == 0 {
		req.RunsPerBatch = 1000
	}

	results := []PerformanceData{}

	for _, size := range req.Sizes {
		arr := generateSortedArray(size)
		target := arr[size/2]

		iterativeTimes := []float64{}
		recursiveTimes := []float64{}
		iterativeComps := []float64{}
		recursiveComps := []float64{}

		// Warm-up
		for i := 0; i < 1000; i++ {
			binarySearchIterativeFast(arr, target)
			binarySearchRecursiveFast(arr, target)
		}

		// Run batches
		for b := 0; b < req.Batches; b++ {
			// Iterative
			compIter := 0
			start := time.Now()
			for i := 0; i < req.RunsPerBatch; i++ {
				compIter += binarySearchIterativeFast(arr, target)
			}
			iterTime := float64(time.Since(start).Nanoseconds()) / float64(req.RunsPerBatch) / 1000.0 // to microseconds
			iterativeTimes = append(iterativeTimes, iterTime)
			iterativeComps = append(iterativeComps, float64(compIter)/float64(req.RunsPerBatch))

			// Recursive
			compRec := 0
			start = time.Now()
			for i := 0; i < req.RunsPerBatch; i++ {
				compRec += binarySearchRecursiveFast(arr, target)
			}
			recTime := float64(time.Since(start).Nanoseconds()) / float64(req.RunsPerBatch) / 1000.0 // to microseconds
			recursiveTimes = append(recursiveTimes, recTime)
			recursiveComps = append(recursiveComps, float64(compRec)/float64(req.RunsPerBatch))
		}

		iterAvg, iterMin, iterMax, iterStdDev := calculateStats(iterativeTimes)
		recAvg, recMin, recMax, recStdDev := calculateStats(recursiveTimes)

		iterCompAvg := 0.0
		recCompAvg := 0.0
		for i := 0; i < req.Batches; i++ {
			iterCompAvg += iterativeComps[i]
			recCompAvg += recursiveComps[i]
		}
		iterCompAvg /= float64(req.Batches)
		recCompAvg /= float64(req.Batches)

		theoreticalComp := int(math.Ceil(math.Log2(float64(size))))
		memoryMB := float64(size*8) / (1024 * 1024)

		memEstimate := ""
		if memoryMB > 1 {
			memEstimate = fmt.Sprintf("%.2f MB", memoryMB)
		} else {
			memEstimate = fmt.Sprintf("%.2f KB", float64(size*8)/1024)
		}

		results = append(results, PerformanceData{
			Size:                   size,
			IterativeTimeAvg:       iterAvg,
			RecursiveTimeAvg:       recAvg,
			IterativeComparisons:   iterCompAvg,
			RecursiveComparisons:   recCompAvg,
			IterativeTimeStdDev:    iterStdDev,
			RecursiveTimeStdDev:    recStdDev,
			IterativeMinTime:       iterMin,
			IterativeMaxTime:       iterMax,
			RecursiveMinTime:       recMin,
			RecursiveMaxTime:       recMax,
			TheoreticalComparisons: theoreticalComp,
			MemoryEstimate:         memEstimate,
		})

		log.Printf("Completed performance test for size: %d", size)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func handleGenerateArray(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Size int `json:"size"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	arr := generateSortedArray(req.Size)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"array": arr,
		"size":  req.Size,
	})
}

func main() {
	rand.Seed(time.Now().UnixNano())

	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/search/iterative", handleSearchIterative).Methods("POST")
	r.HandleFunc("/api/search/recursive", handleSearchRecursive).Methods("POST")
	r.HandleFunc("/api/performance", handlePerformanceTest).Methods("POST")
	r.HandleFunc("/api/generate-array", handleGenerateArray).Methods("POST")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}).Methods("GET")

	// CORS
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173", "http://localhost:5174"}),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)(r)

	port := ":5353"
	log.Printf("🚀 Server berjalan di http://localhost%s", port)
	log.Fatal(http.ListenAndServe(port, corsHandler))
}
