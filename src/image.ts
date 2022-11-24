import { clamp } from "./math";

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
    const applyCorrection = (value: number, scale : number) => gammaCorrection ? Math.sqrt(value * scale) : value * scale;

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

}