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

  public multiplyBy(n: number): Vector {
    return new Vector(this.x * n, this.y * n, this.z * n);
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

}
