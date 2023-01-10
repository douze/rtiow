const red = [255, 0, 0, 255];
const green = [0, 255, 0, 255];
const blue = [0, 0, 255, 255];
const black = [0, 0, 0, 255];

function setup(canvasId) {
  const canvas = document.querySelector<HTMLCanvasElement>('#' + canvasId)!;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const width = canvas.width = 800;
  const height = canvas.height = 400;
  const positions = Array.from(Array(width * height).keys());
  ctx?.clearRect(0, 0, width, height);

  return { ctx, width, height, positions };
}

function bindButton(canvasId, functionToBind) {
  document.querySelector('#' + canvasId + 'Button')!.addEventListener('click', (e: Event) => functionToBind(canvasId));
}

// 1 : single array

let canvasId = 'renderCanvas1';
bindButton(canvasId, start1);

function start1(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);
  const id = ctx?.getImageData(0, 0, width, height);
  const in_array = new Uint8ClampedArray(width * height * 4);

  const worker = new Worker(new URL('./image-split-worker.ts', import.meta.url));

  const t0 = performance.now();
  worker.postMessage({ type: 'single-array', color: random_color(), width, height, data: in_array });
  worker.addEventListener('message', (event) => {
    const { type, out_array } = event.data;
    if (type == 'end') {
      let t1 = performance.now();
      document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      id?.data.set(out_array);
      ctx!.putImageData(id!, 0, 0);
    }
  });
}

// 2 : two arrays

canvasId = 'renderCanvas2';
bindButton(canvasId, start2);

function start2(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);
  const id = ctx?.getImageData(0, 0, width, height);

  const worker1 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  const worker2 = new Worker(new URL('./image-split-worker.ts', import.meta.url));

  const half_height = height / 2;
  const in_array_1 = new Uint8ClampedArray(width * half_height * 4);
  const in_array_2 = new Uint8ClampedArray(width * half_height * 4);

  const t0 = performance.now();
  let finished = 0;
  worker1.postMessage({ type: 'two-arrays', color: random_color(), width, height: half_height, data: in_array_1 });
  worker1.addEventListener('message', (event) => {
    const { type, out_array } = event.data;
    if (type == 'end') {
      finished++;
      const imdt = new ImageData(width, height / 2);
      imdt.data.set(out_array);
      ctx!.putImageData(imdt!, 0, 0);
      if (finished == 2) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
  worker2.postMessage({ type: 'two-arrays', color: random_color(), width, height: half_height, data: in_array_2 });
  worker2.addEventListener('message', (event) => {
    const { type, out_array } = event.data;
    if (type == 'end') {
      finished++;
      const imdt = new ImageData(width, height / 2);
      imdt.data.set(out_array);
      ctx!.putImageData(imdt!, 0, half_height);
      if (finished == 2) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
}

// 3 : variable arrays

canvasId = 'renderCanvas3';
bindButton(canvasId, start3);

function start3(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);
  const id = ctx?.getImageData(0, 0, width, height);

  const size = 4;
  const t0 = performance.now();
  let finished = 0;

  for (let i = 0; i < size; i++) {
    const workerHeight = height / size;

    const worker = new Worker(new URL('./image-split-worker.ts', import.meta.url));
    const in_array = new Uint8ClampedArray(width * workerHeight * 4);

    worker.postMessage({ type: 'var-arrays', color: random_color(), width, height: workerHeight, data: in_array });
    worker.addEventListener('message', (event) => {
      const { type, out_array } = event.data;
      if (type == 'end') {
        finished++;
        const imdt = new ImageData(width, workerHeight);
        imdt.data.set(out_array);
        ctx!.putImageData(imdt!, 0, i * workerHeight);
        if (finished == size) {
          let t1 = performance.now();
          document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
        }
      }
    });
  }
}

// 4 : update all pixels - split canvas in 2
// create ImageData in ww, no transferrable

canvasId = 'renderCanvas4';
// bindButton(canvasId, start4);

function start4(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);

  const id = ctx?.getImageData(0, 0, width, height);
  let data = new Uint8ClampedArray(width * height * 4);
  data.set(id!.data);

  const t0 = performance.now();
  let finished = 0;
  const worker1 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker1.postMessage({ type: 'all-split-2', color: red, width, height: height / 2, positions });
  worker1.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, 0, 0);
    } else if (type == 'end') {
      finished++;
      if (finished == 2) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
  const worker2 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker2.postMessage({ type: 'all-split-2', color: green, width, height: height / 2, positions });
  worker2.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, 0, height / 2);
    } else if (type == 'end') {
      finished++;
      if (finished == 2) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
}

// 5 : update all pixels - split canvas in 4
// create ImageData in ww, no transferrable

canvasId = 'renderCanvas5';
bindButton(canvasId, start5);

function start5(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);

  const id = ctx?.getImageData(0, 0, width, height);
  let data = new Uint8ClampedArray(width * height * 4);
  data.set(id!.data);

  const t0 = performance.now();
  let finished = 0;
  const worker1 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker1.postMessage({ type: 'all-split-4', color: red, width: width / 2, height: height / 2, positions });
  worker1.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, 0, 0);
    } else if (type == 'end') {
      finished++;
      if (finished == 4) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
  const worker2 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker2.postMessage({ type: 'all-split-4', color: green, width: width / 2, height: height / 2, positions });
  worker2.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, width / 2, 0);
    } else if (type == 'end') {
      finished++;
      if (finished == 4) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
  const worker3 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker3.postMessage({ type: 'all-split-4', color: blue, width: width / 2, height: height / 2, positions });
  worker3.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, 0, height / 2);
    } else if (type == 'end') {
      finished++;
      if (finished == 4) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
  const worker4 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
  worker4.postMessage({ type: 'all-split-4', color: black, width: width / 2, height: height / 2, positions });
  worker4.addEventListener('message', (event) => {
    const { type, output } = event.data;
    if (type == 'compute') {
      ctx!.putImageData(output, width / 2, height / 2);
    } else if (type == 'end') {
      finished++;
      if (finished == 4) {
        let t1 = performance.now();
        document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
      }
    }
  });
}

// 6 : update all pixels - split canvas in variable size
// create ImageData in ww, no transferrable

canvasId = 'renderCanvas6';
bindButton(canvasId, start6);

function random_int(max) { return Math.floor(Math.random() * max); }
function random_color() { return [random_int(255), random_int(255), random_int(255), 255] };

function start6(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);

  const id = ctx?.getImageData(0, 0, width, height);
  let data = new Uint8ClampedArray(width * height * 4);
  data.set(id!.data);

  const t0 = performance.now();
  let finished = 0;
  const split = 2 * 2;
  for (let i = 0; i < split; i++) {
    for (let j = 0; j < split; j++) {
      const worker1 = new Worker(new URL('./image-split-worker.ts', import.meta.url));
      worker1.postMessage({ type: 'all-split-var', color: random_color(), width: width / split, height: height / split, positions });
      worker1.addEventListener('message', (event) => {
        const { type, output } = event.data;
        if (type == 'compute') {
          ctx!.putImageData(output, j * width / split, i * height / split);
        } else if (type == 'end') {
          finished++;
          if (finished == split) {
            let t1 = performance.now();
            document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
          }
        }
      });
    }
  }
}


// 7 : update all pixels - split canvas in variable size
// transferrable

canvasId = 'renderCanvas7';
bindButton(canvasId, start7);


function start7(canvasId) {
  const { ctx, width, height, positions } = setup(canvasId);

  const id = ctx?.getImageData(0, 0, width, height);
  // let data = new Uint8ClampedArray(width * height * 4);
  // data.set(id!.data);

  const datas: Array<Array<number>> = [];

  const t0 = performance.now();
  let finished = 0;
  const split = 2;
  for (let i = 0; i < split; i++) {
    for (let j = 0; j < split; j++) {
      const worker_width = width / split;
      const worker_height = height / split;
      // console.log(worker_width, worker_height);

      const arr = new Uint8ClampedArray(worker_width * worker_height * 4);

      const worker = new Worker(new URL('./image-split-worker.ts', import.meta.url));
      worker.postMessage({
        type: 'all-split-var-buffer', color: random_color(), width: worker_width, height: worker_height, positions, data: arr,
        x: j * worker_width, y: i * worker_height
      }, [arr.buffer]);
      // console.log(j * worker_width, i * worker_height);
      worker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        if (type == 'compute') {
          // id?.data.set(data);
          // console.log(data[0], data[data.length - 1]);
          // ctx!.putImageData(output, j * width / split, i * height / split);
          datas[i * split + j] = data;
        } else if (type == 'end') {
          finished++;
          if (finished == split * split) {
            let t1 = performance.now();
            document.querySelector('#' + canvasId + 'Result')!.innerHTML = ((t1 - t0) / 1000).toString();
            const flat_datas = Uint8ClampedArray.from(datas.reduce((a, b) => [...a, ...b], []));
            console.log(flat_datas);
            id?.data.set(flat_datas);
            ctx!.putImageData(id!, 0, 0);
          }
        }
      });
    }
  }
}



