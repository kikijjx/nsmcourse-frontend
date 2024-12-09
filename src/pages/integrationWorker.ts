self.onmessage = function (e) {
    const { funcString, a, b, n } = e.data;
  
    const f = eval(`(${funcString})`);
  
    console.log(`вычисление интеграла на диапазоне [${a}, ${b}]`);
  
    const localResult = trapezoidalRule(f, a, b, n);
    postMessage(localResult);
  };
  
  const trapezoidalRule = (f: (x: number) => number, a: number, b: number, n: number): number => {
    const h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) {
      sum += f(a + i * h);
    }
    return sum * h;
  };
  