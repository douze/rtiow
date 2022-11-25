import { HitRecord } from './hittable';
import { Ray } from './ray';
import { Vector } from './vector';

export abstract class Material {

  public abstract scatter(rayIn: Ray, record: HitRecord): Scattering;

  public createScattering(rayScattered: Ray, attenuation: Vector): Scattering {
    return {
      hasScattered: true,
      rayScattered: rayScattered,
      attenuation: attenuation
    }
  }

}

export interface Scattering {
  hasScattered: boolean;
  rayScattered?: Ray;
  attenuation?: Vector;
}

export const noScattering: Scattering = { hasScattered: false };
