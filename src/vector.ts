import { random } from './math';

export class Vector {

  constructor(public x: number, public y: number, public z: number = 0) { }

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

  public refract(normal: Vector, etaiOverEtat: number): Vector {
    const cosTheta = Math.min(Vector.dot(this.negate(), normal), 1.0);
    const rayOutPerpendicular = this.add(normal.multiplyBy(cosTheta)).multiplyBy(etaiOverEtat);
    const rayOutParallel = normal.multiplyBy(-Math.sqrt(Math.abs(1.0 - rayOutPerpendicular.lengthSquared())));
    return rayOutPerpendicular.add(rayOutParallel);
  }

  public static cross(current: Vector, other: Vector): Vector {
    return new Vector(
      current.y * other.z - current.z * other.y,
      current.z * other.x - current.x * other.z,
      current.x * other.y - current.y * other.x);
  }

  public static randomInUnitDisk(): Vector {
    while (true) {
      const point = new Vector(random(-1, 1), random(-1, 1), 0);
      if (point.lengthSquared() >= 1) continue;
      return point;
    }
  }

  public static from(vectorSettings: VectorSettings) {
    return new Vector(vectorSettings.x, vectorSettings.y, vectorSettings.z);
  }

}

export interface VectorSettings {
  x: number,
  y: number,
  z: number
}
