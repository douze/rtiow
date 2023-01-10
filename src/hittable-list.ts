import { HitRecord, Hittable, HittableSettings, noHit } from './hittable';
import { Loader } from './loader';
import { Ray } from './ray';

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

  public static from(hittableListSettings: HittableListSettings): HittableList {
    const hittableList: HittableList = new HittableList();
    hittableListSettings.objects.forEach(object => hittableList.add(Loader.loadHittable(object)!));
    return hittableList;
  }

}

export interface HittableListSettings {
  objects: Array<HittableSettings>;
}