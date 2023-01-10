import { Dielectric, DielectricSettings } from './dielectric';
import { Hittable, HittableSettings } from './hittable';
import { Lambertian, LambertianSettings } from './lambertian';
import { Material, MaterialSettings } from './material';
import { Metal, MetalSettings } from './metal';
import { Sphere, SphereSettings } from './sphere';
import { Vector } from './vector';

export class Loader {

  public static loadHittable(hittableSettings: HittableSettings): Hittable | undefined {
    if (hittableSettings.className == Sphere.name) {
      return Sphere.from(hittableSettings as SphereSettings);
    }
  }

  public static loadMaterial(materialSettings: MaterialSettings): Material {
    if (materialSettings.className === Lambertian.name) {
      return Lambertian.from(materialSettings as LambertianSettings);
    }
    if (materialSettings.className === Metal.name) {
      return Metal.from(materialSettings as MetalSettings);
    } if (materialSettings.className === Dielectric.name) {
      return Dielectric.from(materialSettings as DielectricSettings);
    }
    return new Lambertian(new Vector(1, 0, 0));
  }
}