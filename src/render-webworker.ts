import { Camera, CameraSettings } from '../src/camera';
import { HitRecord } from '../src/hittable';
import { HittableList, HittableListSettings } from '../src/hittable-list';
import { RenderSettings } from '../src/image';
import { Ray } from '../src/ray';
import { Vector } from '../src/vector';
import { clamp } from './math';

const setupSettings = { world: {}, camera: {}, render: {} };

onmessage = (event) => {
  const { action } = event.data;
  switch (action) {
    case 'setup':
      setupSettings.world = event.data.world;
      setupSettings.camera = event.data.cameraSettings;
      setupSettings.render = event.data.renderSettings;
      break;
    case 'render':
      render(event);
      break;
  }
};
const render = (event: MessageEvent): void => {
  const { data, kernelSizeWidth, kernelSizeHeight, xoffset, yoffset, width, height } = event.data;

  const camera = Camera.from(setupSettings.camera as CameraSettings);
  const world = HittableList.from(setupSettings.world as HittableListSettings);
  const renderSettings = setupSettings.render as RenderSettings;

  const scale = 1.0 / renderSettings.samplesPerPixel;
  const applyCorrection = (value: number, scale: number) => Math.sqrt(value * scale);

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % kernelSizeWidth;
    const y = Math.floor((i / 4) / kernelSizeWidth);// / size;

    let color = new Vector(0.0, 0.0, 0.0);
    for (let s = 0; s < renderSettings.samplesPerPixel; s++) {
      const u = (x + Math.random() + xoffset) / (width - 1);
      const v = (height - (y + Math.random() + yoffset)) / (height - 1);
      color = color.add(computeRayColor(camera.getRay(u, v), world, renderSettings.maxDepth));
    }

    data[i] = clamp(applyCorrection(color.x, scale), 0.0, 1.0) * 255;
    data[i + 1] = clamp(applyCorrection(color.y, scale), 0.0, 1.0) * 255;
    data[i + 2] = clamp(applyCorrection(color.z, scale), 0.0, 1.0) * 255;
    data[i + 3] = 255;
  }

  self.postMessage({ data, kernelSizeWidth, kernelSizeHeight, xoffset, yoffset });
};


const computeRayColor = (ray: Ray, world: HittableList, depth: number): Vector => {
  if (depth <= 0) {
    return new Vector(0.0, 0.0, 0.0);
  }

  const record: HitRecord = world.hit(ray, 0.001, 1000);
  if (record.hasHit) {
    const scattering = record.material!.scatter(ray, record);
    if (scattering.hasScattered) {
      return computeRayColor(scattering.rayScattered!, world, depth - 1).multiplyBy(scattering.attenuation!);
    }
    return new Vector(0.0, 0.0, 0.0);
  }

  const unitDirection = ray.direction.unitVector();
  const t = 0.5 * (unitDirection.y + 1.0);
  return new Vector(1.0, 1.0, 1.0).multiplyBy(1.0 - t).add(new Vector(0.5, 0.7, 1.0).multiplyBy(t));
};