import { degreesToRadians } from "./math";
import { Ray } from "./ray";
import { Vector } from "./vector";

export class Camera {

  private origin: Vector;
  private horizontal: Vector;
  private vertical: Vector;
  private lowerLeftCorner: Vector;

  constructor(aspectRatio: number, verticalFieldOfView: number = 90.0, lookFrom: Vector = new Vector(0, 0, 0), lookAt: Vector = new Vector(0, 0, -1), upVector: Vector = new Vector(0, 1, 0)) {
    const theta = degreesToRadians(verticalFieldOfView);
    const h = Math.tan(theta / 2.0);
    const viewportHeight = 2.0 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    const w: Vector = lookFrom.subtract(lookAt).unitVector();
    const u: Vector = Vector.cross(upVector, w).unitVector();
    const v: Vector = Vector.cross(w, u);

    this.origin = lookFrom;
    this.horizontal = u.multiplyBy(viewportWidth);
    this.vertical = v.multiplyBy(viewportHeight);
    this.lowerLeftCorner = this.origin.subtract(this.horizontal.dividedBy(2)).subtract(this.vertical.dividedBy(2)).subtract(w);
  }

  public getRay(s: number, t: number): Ray {
    return new Ray(this.origin, this.lowerLeftCorner.add(this.horizontal.multiplyBy(s)).add(this.vertical.multiplyBy(t)).subtract(this.origin));
  }

}