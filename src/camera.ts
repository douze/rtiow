import { Ray } from "./ray";
import { Vector } from "./vector";

export class Camera {

  private origin: Vector;
  private horizontal: Vector;
  private vertical: Vector;
  private lowerLeftCorner: Vector;

  constructor(aspectRatio: number) {
    const viewportHeight = 2.0;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1.0;

    this.origin = new Vector(0, 0, 0);
    this.horizontal = new Vector(viewportWidth, 0, 0);
    this.vertical = new Vector(0, viewportHeight, 0);
    this.lowerLeftCorner = this.origin.subtract(this.horizontal.dividedBy(2)).subtract(this.vertical.dividedBy(2)).subtract(new Vector(0, 0, focalLength));
  }

  public getRay(u: number, v: number): Ray {
    return new Ray(this.origin, this.lowerLeftCorner.add(this.horizontal.multiplyBy(u)).add(this.vertical.multiplyBy(v)).subtract(this.origin));
  }

}