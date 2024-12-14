self.onmessage = function (e) {
    const { chunk } = e.data;
    const sortedChunk = bubbleSort(chunk);
    postMessage(sortedChunk);
  };
  
  function bubbleSort(arr: number[]): number[] {
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
  }
  