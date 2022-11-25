import '/src/style.css'
import { Image } from '../src/image';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';
import { Sphere } from '../src/sphere';
import { HitRecord } from '../src/hittable';
import { HittableList } from '../src/hittable-list';
import { Camera } from '../src/camera';
import { Lambertian } from '../src/lambertian';
import { Metal } from '../src/metal';
import { Dielectric } from '../src/dielectric';
import { random } from './math';

class App {

  constructor() {
    const aspectRatio = 3.0 / 2.0;

    const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    this.setupCanvasSize(canvas, aspectRatio);

    const image: Image = new Image(canvas);

    const world = this.createRandomScene();

    const lookFrom = new Vector(13, 2, 3);
    const lookAt = new Vector(0, 0, 0);
    const upVector = new Vector(0, 1, 0);
    const distanceToFocus = 10.0;
    const aperture = 0.1;
    const camera = new Camera(aspectRatio, 20.0, lookFrom, lookAt, upVector, aperture, distanceToFocus);
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

  private createRandomScene(): HittableList {
    const world: HittableList = new HittableList();

    // Ground
    world.add(new Sphere(new Vector(0, -1000, 0), 1000, new Lambertian(new Vector(0.5, 0.5, 0.5))));

    // Random spheres
    for (let a = -11; a < 11; a++) {
      for (let b = -11; b < 11; b++) {
        const chooseMaterial: number = Math.random();
        const center: Vector = new Vector(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());

        if ((center.subtract(new Vector(4, 0.2, 0))).length() > 0.9) {
          if (chooseMaterial < 0.8) {
            // Diffuse
            const albedo = Vector.random().multiplyBy(Vector.random());
            world.add(new Sphere(center, 0.2, new Lambertian(albedo)));
          } else if (chooseMaterial < 0.95) {
            // Metal
            const albedo = Vector.random(0.5, 1.0);
            const fuzz = random(0, 0.5);
            world.add(new Sphere(center, 0.2, new Metal(albedo, fuzz)));
          } else {
            // Glass
            world.add(new Sphere(center, 0.2, new Dielectric(1.5)));
          }
        }
      }
    }

    // Big three
    world.add(new Sphere(new Vector(0, 1, 0), 1.0, new Dielectric(1.5)));
    world.add(new Sphere(new Vector(-4, 1, 0), 1.0, new Lambertian(new Vector(0.4, 0.2, 0.1))));
    world.add(new Sphere(new Vector(4, 1, 0), 1.0, new Metal(new Vector(0.7, 0.6, 0.5), 0.0)));

    return world;
  }

  private computeRayColor(ray: Ray, world: HittableList, depth: number): Vector {
    if (depth <= 0) {
      return new Vector(0.0, 0.0, 0.0);
    }

    const record: HitRecord = world.hit(ray, 0.001, 1000);
    if (record.hasHit) {
      const scattering = record.material!.scatter(ray, record);
      if (scattering.hasScattered) {
        return this.computeRayColor(scattering.rayScattered!, world, depth - 1).multiplyBy(scattering.attenuation!);
      }
      return new Vector(0.0, 0.0, 0.0);
    }

    const unitDirection = ray.direction.unitVector();
    const t = 0.5 * (unitDirection.y + 1.0);
    return new Vector(1.0, 1.0, 1.0).multiplyBy(1.0 - t).add(new Vector(0.5, 0.7, 1.0).multiplyBy(t));
  }

}
new App();
