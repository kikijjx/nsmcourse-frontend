import React, { useEffect, useState } from 'react';
import '../wasm_exec.js';
import '../wasmTypes.d.ts';

function wasmIntegrate(f: string, a: number, b: number, n: number, parallel: boolean) {
  return new Promise<number>((resolve) => {
    const result = window.wasmIntegrate(f, a, b, n, parallel);
    resolve(result);
  });
}

const ExperimentContentPage: React.FC = () => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [functionType, setFunctionType] = useState<string>('sin');
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(Math.PI);
  const [n, setN] = useState<number>(1000000);
  const [threads, setThreads] = useState<number>(1);
  const [wasmResultSeq, setWasmResultSeq] = useState<number | null>(null);
  const [executionTimeSeq, setExecutionTimeSeq] = useState<number | null>(null);
  const [wasmResultPar, setWasmResultPar] = useState<number | null>(null);
  const [executionTimePar, setExecutionTimePar] = useState<number | null>(null);

  useEffect(() => {
    async function loadWasm(): Promise<void> {
      const goWasm = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch('../main.wasm'),
        goWasm.importObject
      );
      goWasm.run(result.instance);
      setIsWasmLoaded(true);
    }

    loadWasm();
  }, []);

  const handleIntegration = async () => {
    console.log('SharedArrayBuffer support:', typeof SharedArrayBuffer !== 'undefined');
    console.log('Atomics support:', typeof Atomics !== 'undefined');
    console.log('Threads:', threads);
  
    // Последовательное интегрирование
    console.log('Starting sequential integration...');
    const startSeq = performance.now();
    const resultSeq = await wasmIntegrate(functionType, a, b, n, false);
    const endSeq = performance.now();
    setWasmResultSeq(resultSeq);
    setExecutionTimeSeq(endSeq - startSeq);
    console.log('Sequential Result:', resultSeq, 'Time:', endSeq - startSeq);
  
    // Параллельное интегрирование
    console.log('Starting parallel integration...');
    const startPar = performance.now();
    const resultPar = await wasmIntegrate(functionType, a, b, n, true);
    const endPar = performance.now();
    setWasmResultPar(resultPar);
    setExecutionTimePar(endPar - startPar);
    console.log('Parallel Result:', resultPar, 'Time:', endPar - startPar);
  };
  

  return (
    <div>
      {isWasmLoaded && <p>Wasm Loaded</p>}
      {!isWasmLoaded && <p>Wasm not Loaded</p>}

      <div>
        <label>
          Function:
          <select value={functionType} onChange={(e) => setFunctionType(e.target.value)}>
            <option value="sin">sin(x)</option>
            <option value="cos">cos(x)</option>
            <option value="exp">exp(x)</option>
            <option value="sqrt_sin">sqrt(|sin(x)|)</option>
            <option value="complex1">exp(-x) * sin(2x) + sqrt(|cos(x)|)</option>
            <option value="complex2">[sin²(x) + cos²(x)] / (1 + x²)</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          a:
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label>
          b:
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
        <label>
          n:
          <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
        <label>
          Threads:
          <input type="number" value={threads} onChange={(e) => setThreads(Number(e.target.value))} />
        </label>
      </div>

      <button onClick={handleIntegration}>Start Integration</button>

      {wasmResultSeq !== null && (
        <div>
          <p><b>Sequential Result:</b> {wasmResultSeq}</p>
          <p><b>Sequential Time:</b> {executionTimeSeq?.toFixed(2)} ms</p>
        </div>
      )}

      {wasmResultPar !== null && (
        <div>
          <p><b>Parallel Result:</b> {wasmResultPar}</p>
          <p><b>Parallel Time:</b> {executionTimePar?.toFixed(2)} ms</p>
        </div>
      )}
    </div>
  );
};

export default ExperimentContentPage;
