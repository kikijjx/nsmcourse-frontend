import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Функция для решения СЛАУ методом Гаусса
const gaussElimination = (matrix: number[][], b: number[]): number[] => {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ratio = augmented[j][i] / augmented[i][i];
      for (let k = i; k < n + 1; k++) {
        augmented[j][k] -= augmented[i][k] * ratio;
      }
    }
  }

  const solution: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    solution[i] = augmented[i][n] / augmented[i][i];
    for (let j = i - 1; j >= 0; j--) {
      augmented[j][n] -= augmented[j][i] * solution[i];
    }
  }

  return solution;
};

const parallelSLAE = (matrix: number[][], b: number[], threads: number): Promise<number[]> => {
    return new Promise<number[]>((resolve) => {
      const n = matrix.length;
      const workers: Worker[] = [];
      const results: number[] = new Array(n);
      let completedThreads = 0;
  
      for (let i = 0; i < threads; i++) {
        const worker = new Worker(new URL('./slaeWorker.ts', import.meta.url));
        workers.push(worker);
  
        worker.onmessage = (e) => {
          const localSolution = e.data;
          console.log(`Worker ${i} finished with result:`, localSolution);
          results.splice(i * Math.ceil(n / threads), Math.ceil(n / threads), ...localSolution);
          completedThreads++;
  
          if (completedThreads === threads) {
            resolve(results);
          }
        };
  
        worker.postMessage({ matrix, b });
      }
    });
  };
  

const generateRandomMatrix = (n: number): number[][] => {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(Math.random() * 10);
    }
    matrix.push(row);
  }
  return matrix;
};

// Генерация случайного вектора
const generateRandomVector = (n: number): number[] => {
  return Array.from({ length: n }, () => Math.random() * 10);
};

// Компонент для страницы решения СЛАУ
const SLAEExperimentPage: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState<number>(3);
  const [matrixType, setMatrixType] = useState<string>('random');
  const [bType, setBType] = useState<string>('random');
  const [threads, setThreads] = useState<number>(2);
  const [sequentialResult, setSequentialResult] = useState<number[] | null>(null);
  const [parallelResult, setParallelResult] = useState<number[] | null>(null);
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
    // Генерация матрицы и вектора b
    let matrix: number[][] = [];
    let b: number[] = [];

    if (matrixType === 'random') {
      matrix = generateRandomMatrix(matrixSize);
    }

    if (bType === 'random') {
      b = generateRandomVector(matrixSize);
    }

    // Последовательное решение
    const startSeq = performance.now();
    const seqResult = gaussElimination(matrix, b);
    const endSeq = performance.now();
    setSequentialResult(seqResult);
    setSequentialTime(endSeq - startSeq);

    // Параллельное решение
    const startPar = performance.now();
    parallelSLAE(matrix, b, threads).then((parResult) => {
      const endPar = performance.now();
      setParallelResult(parResult);
      setParallelTime(endPar - startPar);

      setChartData((prevData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; tension: number }[] }) => ({
        ...prevData,
        labels: [...prevData.labels, `size=${matrixSize}, threads=${threads}`],
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Решение СЛАУ</h1>

      <div>
        <label>
          Размерность матрицы (n):
          <input type="number" value={matrixSize} onChange={(e) => setMatrixSize(Number(e.target.value))} />
        </label>
      </div>

      <div>
        <label>
          Тип матрицы:
          <select value={matrixType} onChange={(e) => setMatrixType(e.target.value)}>
            <option value="random">Случайная</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Тип вектора b:
          <select value={bType} onChange={(e) => setBType(e.target.value)}>
            <option value="random">Случайный</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Количество потоков:
          <input type="number" value={threads} onChange={(e) => setThreads(Number(e.target.value))} />
        </label>
      </div>

      <button onClick={handleRunExperiment}>Решить СЛАУ</button>

      <div>
        <h2>Результаты</h2>
        <p>Последовательный результат: {sequentialResult ? sequentialResult.join(', ') : 'N/A'}</p>
        <p>Параллельный результат: {parallelResult ? parallelResult.join(', ') : 'N/A'}</p>
        <p>Последовательное время: {sequentialTime} мс</p>
        <p>Параллельное время: {parallelTime} мс</p>
      </div>

      <div>
        <h2>График</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default SLAEExperimentPage;
