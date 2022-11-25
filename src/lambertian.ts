import { HitRecord } from './hittable';
import { Material, Scattering } from './material';
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

}