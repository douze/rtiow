import { assert, describe, test } from 'vitest';
import { Vector } from '../src/vector';
import { Sphere } from '../src/sphere';
import { Ray } from '../src/ray';
import { HitRecord } from '../src/hittable';

describe("Sphere", () => {

  test("A vector holds center and radius", () => {
    const center = new Vector(0, 0, 0);
    const radius = 1.0;
    const sphere = new Sphere(center, radius);
    assert.deepEqual(sphere.center, center);
    assert.equal(sphere.radius, radius);
  });

  test("A ray intersects a sphere at two points", () => {
    const ray = new Ray(new Vector(0, 0, -5), new Vector(0, 0, 1));
    const sphere = new Sphere(new Vector(0, 0, 0), 1.0);
    const record: HitRecord = sphere.hit(ray, 0.0, 1000.0);
    
    assert.equal(record.t, 4);
    assert.deepEqual(record.point, new Vector(0,0,-1));
    assert.deepEqual(record.normal, new Vector(0,0,-1));
    assert.equal(record.frontFace, true);
  });

});