import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const functions = {
  x2: (x: number) => x * x,
  sin: (x: number) => Math.sin(x),
  cos: (x: number) => Math.cos(x),
};

const trapezoidalRule = (f: (x: number) => number, a: number, b: number, n: number): number => {
  const h = (b - a) / n;
  let sum = 0.5 * (f(a) + f(b));
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  return sum * h;
};

const parallelIntegration = (funcString: string, a: number, b: number, n: number, threads: number) => {
  return new Promise<number>((resolve) => {
    threads = Math.min(threads, n);

    const chunkSize = Math.ceil(n / threads);
    const workers: Worker[] = [];
    const results: number[] = new Array(threads);

    let completedThreads = 0;

    for (let i = 0; i < threads; i++) {
      const worker = new Worker(new URL('./integrationWorker.ts', import.meta.url));
      workers.push(worker);
      worker.onmessage = (e) => {
        results[i] = e.data;
        console.log(`поток ${i} | результат: ${e.data}`);

        completedThreads++;

        if (completedThreads === threads) {
          const totalResult = results.reduce((acc, res) => acc + res, 0);
          console.log('финальный результат:', totalResult);
          resolve(totalResult);
        }
      };

      const start = a + i * (b - a) / threads;
      const end = a + (i + 1) * (b - a) / threads;
      console.log(`поток ${i}: a = ${start}, b = ${end}`);

      worker.postMessage({ funcString, a: start, b: end, n: chunkSize });
    }
  });
};

const IntegrationExperimentPage: React.FC = () => {
  const [selectedFunction, setSelectedFunction] = useState<keyof typeof functions>('x2');
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(1);
  const [n, setN] = useState<number>(1000);
  const [numThreads, setNumThreads] = useState<number>(2);
  const [sequentialResult, setSequentialResult] = useState<number | null>(null);
  const [parallelResult, setParallelResult] = useState<number | null>(null);
  const [sequentialTime, setSequentialTime] = useState<number | null>(null);
  const [parallelTime, setParallelTime] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Последовательное время',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
      {
        label: 'Параллельное время',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  });

  const handleRunExperiment = () => {
    const funcString = functions[selectedFunction].toString();

    const func = functions[selectedFunction];

    const startSeq = performance.now();
    const seqResult = trapezoidalRule(func, a, b, n);
    const endSeq = performance.now();
    setSequentialResult(seqResult);
    setSequentialTime(endSeq - startSeq);

    const startPar = performance.now();
    parallelIntegration(funcString, a, b, n, numThreads).then((parResult) => {
      const endPar = performance.now();
      setParallelResult(parResult);
      setParallelTime(endPar - startPar);

      setChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, `n=${n}, threads=${numThreads}`],
        datasets: prevData.datasets.map((dataset, index) => ({
          ...dataset,
          data: [
            ...dataset.data,
            index === 0 ? endSeq - startSeq : endPar - startPar,
          ],
        })),
      }));
    });
  };

  const handleClearChart = () => {
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Последовательное время',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
        {
          label: 'Параллельное время',
          data: [],
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1,
        },
      ],
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Интегрирование</h1>

      <div>
        <label>
          Функция:
          <select value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value as keyof typeof functions)}>
            <option value="x2">f(x) = x^2</option>
            <option value="sin">f(x) = sin(x)</option>
            <option value="cos">f(x) = cos(x)</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Нижняя граница (a):
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
      </div>

      <div>
        <label>
          Верхняя граница (b):
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>

      <div>
        <label>
          Количество разбиений (n):
          <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
      </div>

      <div>
        <label>
          Количество потоков:
          <input type="number" value={numThreads} onChange={(e) => setNumThreads(Number(e.target.value))} />
        </label>
      </div>

      <button onClick={handleRunExperiment}>Интегрировать</button>
      <button onClick={handleClearChart}>Очистить график</button>

      <div>
        <h2>Результаты</h2>
        <p>Последовательный способ: {sequentialTime} мс</p>
        <p>Параллельный способ: {parallelTime} мс</p>
        <p>Последовательный результат: {sequentialResult}</p>
        <p>Параллельный результат: {parallelResult}</p>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <h2>График времени выполнения</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default IntegrationExperimentPage;
