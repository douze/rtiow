import { HitRecord } from './hittable';
import { Material, MaterialSettings, Scattering } from './material';
import { Ray } from './ray';
import { Vector } from './vector';

export class Lambertian extends Material {

  constructor(public albedo: Vector) {
    super();
  }

  public scatter(rayIn: Ray, record: HitRecord): Scattering {
    let scatterDirection = record.normal!.add(Vector.randomUnitInUnitSphere());
    if (scatterDirection.isNearZero()) {
      scatterDirection = record.normal!;
    }
    return this.createScattering(new Ray(record.point!, scatterDirection), this.albedo);
  }

  public static from(lambertianSettings: LambertianSettings): Material {
    return new Lambertian(Vector.from(lambertianSettings.albedo));
  }

}

export interface LambertianSettings extends MaterialSettings {
  albedo: Vector;
}