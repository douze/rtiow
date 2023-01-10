import { CameraSettings } from './camera';
import { HittableList } from './hittable-list';
import { clamp } from './math';
import { WorkerQueue } from './worker-queue';

export class Image {

  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public createSynchronously(fillFunction: (x: number, y: number, width: number, height: number) => Array<number>, samplesPerPixel: number = 1, gammaCorrection: boolean = false): void {
    const imageData: ImageData = this.context.createImageData(this.width, this.height);
    const data: Uint8ClampedArray = imageData.data;
    const scale = 1.0 / samplesPerPixel;
    const applyCorrection = (value: number, scale: number) => gammaCorrection ? Math.sqrt(value * scale) : value * scale;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % this.width;
      const y = Math.floor((i / 4) / this.width);
      // Use height-y in order to mimic RTIOW ( (0,0) is bottom left whereas it's top left in HTMLCanvasElement)
      const color = fillFunction(x, this.height - y, this.width, this.height);
      color.map((value, index) => {
        data[i + index] = clamp(applyCorrection(value, scale), 0.0, 1.0) * 255;
        if (index == 3) data[i + index] = 255
      });
    }
    this.context.putImageData(imageData, 0, 0);
  }

  public createAsynchronously(world: HittableList, workerQueue: WorkerQueue, cameraSettings: CameraSettings, renderSettings: RenderSettings): void {
    this.context.clearRect(0, 0, this.width, this.height);
    // Kernel default size
    const kernelDefaultSize = workerQueue.getDefaultWorkerSize();
    // Number of kernels per dimension
    const numberOfKernelOnWidth = Math.round(this.width / kernelDefaultSize);
    const numberOfKernelOnHeight = Math.round(this.height / kernelDefaultSize);

    for (let j = 0; j < numberOfKernelOnHeight; j++) {
      for (let i = 0; i < numberOfKernelOnWidth; i++) {
        const xoffset = i * kernelDefaultSize;
        const yoffset = j * kernelDefaultSize;
        // Kernel size is default size or remaining size for last dimensions
        const kernelSizeWidth = i != numberOfKernelOnWidth - 1 ? kernelDefaultSize : this.width - xoffset;
        const kernelSizeHeight = j != numberOfKernelOnHeight - 1 ? kernelDefaultSize : this.height - yoffset;
        // Custom typed array per worker
        const data = new Uint8ClampedArray(kernelSizeWidth * kernelSizeHeight * 4);
        workerQueue.registerJob(
          // prerender : only executed once
          (worker) => {
            worker.postMessage({ action: 'setup', world, cameraSettings, renderSettings });
          },
          // askrender : executed every time
          (worker) => {
            worker.postMessage({
              action: 'render', data, kernelSizeWidth, kernelSizeHeight, xoffset, yoffset, width: this.width, height: this.height
            }, [data.buffer]);
          },
          // applyrender : executed after receiving worker message
          (event: MessageEvent) => {
            const { data, kernelSizeWidth, kernelSizeHeight, xoffset, yoffset } = event.data;
            const imageData = new ImageData(kernelSizeWidth, kernelSizeHeight);
            imageData.data.set(new Uint8ClampedArray(data));
            this.context.putImageData(imageData!, xoffset, yoffset);
          });
      }
    }
  }

}

export interface RenderSettings {
  samplesPerPixel: number,
  maxDepth: number
}