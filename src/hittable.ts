import { Ray } from "./ray";
import { Vector } from "./vector";

export abstract class Hittable {

  public abstract hit(ray: Ray, tMin: number, tMax: number): HitRecord;

  public createHit(ray: Ray, point: Vector, outwardNormal: Vector, t: number) {
    const frontFace = Vector.dot(ray.direction, outwardNormal) < 0;
    return {
      hasHit: true,
      point: point,
      t: t,
      frontFace: frontFace,
      normal: frontFace ? outwardNormal : outwardNormal.negate()
    };
  }

}

export interface HitRecord {
  hasHit: boolean;
  point?: Vector;
  normal?: Vector;
  t?: number;
  frontFace?: boolean;
}

export const noHit: HitRecord = { hasHit: false };
