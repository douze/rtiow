export class Canvas {

  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public createSynchronously(fillFunction: (x: number, y: number, width: number, height: number) => Array<number>): void {
    const imageData: ImageData = this.context.createImageData(this.width, this.height);
    const data: Uint8ClampedArray = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % this.width;
      const y = Math.floor((i / 4) / this.width);
      const color = fillFunction(x, y, this.width, this.height);
      color.map((value, index) => data[i + index] = value);
    }
    this.context.putImageData(imageData, 0, 0);
  }

  public reverseYAxis(): void {
    this.context.transform(1, 0, 0, -1, 0, this.height)
    this.context.globalCompositeOperation = 'copy';
    this.context.drawImage(this.context.canvas, 0, 0);
    this.context.globalCompositeOperation = 'source-over';
  }

}