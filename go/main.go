package main

import (
	"math"
	"runtime"
	"sync"
	"syscall/js"
)

func integrate(f func(float64) float64, a float64, b float64, n int, parallel bool) float64 {
	var deltaX = (b - a) / float64(n)
	var sum float64 = 0.0

	if parallel {
		var wg sync.WaitGroup
		numThreads := runtime.NumCPU() // Используем количество доступных процессоров
		results := make([]float64, numThreads)
		threads := numThreads
		chunkSize := n / threads
		for i := 0; i < threads; i++ {
			wg.Add(1)
			go func(i int) {
				defer wg.Done()
				start := a + float64(i)*float64(chunkSize)*deltaX
				localSum := 0.0
				for j := 0; j < chunkSize; j++ {
					x := start + float64(j)*deltaX
					localSum += f(x)
				}
				results[i] = localSum * deltaX
			}(i)
		}

		wg.Wait()
		for _, result := range results {
			sum += result
		}
	} else {
		for i := 0; i < n; i++ {
			x := a + float64(i)*deltaX
			sum += f(x)
		}
		sum *= deltaX
	}

	return sum
}

func calculate(wasmFunc js.Value, f string, a float64, b float64, n int, parallel bool) js.Value {
	var result float64

	switch f {
	case "sin":
		result = integrate(func(x float64) float64 {
			return math.Sin(x)
		}, a, b, n, parallel)
	case "cos":
		result = integrate(func(x float64) float64 {
			return math.Cos(x)
		}, a, b, n, parallel)
	case "exp":
		result = integrate(func(x float64) float64 {
			return math.Exp(x)
		}, a, b, n, parallel)
	case "sqrt_sin":
		result = integrate(func(x float64) float64 {
			return math.Sqrt(math.Abs(math.Sin(x)))
		}, a, b, n, parallel)
	case "complex1":
		result = integrate(func(x float64) float64 {
			return math.Exp(-x) * math.Sin(2*x) + math.Sqrt(math.Abs(math.Cos(x)))
		}, a, b, n, parallel)
	case "complex2":
		result = integrate(func(x float64) float64 {
			return (math.Sin(x)*math.Sin(x) + math.Cos(x)*math.Cos(x)) / (1 + x*x)
		}, a, b, n, parallel)
	default:
		result = 0
	}

	return js.ValueOf(result)
}


func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("wasmIntegrate", js.FuncOf(func(this js.Value, p []js.Value) interface{} {
		f := p[0].String()
		a := p[1].Float()
		b := p[2].Float()
		n := p[3].Int()
		parallel := p[4].Bool()

		result := calculate(this, f, a, b, n, parallel)
		return result
	}))

	<-c
}
