interface Window {
    wasmFibonacciSum: (n: number) => number;  // Функция WebAssembly, которая возвращает число
    wasmIntegrate: any;
    Go: any;  // Объект Go, который используется для инициализации и запуска Go WebAssembly
  }