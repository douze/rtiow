import { HitRecord } from './hittable';
import { Material, MaterialSettings, noScattering, Scattering } from './material';
import { Ray } from './ray';
import { Vector } from './vector';

export class Metal extends Material {

  constructor(public albedo: Vector, public fuzz: number) {
    super();
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }

  public scatter(rayIn: Ray, record: HitRecord): Scattering {
    const reflectionDirection = rayIn.direction.unitVector().reflect(record.normal!);
    const rayScattered = new Ray(record.point!, reflectionDirection.add(Vector.randomInUnitSphere().multiplyBy(this.fuzz)));
    if (Vector.dot(rayScattered.direction, record.normal!) > 0) {
      return this.createScattering(rayScattered, this.albedo);
    } else {
      return noScattering;
    }
  }

  public static from(metalSettings: MetalSettings): Material {
    return new Metal(Vector.from(metalSettings.albedo), metalSettings.fuzz);
  }
  
}

export interface MetalSettings extends MaterialSettings {
  albedo: Vector;
  fuzz: number;
}