import '/src/style.css'
import { Canvas } from '../src/canvas';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';

class Image2 {

  constructor() {
    const aspectRatio = 16.0 / 9.0;

    const domCanvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    this.setupDomCanvasSize(domCanvas, aspectRatio);

    const canvas: Canvas = new Canvas(domCanvas);

    const viewportHeight = 2.0;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1.0;

    const origin = new Vector(0, 0, 0);
    const horizontal = new Vector(viewportWidth, 0, 0);
    const vertical = new Vector(0, viewportHeight, 0);
    const lowerLeftCorner = origin.subtract(horizontal.dividedBy(2)).subtract(vertical.dividedBy(2)).subtract(new Vector(0, 0, focalLength));

    canvas.createSynchronously((x: number, y: number, width: number, height: number) => {
      const u = x  / (width - 1);
      const v = y / (height - 1);

      const ray = new Ray(origin, lowerLeftCorner.add(horizontal.multiplyBy(u)).add(vertical.multiplyBy(v)).subtract(origin));
      
      const unitDirection = ray.direction.unitVector();
      const t = 0.5 * (unitDirection.y + 1.0);
      const colors = new Vector(1.0,1.0,1.0).multiplyBy(1.0-t).add(new Vector(0.5,0.7,1.0).multiplyBy(t));

      return [colors.x*255, colors.y*255, colors.z*255, 255];
    });
    canvas.reverseYAxis();
  }

  setupDomCanvasSize(domCanvas: HTMLCanvasElement, aspectRatio: number): void {
    const width = 400;
    const height = width / aspectRatio;
    domCanvas.width = width;
    domCanvas.height = height;
  }

}

new Image2();

