import { assert, describe, test } from 'vitest';
import { Vector } from '../src/vector';
import { Ray } from '../src/ray';

describe("Ray", () => {

  test("A ray holds an origin and a direction", () => {
    test("Creating and querying a ray", () => {
      const origin = new Vector(1, 2, 3);
      const direction = new Vector(4, 5, 6);
      const ray = new Ray(origin, direction);
      assert.deepEqual(ray.origin, origin);
      assert.deepEqual(ray.direction, direction);
    });
  });

  test("Computing a point from a distance", () => {
    const ray = new Ray(new Vector(2, 3, 4), new Vector(1, 0, 0));
    assert.deepEqual(ray.at(0), new Vector(2, 3, 4));
    assert.deepEqual(ray.at(1), new Vector(3, 3, 4));
    assert.deepEqual(ray.at(-1), new Vector(1, 3, 4));
    assert.deepEqual(ray.at(2.5), new Vector(4.5, 3, 4));
  });

});
