import { assert, describe, test } from 'vitest';
import { clamp, degreesToRadians, random } from '../src/math';

describe("Math", () => {

  test("Clamped valued", () => {
    let value = 10;
    const min = 8;
    const max = 12;
    assert.equal(clamp(value, min, max), value);

    value = 7;
    assert.equal(clamp(value, min, max), min);

    value = 13;
    assert.equal(clamp(value, min, max), max);
  });

  test("Clamped valued", () => {
    const min = 8;
    const max = 12;
    const value = random(min, max);
    assert.isAbove(value, min);
    assert.isBelow(value, max);
  });

  test("Degrees to radian", () => {
    assert.equal(degreesToRadians(0), 0);
    assert.equal(degreesToRadians(90), Math.PI / 2.0);
    assert.equal(degreesToRadians(180), Math.PI);
  });

});