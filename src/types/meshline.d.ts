declare module "meshline" {
  import type { BufferGeometry, Material } from "three";

  export class MeshLineGeometry extends BufferGeometry {
    setPoints(points: Array<{ x: number; y: number; z: number } | number[]>): void;
  }

  export class MeshLineMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }
}
