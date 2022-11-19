import { Vector } from './vector';

export class Ray {

  constructor(public origin: Vector, public direction: Vector) { }

  public at(t: number): Vector {
    return this.origin.add(this.direction.multiplyBy(t));
  }

}