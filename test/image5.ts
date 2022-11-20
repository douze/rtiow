import '/src/style.css'
import { Image } from '../src/image';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';
import { Sphere } from '../src/sphere';
import { HitRecord } from '../src/hittable';
import { HittableList } from '../src/hittable-list';

class Image5 {

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

    const world = new HittableList();
    world.add(new Sphere(new Vector(0, 0, -1), 0.5));
    world.add(new Sphere(new Vector(0, -100.5, -1), 100));

    image.createSynchronously((x: number, y: number, width: number, height: number) => {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const ray = new Ray(origin, lowerLeftCorner.add(horizontal.multiplyBy(u)).add(vertical.multiplyBy(v)).subtract(origin));
      const color = this.computeRayColor(ray, world);

      return [...color, 1.0];
    });
  }

  private setupCanvasSize(domCanvas: HTMLCanvasElement, aspectRatio: number): void {
    const width = 400;
    const height = width / aspectRatio;
    domCanvas.width = width;
    domCanvas.height = height;
  }

  private computeRayColor(ray: Ray, world: HittableList): Vector {
    const record: HitRecord = world.hit(ray, 0, 1000);
    if (record.hasHit) {
      return record.normal!.add(new Vector(1, 1, 1)).multiplyBy(0.5);
    }

    const unitDirection = ray.direction.unitVector();
    const t = 0.5 * (unitDirection.y + 1.0);
    return new Vector(1.0, 1.0, 1.0).multiplyBy(1.0 - t).add(new Vector(0.5, 0.7, 1.0).multiplyBy(t));
  }

}

new Image5();