import { assert, describe, test } from 'vitest';
import { Vector } from '../src/vector';

describe("Vector", () => {

  test("A vector holds x y z coordinates", () => {
    const vector = new Vector(4.3, -4.2, 3.1);
    assert.equal(vector.x, 4.3);
    assert.equal(vector.y, -4.2);
    assert.equal(vector.z, 3.1);
  });

  test("Vector is iterable", () => {
    const vector = new Vector(1, 2, 3);
    const arrayFromIterable = new Array<number>();
    assert.isFunction(vector[Symbol.iterator]);

    for (const n of vector) {
      arrayFromIterable.push(n);
    }
    assert.equal(vector.x, arrayFromIterable[0]);
    assert.equal(vector.y, arrayFromIterable[1]);
    assert.equal(vector.z, arrayFromIterable[2]);
  });

  test("Adding two vectors", () => {
    const vector1 = new Vector(3, -2, 5);
    const vector2 = new Vector(-2, 3, 1);
    assert.deepEqual(vector1.add(vector2), new Vector(1, 1, 6));
  });

  test("Substracting two vectors", () => {
    const vector1 = new Vector(3, 2, 1);
    const vector2 = new Vector(5, 6, 7);
    assert.deepEqual(vector1.subtract(vector2), new Vector(-2, -4, -6));
  });

  test("Multiplying a vector by a scalar", () => {
    const vector = new Vector(1, -2, 3);
    assert.deepEqual(vector.multiplyBy(3.5), new Vector(3.5, -7, 10.5));
  });

  test("Dividing a vector by a scalar", () => {
    const vector = new Vector(1, -2, 3);
    assert.deepEqual(vector.dividedBy(2), new Vector(0.5, -1, 1.5));
    assert.throws(() => vector.dividedBy(0));
  });

  test("Computing the length of a vector", () => {
    let vector = new Vector(1, 0, 0);
    assert.equal(vector.length(), 1);

    vector = new Vector(0, 1, 0);
    assert.equal(vector.length(), 1);

    vector = new Vector(0, 0, 1);
    assert.equal(vector.length(), 1);

    vector = new Vector(1, 2, 3);
    assert.equal(vector.length(), Math.sqrt(14));

    vector = new Vector(-1, -2, -3);
    assert.equal(vector.length(), Math.sqrt(14));
  });

  test("The dot product of two vectors", () => {
    const vector1 = new Vector(1, 2, 3);
    const vector2 = new Vector(2, 3, 4);
    assert.equal(Vector.dot(vector1, vector2), 20);
  });

  test("Unit vector", () => {
    const vector = new Vector(1, 2, 3);
    assert.deepEqual(vector.unitVector(), new Vector(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14)));
  });

  test("Length squared", () => {
    const vector = new Vector(1, 2, 3);
    assert.equal(vector.lengthSquared(), 14);
  });

  test("Negate a vector", () => {
    const vector = new Vector(1, 2, 3);
    assert.deepEqual(vector.negate(), new Vector(-1, -2, -3));
  });

  test("Random vector", () => {
    let vector = Vector.random();
    assert.isAtLeast(vector.x, 0);
    assert.isAtLeast(vector.y, 0);
    assert.isAtLeast(vector.z, 0);
    assert.isBelow(vector.x, 1);
    assert.isBelow(vector.y, 1);
    assert.isBelow(vector.z, 1);

    vector = Vector.random(10, 12);
    assert.isAtLeast(vector.x, 10);
    assert.isAtLeast(vector.y, 10);
    assert.isAtLeast(vector.z, 10);
    assert.isBelow(vector.x, 12);
    assert.isBelow(vector.y, 12);
    assert.isBelow(vector.z, 12);

    vector = Vector.randomInUnitSphere();
    assert.isBelow(vector.lengthSquared(), 1);
  });


});