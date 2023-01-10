import { HitRecord } from './hittable';
import { Material, MaterialSettings, Scattering } from './material';
import { Ray } from './ray';
import { Vector } from './vector';

export class Dielectric extends Material {

  constructor(public refractionIndex: number) {
    super();
  }

  public scatter(rayIn: Ray, record: HitRecord): Scattering {
    const refractionRatio = record.frontFace ? 1.0 / this.refractionIndex : this.refractionIndex;
    const unitDirection = rayIn.direction.unitVector();
    const cosTheta = Math.min(Vector.dot(unitDirection.negate(), record.normal!), 1.0);
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
    const cannotRefract = refractionRatio * sinTheta > 1.0;
    const direction = cannotRefract || this.reflectance(cosTheta, refractionRatio) > Math.random()
      ? unitDirection.reflect(record.normal!)
      : unitDirection.refract(record.normal!, refractionRatio);
    return this.createScattering(new Ray(record.point!, direction), new Vector(1.0, 1.0, 1.0));
  }

  private reflectance(cosine: number, referenceIndex: number): number {
    let r0 = (1 - referenceIndex) / (1 + referenceIndex);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
  }

  public static from(dielectricSettings: DielectricSettings): Dielectric {
    return new Dielectric(dielectricSettings.refractionIndex);
  }

}

export interface DielectricSettings extends MaterialSettings {
  refractionIndex: number;
}