import { HitRecord, Hittable, HittableSettings, noHit } from './hittable';
import { Lambertian } from './lambertian';
import { Loader } from './loader';
import { Material, MaterialSettings } from './material';
import { Ray } from './ray';
import { Vector } from './vector';

export class Sphere extends Hittable {

  constructor(public center: Vector, public radius: number, public material: Material = new Lambertian(new Vector(0.5, 0.5, 0.5))) {
    super();
  }

  public hit(ray: Ray, tMin: number, tMax: number): HitRecord {
    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.lengthSquared();
    const halfB = Vector.dot(oc, ray.direction);
    const c = oc.lengthSquared() - this.radius * this.radius;

    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) return noHit;

    const sqrtDiscriminant = Math.sqrt(discriminant);
    let root = (-halfB - sqrtDiscriminant) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtDiscriminant) / a;
      if (root < tMin || tMax < root) {
        return noHit;
      }
    }

    const point = ray.at(root);
    return this.createHit(ray, point, point.subtract(this.center).dividedBy(this.radius), root, this.material!);
  }

  public static from(sphereSettings: SphereSettings): Sphere {
    return new Sphere(sphereSettings.center, sphereSettings.radius, Loader.loadMaterial(sphereSettings.material));
  }

}

export interface SphereSettings extends HittableSettings {
  center: Vector,
  radius: number,
  material: MaterialSettings
}