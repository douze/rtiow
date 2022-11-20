import { HitRecord, Hittable, noHit } from './hittable';
import { Ray } from './ray';
import { Vector } from './vector';

export class HittableList extends Hittable {

  private objects: Array<Hittable> = [];

  public add(object: Hittable): void {
    this.objects.push(object);
  }

  public clear(): void {
    this.objects = [];
  }

  public hit(ray: Ray, tMin: number, tMax: number): HitRecord {
    let finalRecord: HitRecord = noHit;
    let closestSoFar = tMax;

    this.objects.forEach(object => {
      const temporaryHitRecord: HitRecord = object.hit(ray, tMin, closestSoFar);
      if (temporaryHitRecord.hasHit) {
        closestSoFar = temporaryHitRecord.t!;
        finalRecord = temporaryHitRecord;
      }
    });

    return finalRecord;
  }

}