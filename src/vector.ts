import { random } from "./math";

export class Vector {

  constructor(public x: number, public y: number, public z: number) { }

  *[Symbol.iterator](): IterableIterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
  }

  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public multiplyBy(n: number): Vector;
  public multiplyBy(other: Vector): Vector;
  public multiplyBy(scalarOrVector: number | Vector): Vector {
    if (typeof scalarOrVector === 'number') {
      return new Vector(this.x * scalarOrVector, this.y * scalarOrVector, this.z * scalarOrVector);
    } else {
      return new Vector(this.x * scalarOrVector.x, this.y * scalarOrVector.y, this.z * scalarOrVector.z);
    }
  }

  public dividedBy(n: number): Vector {
    if (n == 0) throw "Can't divide by 0";
    return new Vector(this.x / n, this.y / n, this.z / n);
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public static dot(current: Vector, other: Vector): number {
    return current.x * other.x + current.y * other.y + current.z * other.z;
  }

  public unitVector(): Vector {
    return this.dividedBy(this.length());
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public negate(): Vector {
    return new Vector(-this.x, -this.y, -this.z);
  }

  public static random(min: number = 0, max: number = 1): Vector {
    return new Vector(random(min, max), random(min, max), random(min, max));
  }

  public static randomInUnitSphere(): Vector {
    while (true) {
      const point = Vector.random(-1, 1);
      if (point.lengthSquared() >= 1) continue;
      return point;
    }
  }

  public static randomUnitInUnitSphere(): Vector {
    return this.randomInUnitSphere().unitVector();
  }

  public isNearZero(): boolean {
    const epsilon = 1e-8;
    return Math.abs(this.x) < epsilon && Math.abs(this.y) < epsilon && Math.abs(this.z) < epsilon;
  }

  public reflect(normal: Vector): Vector {
    return this.subtract(normal.multiplyBy(2 * Vector.dot(this, normal)));
  }

}
