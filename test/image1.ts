import '/src/style.css'
import { Canvas } from '../src/canvas';

class Image1 {

  constructor() {
    const canvas: Canvas = new Canvas(document.querySelector<HTMLCanvasElement>('#renderCanvas')!);
    canvas.createSynchronously((x: number, y: number, width: number, height: number) => {
      const red = x / width * 255;
      const green = y / height * 255;
      const blue = 0.2 * 255;
      const alpha = 124;
      return [red, green, blue, alpha];
    });
    canvas.reverseYAxis();
  }

}

new Image1();