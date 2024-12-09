import React, { useState } from 'react';

const bubbleSort = (arr: number[]) => {
  const n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  return arr;
};

const parallelBubbleSort = (arr: number[], threads: number) => {
  return new Promise<number[]>((resolve) => {
    const chunkSize = Math.ceil(arr.length / threads);
    const workers: Worker[] = [];
    const results: number[] = new Array(threads);

    for (let i = 0; i < threads; i++) {
      const worker = new Worker(new URL('./bubbleSortWorker.ts', import.meta.url));
      workers.push(worker);
      worker.onmessage = (e) => {
        results[i] = e.data;
        if (results.every((r) => r !== undefined)) {
          resolve(results.flat());
        }
      };
      worker.postMessage({ chunk: arr.slice(i * chunkSize, (i + 1) * chunkSize), threadIndex: i });
    }
  });
};

const ExperimentContentPage: React.FC = () => {
  const [numElements, setNumElements] = useState<number>(100);
  const [numThreads, setNumThreads] = useState<number>(2);
  const [sequenceResult, setSequenceResult] = useState<number[] | null>(null);
  const [parallelResult, setParallelResult] = useState<number[] | null>(null);
  const [sequenceTime, setSequenceTime] = useState<number | null>(null);
  const [parallelTime, setParallelTime] = useState<number | null>(null);

  const handleRunExperiment = () => {
    const array = Array.from({ length: numElements }, () => Math.floor(Math.random() * 1000));

    const startSeq = performance.now();
    const seqResult = bubbleSort([...array]);
    const endSeq = performance.now();
    setSequenceResult(seqResult);
    setSequenceTime(endSeq - startSeq);

    const startPar = performance.now();
    parallelBubbleSort([...array], numThreads).then((parResult) => {
      const endPar = performance.now();
      setParallelResult(parResult);
      setParallelTime(endPar - startPar);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Пузырьковая сортировка</h1>
      <div>
        <label>
          Количество элементов:
          <input
            type="number"
            value={numElements}
            onChange={(e) => setNumElements(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Количество потоков:
          <input
            type="number"
            value={numThreads}
            onChange={(e) => setNumThreads(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleRunExperiment}>Run Experiment</button>

      <div>
        <h2>Результаты</h2>
        <p>Последовательный способ: {sequenceTime} мс</p>
        <p>Параллельный способ: {parallelTime} мс</p>
        <h3>Отсортированный массив (последовательно):</h3>
        <pre>{JSON.stringify(sequenceResult, null, 2)}</pre>
        <h3>Отсортированный массив (параллельно):</h3>
        <pre>{JSON.stringify(parallelResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ExperimentContentPage;
