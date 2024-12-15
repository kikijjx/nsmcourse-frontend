self.onmessage = function (e) {
    const { matrix, b }: { matrix: number[][]; b: number[] } = e.data;
  
    console.log('Worker received data:', { matrix, b });
  
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [...row, b[i]]);
    console.log('Initial augmented matrix:', augmented);
  
    // Процесс гауссовой элиминации
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const ratio = augmented[j][i] / augmented[i][i];
        for (let k = i; k < n + 1; k++) {
          augmented[j][k] -= augmented[i][k] * ratio;
        }
      }
    }
  
    console.log('Augmented matrix after forward elimination:', augmented);
  
    const localSolution: number[] = new Array(n);
    // Обратный ход
    for (let i = n - 1; i >= 0; i--) {
      localSolution[i] = augmented[i][n] / augmented[i][i];
      for (let j = i - 1; j >= 0; j--) {
        augmented[j][n] -= augmented[j][i] * localSolution[i];
      }
    }
  
    console.log('Local solution computed by worker:', localSolution);
    postMessage(localSolution);
  };
  