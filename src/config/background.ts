export const BACKGROUND_STORAGE_KEY = "pc-barbershop-bg-mode";

export type BackgroundMode = "grid" | "grainient";

export const GRAINIENT_PRESET = {
  color1: "#3a3a3a",
  color2: "#6b6b6b",
  color3: "#3a3a3a",
  timeSpeed: 0.35,
  colorBalance: -0.04,
  warpStrength: 1,
  warpFrequency: 5,
  warpSpeed: 2,
  warpAmplitude: 50,
  blendAngle: 0,
  blendSoftness: 0.05,
  rotationAmount: 500,
  noiseScale: 2,
  grainAmount: 0.1,
  grainScale: 2,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1,
  saturation: 1,
  centerX: 0,
  centerY: 0,
  zoom: 0.9,
} as const;
