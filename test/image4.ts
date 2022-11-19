import '/src/style.css'
import { Image } from '../src/image';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';

class Image4 {

  constructor() {
    const aspectRatio = 16.0 / 9.0;

    const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    this.setupCanvasSize(canvas, aspectRatio);

    const image: Image = new Image(canvas);

    const viewportHeight = 2.0;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1.0;

    const origin = new Vector(0, 0, 0);
    const horizontal = new Vector(viewportWidth, 0, 0);
    const vertical = new Vector(0, viewportHeight, 0);
    const lowerLeftCorner = origin.subtract(horizontal.dividedBy(2)).subtract(vertical.dividedBy(2)).subtract(new Vector(0, 0, focalLength));

    image.createSynchronously((x: number, y: number, width: number, height: number) => {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const ray = new Ray(origin, lowerLeftCorner.add(horizontal.multiplyBy(u)).add(vertical.multiplyBy(v)).subtract(origin));
      const color = this.computeRayColor(ray);

      return [...color, 1.0];
    });
  }

  private setupCanvasSize(domCanvas: HTMLCanvasElement, aspectRatio: number): void {
    const width = 400;
    const height = width / aspectRatio;
    domCanvas.width = width;
    domCanvas.height = height;
  }

  private isSphereHit(center: Vector, radius: number, ray: Ray): number {
    const oc = ray.origin.subtract(center);
    const a = Vector.dot(ray.direction, ray.direction);
    const b = 2.0 * Vector.dot(oc, ray.direction);
    const c = Vector.dot(oc, oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return -1.0;
    } else {
      return (-b - Math.sqrt(discriminant)) / (2.0 * a);
    }
  }

  private computeRayColor(ray: Ray): Vector {
    const center = new Vector(0, 0, -1);
    let t = this.isSphereHit(center, 0.5, ray);
    if (t > 0.0) {
      const normal = ray.at(t).subtract(center).unitVector();
      return new Vector(normal.x + 1, normal.y + 1, normal.z + 1).multiplyBy(0.5);
    }
    const unitDirection = ray.direction.unitVector();
    t = 0.5 * (unitDirection.y + 1.0);
    return new Vector(1.0, 1.0, 1.0).multiplyBy(1.0 - t).add(new Vector(0.5, 0.7, 1.0).multiplyBy(t));
  }

}

new Image4();