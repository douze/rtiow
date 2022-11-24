import '/src/style.css'
import { Image } from '../src/image';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';
import { Sphere } from '../src/sphere';
import { HitRecord } from '../src/hittable';
import { HittableList } from '../src/hittable-list';
import { Camera } from '../src/camera';

class Image5 {

  constructor() {
    const aspectRatio = 16.0 / 9.0;

    const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    this.setupCanvasSize(canvas, aspectRatio);

    const image: Image = new Image(canvas);

    const world = new HittableList();
    world.add(new Sphere(new Vector(0, 0, -1), 0.5));
    world.add(new Sphere(new Vector(0, -100.5, -1), 100));

    const camera = new Camera(aspectRatio);
    const samplesPerPixel = 10;
    const maxDepth = 10;

    image.createSynchronously((x: number, y: number, width: number, height: number) => {
      let color = new Vector(0.0, 0.0, 0.0);
      for (let s = 0; s < samplesPerPixel; s++) {
        const u = (x + Math.random()) / (width - 1);
        const v = (y + Math.random()) / (height - 1);
        color = color.add(this.computeRayColor(camera.getRay(u, v), world, maxDepth));
      }
      return [...color, 1.0];
    }, samplesPerPixel, true);
  }

  private setupCanvasSize(domCanvas: HTMLCanvasElement, aspectRatio: number): void {
    const width = 400;
    const height = width / aspectRatio;
    domCanvas.width = width;
    domCanvas.height = height;
  }

  private computeRayColor(ray: Ray, world: HittableList, depth: number): Vector {
    if (depth <= 0) {
      return new Vector(0.0, 0.0, 0.0);
    }

    const record: HitRecord = world.hit(ray, 0.001, 1000);
    if (record.hasHit) {
      const target = record.point!.add(record.normal!).add(Vector.randomUnitInUnitSphere());
      return this.computeRayColor(new Ray(record.point!, target.subtract(record.point!)), world, depth - 1).multiplyBy(0.5);
    }

    const unitDirection = ray.direction.unitVector();
    const t = 0.5 * (unitDirection.y + 1.0);
    return new Vector(1.0, 1.0, 1.0).multiplyBy(1.0 - t).add(new Vector(0.5, 0.7, 1.0).multiplyBy(t));
  }

}

new Image5();