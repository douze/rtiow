import { degreesToRadians } from './math';
import { Ray } from './ray';
import { Vector } from './vector';

export class Camera {

  private origin: Vector;
  private horizontal: Vector;
  private vertical: Vector;
  private lowerLeftCorner: Vector;
  private u: Vector;
  private v: Vector;
  private w: Vector;
  private lensRadius: number;

  constructor(aspectRatio: number, verticalFieldOfView: number = 90.0, lookFrom: Vector = new Vector(0, 0, 0), lookAt: Vector = new Vector(0, 0, -1), upVector: Vector = new Vector(0, 1, 0), aperture: number = 0.0, focusDistance: number = 1.0) {
    const theta = degreesToRadians(verticalFieldOfView);
    const h = Math.tan(theta / 2.0);
    const viewportHeight = 2.0 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    this.w = lookFrom.subtract(lookAt).unitVector();
    this.u = Vector.cross(upVector, this.w).unitVector();
    this.v = Vector.cross(this.w, this.u);

    this.origin = lookFrom;
    this.horizontal = this.u.multiplyBy(viewportWidth * focusDistance);
    this.vertical = this.v.multiplyBy(viewportHeight * focusDistance);
    this.lowerLeftCorner = this.origin.subtract(this.horizontal.dividedBy(2)).subtract(this.vertical.dividedBy(2)).subtract(this.w.multiplyBy(focusDistance));

    this.lensRadius = aperture / 2.0;
  }

  public getRay(s: number, t: number): Ray {
    const rd: Vector = Vector.randomInUnitDisk().multiplyBy(this.lensRadius);
    const offset: Vector = this.u.multiplyBy(rd.x).add(this.v.multiplyBy(rd.y));
    return new Ray(this.origin.add(offset), this.lowerLeftCorner.add(this.horizontal.multiplyBy(s)).add(this.vertical.multiplyBy(t)).subtract(this.origin).subtract(offset));
  }

  public static from(cameraSettings: CameraSettings): Camera {
    return new Camera(cameraSettings.aspectRatio, cameraSettings.verticalFieldOfView, Vector.from(cameraSettings.lookFrom), Vector.from(cameraSettings.lookAt), Vector.from(cameraSettings.upVector), cameraSettings.aperture, cameraSettings.focusDistance);
  }

}

export interface CameraSettings {
  aspectRatio: number;
  verticalFieldOfView: number;
  lookFrom: Vector;
  lookAt: Vector;
  upVector: Vector;
  aperture: number;
  focusDistance: number;
}