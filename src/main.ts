import { CameraSettings } from '../src/camera';
import { HittableList } from '../src/hittable-list';
import { Image, RenderSettings } from '../src/image';
import { Metal } from '../src/metal';
import { Vector } from '../src/vector';
import '/src/style.css';

import { Dielectric } from '../src/dielectric';
import { Lambertian } from '../src/lambertian';
import { Sphere } from '../src/sphere';

import { Gui } from '../src/gui';

import { random } from './math';
import { WorkerQueue, WorkerQueueSettings } from './worker-queue';

class App {

  constructor() {
    const aspectRatio = 3.0 / 2.0;

    const workerQueueSettings: WorkerQueueSettings = {
      queueSize: 4,
      workerSize: 100
    };

    const renderSettings: RenderSettings = {
      samplesPerPixel: 5,
      maxDepth: 3
    }

    const gui = new Gui(workerQueueSettings.queueSize);

    const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    gui.onCanvasSizeChange = (size: number) => this.setupCanvasSize(canvas, size, aspectRatio);
    gui.onSingleWorkerSizeChange = (size: number) => workerQueueSettings.workerSize = size;
    gui.onWorkersNumberChange = (size: number) => workerQueueSettings.queueSize = size;
    gui.onSamplesPerPixelChange = (value: number) => renderSettings.samplesPerPixel = value;
    gui.onMaxDepthChange = (value: number) => renderSettings.maxDepth = value;

    gui.onCanvasSizeChange(300);

    const world = this.createRandomScene();
    
    const cameraSettings: CameraSettings = {
      aspectRatio,
      verticalFieldOfView: 20.0,
      lookFrom: new Vector(13, 2, 3),
      lookAt: new Vector(0, 0, 0),
      upVector: new Vector(0, 1, 0),
      aperture: 0.1,
      focusDistance: 10.0
    };


    gui.onRender = () => {
      const image: Image = new Image(canvas);
      const workerQueue = new WorkerQueue(workerQueueSettings);
      workerQueue.onChange = gui.changed.bind(gui); // bah
      image.createAsynchronously(world, workerQueue, cameraSettings, renderSettings);
    }
  }

  private setupCanvasSize(domCanvas: HTMLCanvasElement, width: number, aspectRatio: number): void {
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

}
new App();
