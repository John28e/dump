"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// HERO ROCK RUBY GLASS MATERIAL & LIGHTING CONSTANTS
// ============================================================================

// --- Red Glass & Attenuation Controls (Red Saturation & Absorption) ---
const HERO_ROCK_COLOR = "#dc1a38"; // Tint of the glass
const HERO_ROCK_ATTENUATION_COLOR = "#7a0614"; // Absorption color in thick volume
const HERO_ROCK_ATTENUATION_DISTANCE = 1.8; // Distance for volume absorption
const HERO_ROCK_EMISSIVE_COLOR = "#3a0008"; // Deep red inner glow so deepest areas never turn black
const HERO_ROCK_EMISSIVE_INTENSITY = 0.15; // Emissive intensity: prevents black shadow falloff
const HERO_ROCK_ENV_TINT = "#5a0612"; // Procedural room environment tint (red-to-black grading)

// --- Transmission & Refraction Controls ---
const HERO_ROCK_TRANSMISSION = 1.0; // Translucent glass transmission (1.0 = full glass)
const HERO_ROCK_THICKNESS = 1.4; // Optical thickness for volume absorption
const HERO_ROCK_IOR = 1.77; // Refractive index of ruby / corundum crystal
const HERO_ROCK_DISPERSION = 0.015; // Subtle chromatic dispersion across cut facets

// --- Crystal Finish & Shine Controls ---
const HERO_ROCK_ROUGHNESS = 0.04; // Ultra-low surface roughness for crystal transparency
const HERO_ROCK_CLEARCOAT = 1.0; // Full high-gloss clearcoat layer
const HERO_ROCK_CLEARCOAT_ROUGHNESS = 0.03; // Clearcoat mirror finish
const HERO_ROCK_SPECULAR_INTENSITY = 1.0; // Facet specular reflection intensity
const HERO_ROCK_SPECULAR_COLOR = "#ffd0d8"; // Warm rose specular highlight color
const HERO_ROCK_ENV_INTENSITY = 1.2; // Procedural environment reflection intensity
const HERO_ROCK_RIM_COLOR = "#ff3b55"; // Narrow Fresnel rim highlight color
const HERO_ROCK_RIM_INTENSITY = 0.35; // Fresnel rim brightness on grazing edges
const HERO_ROCK_GLINT_COLOR = "#ffe3e8"; // Glint spark color for facet edge sparkles
const HERO_ROCK_GLINT_INTENSITY = 0.28; // Glint point light sparkle intensity
const HERO_ROCK_MAIN_LIGHT_COLOR = "#d61836"; // Key light color for top facet specular
const HERO_ROCK_MAIN_LIGHT_INTENSITY = 1.2; // Key light intensity for crystal facet shine

// ============================================================================
// HERO ROCK SHATTER & PHOTO MOSAIC CONSTANTS
// ============================================================================
const SHATTER_PHASE_HOLD = 0.10; // 0.00-0.10: Hold unbroken rock shape; hairline crack flash near 0.08
const SHATTER_PHASE_SCATTER = 0.50; // 0.10-0.50: 3D scatter, tumble, outward arc with depth variation
const SHATTER_PHASE_GATHER = 0.90; // 0.50-0.90: Steer toward photo mosaic slots, rotate flat
const SHATTER_PHASE_SETTLE = 1.00; // 0.90-1.00: Settle into crisp flat photo mosaic; hand-off into work

const SHATTER_TARGET_COUNT_DESKTOP = 220; // Target piece count on desktop (M = 220)
const SHATTER_TARGET_COUNT_MOBILE = 180; // Target piece count on mobile (M = 180)
const SHATTER_RANDOM_SEED = 42.0; // PRNG seed for deterministic shatter & tumble
const SHATTER_SCATTER_RADIUS = 3.6; // Outward arc burst radius in world units
const SHATTER_MAX_TUMBLE_RAD = Math.PI * 3.5; // Maximum tumble rotation in radians during scatter
const SHATTER_STAGGER_SPREAD = 0.12; // Per-shard burst stagger spread across progress
const SHATTER_GAP_SCALE = 0.985; // Slight shard inset so hairline cracks between landed pieces remain readable
const SHATTER_SWAP_THRESHOLD = 0.004; // Seamless transition threshold between rockMesh and shardsGroup

// 12 Mosaic Image URLs in sequential order
const MOSAIC_IMAGE_URLS = [
  "/images/mosaic/mosaic-01-brand-board.webp",
  "/images/mosaic/mosaic-02-stationery.webp",
  "/images/mosaic/mosaic-03-packaging.webp",
  "/images/mosaic/mosaic-04-phone-mockup.webp",
  "/images/mosaic/mosaic-05-payments-app.webp",
  "/images/mosaic/mosaic-06-tea-storefront.webp",
  "/images/mosaic/mosaic-07-devtool-docs.webp",
  "/images/mosaic/mosaic-08-homecare-booking.webp",
  "/images/mosaic/mosaic-09-ai-infrastructure.webp",
  "/images/mosaic/mosaic-10-agritech-platform.webp",
  "/images/mosaic/mosaic-11-course-learning.webp",
  "/images/mosaic/mosaic-12-mobility-transit.webp",
];

// Utility: check WebGL support safely
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

// Utility: check prefers-reduced-motion
function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Deterministic Pseudo-Random Generator (Linear Congruential Generator)
function createPseudoRandom(seed: number) {
  let s = seed % 2147483647;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Helper: Tint the rock's own envMap red-to-black with warm white area lights
function createRubyRoomEnvironment(): THREE.Scene {
  const envScene = new THREE.Scene();
  envScene.name = "RubyRoomEnvironment";
  envScene.background = new THREE.Color("#150104");
  envScene.position.y = -3.5;

  const geometry = new THREE.BoxGeometry();
  geometry.deleteAttribute("uv");

  const roomMaterial = new THREE.MeshLambertMaterial({
    side: THREE.BackSide,
    color: 0x000000,
    emissive: new THREE.Color(HERO_ROCK_ENV_TINT),
    emissiveIntensity: 0.75,
  });

  const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000,
    emissive: new THREE.Color("#2a0208"),
    emissiveIntensity: 0.6,
  });

  const room = new THREE.Mesh(geometry, roomMaterial);
  room.position.set(-0.757, 13.219, 0.717);
  room.scale.set(31.713, 28.305, 28.591);
  envScene.add(room);

  const boxes = new THREE.InstancedMesh(geometry, boxMaterial, 6);
  const transform = new THREE.Object3D();

  const boxConfigs = [
    { pos: [-10.906, 2.009, 1.846], rot: [0, -0.195, 0], scale: [2.328, 7.905, 4.651] },
    { pos: [-5.607, -0.754, -0.758], rot: [0, 0.994, 0], scale: [1.97, 1.534, 3.955] },
    { pos: [6.167, 0.857, 7.803], rot: [0, 0.561, 0], scale: [3.927, 6.285, 3.687] },
    { pos: [-2.017, 0.018, 6.124], rot: [0, 0.333, 0], scale: [2.002, 4.566, 2.064] },
    { pos: [2.291, -0.756, -2.621], rot: [0, -0.286, 0], scale: [1.546, 1.552, 1.496] },
    { pos: [-2.193, -0.369, -5.547], rot: [0, 0.516, 0], scale: [3.875, 3.487, 2.986] },
  ];

  boxConfigs.forEach((c, idx) => {
    transform.position.set(c.pos[0], c.pos[1], c.pos[2]);
    transform.rotation.set(c.rot[0], c.rot[1], c.rot[2]);
    transform.scale.set(c.scale[0], c.scale[1], c.scale[2]);
    transform.updateMatrix();
    boxes.setMatrixAt(idx, transform.matrix);
  });
  envScene.add(boxes);

  const createAreaLightMat = (intensity: number) => {
    return new THREE.MeshLambertMaterial({
      color: 0x000000,
      emissive: new THREE.Color("#fff2f4"),
      emissiveIntensity: intensity,
    });
  };

  const lights = [
    { pos: [-16.116, 14.37, 8.208], scale: [0.1, 0.7, 0.7], intensity: 8 },
    { pos: [-16.109, 18.021, -8.207], scale: [0.1, 0.7, 0.7], intensity: 8 },
    { pos: [14.904, 12.198, -1.832], scale: [0.15, 1.0, 1.4], intensity: 5 },
    { pos: [-0.462, 8.89, 14.52], scale: [1.1, 1.2, 0.088], intensity: 7 },
    { pos: [3.235, 11.486, -12.541], scale: [0.7, 0.6, 0.1], intensity: 5 },
    { pos: [0.0, 20.0, 0.0], scale: [0.3, 0.1, 0.3], intensity: 12 },
  ];

  lights.forEach((l) => {
    const mesh = new THREE.Mesh(geometry, createAreaLightMat(l.intensity));
    mesh.position.set(l.pos[0], l.pos[1], l.pos[2]);
    mesh.scale.set(l.scale[0], l.scale[1], l.scale[2]);
    envScene.add(mesh);
  });

  return envScene;
}

// Build the deformed rock geometry (180 facets, noise displaced)
function buildRockGeometry(): THREE.BufferGeometry {
  const baseRockGeo = new THREE.IcosahedronGeometry(0.95, 2);
  const rockGeo = baseRockGeo.index ? baseRockGeo.toNonIndexed() : baseRockGeo.clone();
  baseRockGeo.dispose();
  const rockPosAttr = rockGeo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < rockPosAttr.count; i++) {
    v.fromBufferAttribute(rockPosAttr, i);
    const noise =
      Math.sin(v.x * 2.8) * Math.cos(v.y * 3.2) * Math.sin(v.z * 2.6);
    const factor = 1.0 + noise * 0.28;
    v.multiplyScalar(factor);
    v.y *= 0.78;
    rockPosAttr.setXYZ(i, v.x, v.y, v.z);
  }
  rockGeo.computeVertexNormals();
  return rockGeo;
}

// Helper: Subdivide cells into natural non-degenerate triangles using longest-edge bisection
interface MosaicCell {
  cellIdx: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
}

interface CellTriangleData {
  cellIdx: number;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  area: number;
}

function generateCellTriangles(
  cells: MosaicCell[],
  targetCount: number
): CellTriangleData[] {
  const tris: CellTriangleData[] = [];
  cells.forEach((cell) => {
    const { x0, x1, y0, y1, cellIdx, u0, u1, v0, v1 } = cell;
    tris.push({
      cellIdx,
      u0,
      u1,
      v0,
      v1,
      x0,
      x1,
      y0,
      y1,
      p0: { x: x0, y: y0 },
      p1: { x: x1, y: y0 },
      p2: { x: x1, y: y1 },
      area: (x1 - x0) * (y1 - y0) * 0.5,
    });
    tris.push({
      cellIdx,
      u0,
      u1,
      v0,
      v1,
      x0,
      x1,
      y0,
      y1,
      p0: { x: x0, y: y0 },
      p1: { x: x1, y: y1 },
      p2: { x: x0, y: y1 },
      area: (x1 - x0) * (y1 - y0) * 0.5,
    });
  });

  while (tris.length < targetCount) {
    let maxIdx = 0;
    let maxArea = tris[0].area;
    for (let i = 1; i < tris.length; i++) {
      if (tris[i].area > maxArea) {
        maxArea = tris[i].area;
        maxIdx = i;
      }
    }
    const t = tris.splice(maxIdx, 1)[0];
    const { p0, p1, p2, cellIdx, u0, u1, v0, v1, x0, x1, y0, y1 } = t;
    const d01 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const d12 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const d20 = Math.hypot(p0.x - p2.x, p0.y - p2.y);

    let vA: { x: number; y: number };
    let vB: { x: number; y: number };
    let vOpp: { x: number; y: number };
    if (d01 >= d12 && d01 >= d20) {
      vA = p0;
      vB = p1;
      vOpp = p2;
    } else if (d12 >= d01 && d12 >= d20) {
      vA = p1;
      vB = p2;
      vOpp = p0;
    } else {
      vA = p2;
      vB = p0;
      vOpp = p1;
    }
    const mid = { x: (vA.x + vB.x) * 0.5, y: (vA.y + vB.y) * 0.5 };
    const a1 =
      Math.abs(
        (vA.x - vOpp.x) * (mid.y - vOpp.y) - (mid.x - vOpp.x) * (vA.y - vOpp.y)
      ) * 0.5;
    const a2 =
      Math.abs(
        (vB.x - vOpp.x) * (mid.y - vOpp.y) - (mid.x - vOpp.x) * (vB.y - vOpp.y)
      ) * 0.5;

    tris.push({
      cellIdx,
      u0,
      u1,
      v0,
      v1,
      x0,
      x1,
      y0,
      y1,
      p0: vOpp,
      p1: vA,
      p2: mid,
      area: a1,
    });
    tris.push({
      cellIdx,
      u0,
      u1,
      v0,
      v1,
      x0,
      x1,
      y0,
      y1,
      p0: vOpp,
      p1: mid,
      p2: vB,
      area: a2,
    });
  }

  return tris;
}

// Helper: Load 12 images into an ultra crisp 4x3 texture atlas
function loadAndBuildTextureAtlas(
  urls: string[],
  isMobile: boolean,
  maxAnisotropy: number
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(new THREE.Texture());
      return;
    }

    const cellW = isMobile ? 512 : 800;
    const cellH = Math.round(cellW * (9 / 16));
    const atlasW = cellW * 4;
    const atlasH = cellH * 3;

    const canvas = document.createElement("canvas");
    canvas.width = atlasW;
    canvas.height = atlasH;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) {
      resolve(new THREE.Texture());
      return;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, atlasW, atlasH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let loadedCount = 0;
    const total = urls.length;
    urls.forEach((url, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const dx = col * cellW;
        const dy = row * cellH;
        ctx.drawImage(img, dx, dy, cellW, cellH);
        loadedCount++;
        if (loadedCount === total) {
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.anisotropy = Math.min(maxAnisotropy, 8);
          texture.needsUpdate = true;
          resolve(texture);
        }
      };
      img.onerror = () => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        ctx.fillStyle = "#111111";
        ctx.fillRect(col * cellW, row * cellH, cellW, cellH);
        loadedCount++;
        if (loadedCount === total) {
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          resolve(texture);
        }
      };
      img.src = url;
    });
  });
}

// Build non-indexed Shard BufferGeometry with target 12-image photo mosaic layout & attributes
function buildShatterGeometry(
  isVertical: boolean,
  isMobile: boolean,
  baseRockPositions: Float32Array,
  cameraD: number = 3.2
): THREE.BufferGeometry {
  const targetCount = isMobile
    ? SHATTER_TARGET_COUNT_MOBILE
    : SHATTER_TARGET_COUNT_DESKTOP;

  // Extract base rock triangles
  const rockTriangles: {
    a: THREE.Vector3;
    b: THREE.Vector3;
    c: THREE.Vector3;
    area: number;
    originalIndex: number;
  }[] = [];

  for (let i = 0; i < baseRockPositions.length; i += 9) {
    const a = new THREE.Vector3(
      baseRockPositions[i],
      baseRockPositions[i + 1],
      baseRockPositions[i + 2]
    );
    const b = new THREE.Vector3(
      baseRockPositions[i + 3],
      baseRockPositions[i + 4],
      baseRockPositions[i + 5]
    );
    const c = new THREE.Vector3(
      baseRockPositions[i + 6],
      baseRockPositions[i + 7],
      baseRockPositions[i + 8]
    );
    const area =
      new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3().subVectors(b, a),
          new THREE.Vector3().subVectors(c, a)
        )
        .length() * 0.5;
    rockTriangles.push({ a, b, c, area, originalIndex: i / 9 });
  }

  // Split largest facets if needed (strictly coplanar along longest edge)
  const splitCount = targetCount - rockTriangles.length;
  let finalRockTriangles: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [];
  if (splitCount > 0) {
    const sorted = [...rockTriangles].sort((t1, t2) => t2.area - t1.area);
    const splitIndices = new Set(
      sorted.slice(0, splitCount).map((t) => t.originalIndex)
    );
    for (let i = 0; i < rockTriangles.length; i++) {
      const tri = rockTriangles[i];
      if (!splitIndices.has(tri.originalIndex)) {
        finalRockTriangles.push([tri.a, tri.b, tri.c]);
      } else {
        const dAB = tri.a.distanceToSquared(tri.b);
        const dBC = tri.b.distanceToSquared(tri.c);
        const dCA = tri.c.distanceToSquared(tri.a);
        let p0: THREE.Vector3, p1: THREE.Vector3, opp: THREE.Vector3;
        if (dAB >= dBC && dAB >= dCA) {
          p0 = tri.a;
          p1 = tri.b;
          opp = tri.c;
        } else if (dBC >= dAB && dBC >= dCA) {
          p0 = tri.b;
          p1 = tri.c;
          opp = tri.a;
        } else {
          p0 = tri.c;
          p1 = tri.a;
          opp = tri.b;
        }
        const mid = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5);
        finalRockTriangles.push([opp, p0, mid]);
        finalRockTriangles.push([opp, mid, p1]);
      }
    }
  } else {
    finalRockTriangles = rockTriangles.map((t) => [t.a, t.b, t.c]);
  }

  // Compute World Frustum Bounds for Photo Mosaic at z = 0.0 with Camera at z = cameraD (3.2)
  const fov = (45 * Math.PI) / 180;
  const fH = 2 * cameraD * Math.tan(fov / 2);
  const aspect =
    typeof window !== "undefined"
      ? window.innerWidth / window.innerHeight
      : isVertical
      ? 0.56
      : 1.6;
  const fW = fH * aspect;

  // Layout 12 Photo Mosaic Cells in 3D Space
  const cols = isVertical ? 3 : 4;
  const rows = isVertical ? 4 : 3;
  const gridW = isVertical ? fW * 0.92 : Math.min(fW * 0.90, 4.4);
  const gapX = gridW * (isVertical ? 0.015 : 0.012);
  const cellW = (gridW - (cols - 1) * gapX) / cols;
  const cellH = cellW * (9 / 16);
  const gapY = gapX;
  const gridH = rows * cellH + (rows - 1) * gapY;
  const startX = -gridW / 2;
  const startY = gridH / 2;

  const cells: MosaicCell[] = [];
  for (let c = 0; c < 12; c++) {
    const col = c % cols;
    const row = Math.floor(c / cols);
    const x0 = startX + col * (cellW + gapX);
    const x1 = x0 + cellW;
    const y1 = startY - row * (cellH + gapY);
    const y0 = y1 - cellH;

    // UV coordinates in 4x3 atlas
    const atlasCol = c % 4;
    const atlasRow = Math.floor(c / 4);
    const u0 = atlasCol / 4.0;
    const u1 = (atlasCol + 1.0) / 4.0;
    const v0 = (2.0 - atlasRow) / 3.0;
    const v1 = (3.0 - atlasRow) / 3.0;

    cells.push({ cellIdx: c, x0, x1, y0, y1, u0, u1, v0, v1 });
  }

  // Triangulate cells up to targetCount
  const targetTrianglesData = generateCellTriangles(cells, targetCount);

  // Convert to 3D triangles
  const targetTriangles: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] =
    targetTrianglesData.map((td) => [
      new THREE.Vector3(td.p0.x, td.p0.y, 0.0),
      new THREE.Vector3(td.p1.x, td.p1.y, 0.0),
      new THREE.Vector3(td.p2.x, td.p2.y, 0.0),
    ]);

  // Centroids & Greedy Pair Matching (Rock Shard -> Mosaic Cell Shard)
  const rockCentroids = finalRockTriangles.map((t) =>
    new THREE.Vector3().add(t[0]).add(t[1]).add(t[2]).multiplyScalar(1 / 3)
  );
  const targetCentroids = targetTriangles.map((t) =>
    new THREE.Vector3().add(t[0]).add(t[1]).add(t[2]).multiplyScalar(1 / 3)
  );

  const availableTarget = new Set(targetTriangles.map((_, i) => i));
  const rockToTarget = new Array(finalRockTriangles.length);

  for (let rIdx = 0; rIdx < rockCentroids.length; rIdx++) {
    const rc = rockCentroids[rIdx];
    let bestIdx = -1;
    let bestDist = Infinity;
    for (const tIdx of availableTarget) {
      const tc = targetCentroids[tIdx];
      const d = Math.hypot(rc.x - tc.x, rc.y - tc.y);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = tIdx;
      }
    }
    availableTarget.delete(bestIdx);
    rockToTarget[rIdx] = bestIdx;
  }

  // Construct Non-Indexed Shard Geometry Buffers with Barycentric & Texture Atlas UV coordinates
  const M = finalRockTriangles.length;
  const positions = new Float32Array(M * 9);
  const normals = new Float32Array(M * 9);
  const aTargetPos = new Float32Array(M * 9);
  const aTargetNormal = new Float32Array(M * 9);
  const aRestCentroid = new Float32Array(M * 9);
  const aTargetCentroid = new Float32Array(M * 9);
  const aShardParams = new Float32Array(M * 12);
  const aBarycentric = new Float32Array(M * 9);
  const aAtlasUv = new Float32Array(M * 6);

  const rand = createPseudoRandom(SHATTER_RANDOM_SEED);
  const baryVals = [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
  ];

  for (let rIdx = 0; rIdx < M; rIdx++) {
    const tIdx = rockToTarget[rIdx];
    const rTri = finalRockTriangles[rIdx];
    const tTri = targetTriangles[tIdx];
    const td = targetTrianglesData[tIdx];

    const rCentroid = rockCentroids[rIdx];
    const tCentroid = targetCentroids[tIdx];

    const rEdge1 = new THREE.Vector3().subVectors(rTri[1], rTri[0]);
    const rEdge2 = new THREE.Vector3().subVectors(rTri[2], rTri[0]);
    const rNorm = new THREE.Vector3().crossVectors(rEdge1, rEdge2).normalize();

    const shardSeed = rand();
    const stagger = THREE.MathUtils.clamp(
      rCentroid.length() * 0.4 + shardSeed * 0.4,
      0.0,
      1.0
    );
    const tumbleSpeed = 0.85 + rand() * 0.55;
    const depthOffset = (rand() - 0.5) * 1.0;

    const tVerts = [td.p0, td.p1, td.p2];

    for (let k = 0; k < 3; k++) {
      const vIdx = rIdx * 3 + k;
      const i3 = vIdx * 3;
      const i4 = vIdx * 4;
      const i2 = vIdx * 2;

      positions[i3] = rTri[k].x;
      positions[i3 + 1] = rTri[k].y;
      positions[i3 + 2] = rTri[k].z;

      normals[i3] = rNorm.x;
      normals[i3 + 1] = rNorm.y;
      normals[i3 + 2] = rNorm.z;

      aTargetPos[i3] = tTri[k].x;
      aTargetPos[i3 + 1] = tTri[k].y;
      aTargetPos[i3 + 2] = 0.0;

      aTargetNormal[i3] = 0.0;
      aTargetNormal[i3 + 1] = 0.0;
      aTargetNormal[i3 + 2] = 1.0;

      aRestCentroid[i3] = rCentroid.x;
      aRestCentroid[i3 + 1] = rCentroid.y;
      aRestCentroid[i3 + 2] = rCentroid.z;

      aTargetCentroid[i3] = tCentroid.x;
      aTargetCentroid[i3 + 1] = tCentroid.y;
      aTargetCentroid[i3 + 2] = 0.0;

      aShardParams[i4] = stagger;
      aShardParams[i4 + 1] = shardSeed;
      aShardParams[i4 + 2] = tumbleSpeed;
      aShardParams[i4 + 3] = depthOffset;

      aBarycentric[i3] = baryVals[k][0];
      aBarycentric[i3 + 1] = baryVals[k][1];
      aBarycentric[i3 + 2] = baryVals[k][2];

      // Exact UV within cell & 4x3 atlas
      const tv = tVerts[k];
      const uLocal = (tv.x - td.x0) / (td.x1 - td.x0);
      const vLocal = (tv.y - td.y0) / (td.y1 - td.y0);
      const U = td.u0 + uLocal * (td.u1 - td.u0);
      const V = td.v0 + vLocal * (td.v1 - td.v0);
      aAtlasUv[i2] = U;
      aAtlasUv[i2 + 1] = V;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geo.setAttribute("aTargetPos", new THREE.BufferAttribute(aTargetPos, 3));
  geo.setAttribute("aTargetNormal", new THREE.BufferAttribute(aTargetNormal, 3));
  geo.setAttribute("aRestCentroid", new THREE.BufferAttribute(aRestCentroid, 3));
  geo.setAttribute(
    "aTargetCentroid",
    new THREE.BufferAttribute(aTargetCentroid, 3)
  );
  geo.setAttribute("aShardParams", new THREE.BufferAttribute(aShardParams, 4));
  geo.setAttribute("aBarycentric", new THREE.BufferAttribute(aBarycentric, 3));
  geo.setAttribute("aAtlasUv", new THREE.BufferAttribute(aAtlasUv, 2));

  geo.userData = {
    mosaicBounds: new THREE.Vector4(
      startX,
      startX + gridW,
      startY - gridH,
      startY
    ),
  };

  return geo;
}

export const GlobalCanvas: React.FC = () => {
  const { isLoaded } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
    setIsReducedMotion(checkReducedMotion());
  }, []);

  useEffect(() => {
    if (!hasWebGL) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6.2);
    camera.layers.enable(1); // Enable layer 1 for glints and rock lighting

    const isMobileViewport =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches);
    const isVerticalViewport =
      typeof window !== "undefined" &&
      window.innerHeight > window.innerWidth;

    // 2. WebGL Renderer with DPR clamped to [1, 2]
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      (renderer as unknown as { transmissionResolutionScale: number }).transmissionResolutionScale =
        isMobileViewport ? 0.5 : 1.0;
    } catch {
      setHasWebGL(false);
      return;
    }

    // 3. State & Active Scene Tracking
    let activeScene: "hero" | "globe" | "none" = "hero";
    let heroScrollProgress = 0;

    // ----------------------------------------------------
    // HERO SCENE: Procedural Rock-Podium + Shatter Mosaic
    // ----------------------------------------------------
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // A. Procedural Rock-Podium (Unbroken Base Rock)
    const rockGeo = buildRockGeometry();
    const rockPosAttr = rockGeo.attributes.position;
    const baseRockPositions = new Float32Array(rockPosAttr.array);

    // Generate tinted Ruby RoomEnvironment for rock reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const rubyEnvScene = createRubyRoomEnvironment();
    const rubyEnvMap = pmremGenerator.fromScene(rubyEnvScene).texture;
    pmremGenerator.dispose();
    rubyEnvScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    // Opaque white backdrop plane directly behind rock for transmission pass only
    const backdropGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const backdropMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });
    const backdropPlane = new THREE.Mesh(backdropGeo, backdropMat);
    backdropPlane.position.set(0, 0, -1.15);
    backdropPlane.layers.enable(1);

    backdropPlane.onBeforeRender = (rndr) => {
      const isTransmissionPass = rndr.getRenderTarget() !== null;
      backdropMat.colorWrite = isTransmissionPass;
      backdropMat.depthWrite = isTransmissionPass;
    };
    heroGroup.add(backdropPlane);

    // Dark ruby translucent glass material for the unbroken rock
    const rockMaterial = new THREE.MeshPhysicalMaterial({
      transmission: HERO_ROCK_TRANSMISSION,
      thickness: HERO_ROCK_THICKNESS,
      color: new THREE.Color(HERO_ROCK_COLOR),
      attenuationColor: new THREE.Color(HERO_ROCK_ATTENUATION_COLOR),
      attenuationDistance: HERO_ROCK_ATTENUATION_DISTANCE,
      ior: HERO_ROCK_IOR,
      roughness: HERO_ROCK_ROUGHNESS,
      clearcoat: HERO_ROCK_CLEARCOAT,
      clearcoatRoughness: HERO_ROCK_CLEARCOAT_ROUGHNESS,
      specularIntensity: HERO_ROCK_SPECULAR_INTENSITY,
      specularColor: new THREE.Color(HERO_ROCK_SPECULAR_COLOR),
      emissive: new THREE.Color(HERO_ROCK_EMISSIVE_COLOR),
      emissiveIntensity: HERO_ROCK_EMISSIVE_INTENSITY,
      flatShading: true,
      side: isMobileViewport ? THREE.FrontSide : THREE.DoubleSide,
      envMap: rubyEnvMap,
      envMapIntensity: HERO_ROCK_ENV_INTENSITY,
      transparent: true,
      opacity: 1.0,
    });

    if (!isMobileViewport && "dispersion" in rockMaterial) {
      (rockMaterial as unknown as { dispersion: number }).dispersion =
        HERO_ROCK_DISPERSION;
    }

    // Fresnel rim highlight for unbroken rock
    rockMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
        #ifdef OPAQUE
        diffuseColor.a = 1.0;
        #endif
        #ifdef USE_TRANSMISSION
        diffuseColor.a *= material.transmissionAlpha;
        #endif

        float rimNdotV = saturate( dot( normal, geometryViewDir ) );
        float rimFactor = pow( 1.0 - rimNdotV, 4.5 );
        vec3 rimBase = vec3( 1.0, 0.2314, 0.3333 );
        vec3 rimPeak = vec3( 1.0, 0.92, 0.94 );
        vec3 finalRimColor = mix( rimBase, rimPeak, pow( rimFactor, 3.0 ) );
        outgoingLight += finalRimColor * ( rimFactor * ${HERO_ROCK_RIM_INTENSITY.toFixed(2)} );

        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
      );
    };

    const rockMesh = new THREE.Mesh(rockGeo, rockMaterial);
    rockMesh.layers.enable(1);
    heroGroup.add(rockMesh);

    // Two small glint point lights used for rock and shards (layer 1)
    const glintLight1 = new THREE.PointLight(
      new THREE.Color(HERO_ROCK_GLINT_COLOR),
      HERO_ROCK_GLINT_INTENSITY,
      7,
      2
    );
    glintLight1.layers.set(1);

    const glintLight2 = new THREE.PointLight(
      new THREE.Color(HERO_ROCK_GLINT_COLOR),
      HERO_ROCK_GLINT_INTENSITY * 0.8,
      7,
      2
    );
    glintLight2.layers.set(1);

    heroGroup.add(glintLight1);
    heroGroup.add(glintLight2);

    // Directional main light for rock and shards (layer 1)
    const mainLight = new THREE.DirectionalLight(
      new THREE.Color(HERO_ROCK_MAIN_LIGHT_COLOR),
      HERO_ROCK_MAIN_LIGHT_INTENSITY
    );
    mainLight.position.set(0.6, 4.0, 2.2);
    mainLight.target = rockMesh;
    mainLight.layers.set(1);
    heroGroup.add(mainLight);

    // ----------------------------------------------------
    // B. SHATTERED ROCK & CRYSTAL "IDENTITY" WORDMARK
    // ----------------------------------------------------
    // Build initial shatter geometry
    let currentShatterGeo = buildShatterGeometry(
      isVerticalViewport,
      isMobileViewport,
      baseRockPositions,
      3.2
    );

    const shatterUniforms = {
      uProgress: { value: 0.0 },
      uReducedMotion: { value: isReducedMotion ? 1.0 : 0.0 },
    };

    // Shard Glass Material (cloned with vertex morph & fragment fade)
    const shardGlassMaterial = rockMaterial.clone();
    shardGlassMaterial.customProgramCacheKey = () => "shard_glass_morph_v3";
    shardGlassMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uProgress = shatterUniforms.uProgress;
      shader.uniforms.uReducedMotion = shatterUniforms.uReducedMotion;

      shader.vertexShader =
        `
        attribute vec3 aTargetPos;
        attribute vec3 aTargetNormal;
        attribute vec3 aRestCentroid;
        attribute vec3 aTargetCentroid;
        attribute vec4 aShardParams;
        attribute vec3 aBarycentric;

        uniform float uProgress;
        uniform float uReducedMotion;

        varying float vShardTravel;

        vec3 rotateVectorByAxis(vec3 v, vec3 axis, float angle) {
          return v * cos(angle) + cross(axis, v) * sin(angle) + axis * dot(axis, v) * (1.0 - cos(angle));
        }
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
        float pNorm = clamp(uProgress, 0.0, 1.0);
        float staggerNorm = aShardParams.x * ${SHATTER_STAGGER_SPREAD.toFixed(2)};
        float pStartNorm = 0.08 + staggerNorm;
        float pEndNorm = ${SHATTER_PHASE_GATHER.toFixed(2)};
        float tNorm = clamp((pNorm - pStartNorm) / (pEndNorm - pStartNorm), 0.0, 1.0);
        float smoothTNorm = smoothstep(0.0, 1.0, tNorm);
        vShardTravel = smoothTNorm;

        vec3 axisNorm = normalize(vec3(
          sin(aShardParams.y * 31.41),
          cos(aShardParams.y * 17.29),
          sin(aShardParams.y * 53.11 + 1.0)
        ));
        float tumbleDecayNorm = pow(1.0 - smoothTNorm, 1.8);
        float tumbleAngleNorm = (uReducedMotion > 0.5) ? 0.0 : sin(smoothTNorm * 3.14159265) * ${SHATTER_MAX_TUMBLE_RAD.toFixed(2)} * aShardParams.z * tumbleDecayNorm;

        vec3 objectNormal = rotateVectorByAxis(normal, axisNorm, tumbleAngleNorm);
        objectNormal = normalize(mix(objectNormal, vec3(0.0, 0.0, 1.0), smoothstep(0.65, 0.95, smoothTNorm)));
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        float crack = smoothstep(0.06, ${SHATTER_PHASE_HOLD.toFixed(2)}, pNorm) * 0.015 * (1.0 - smoothTNorm);
        vec3 crackOffset = normalize(aRestCentroid) * crack;

        vec3 restRel = position - aRestCentroid;
        float gapScale = mix(${SHATTER_GAP_SCALE.toFixed(3)}, 1.0, smoothstep(0.85, 0.98, smoothTNorm));
        vec3 targetRel = (aTargetPos - aTargetCentroid) * gapScale;
        vec3 curRel = mix(restRel, targetRel, smoothTNorm);
        vec3 rotRel = rotateVectorByAxis(curRel, axisNorm, tumbleAngleNorm);

        float arc = (uReducedMotion > 0.5) ? 0.0 : sin(smoothTNorm * 3.14159265);
        vec3 outwardDir = normalize(aRestCentroid + vec3(sin(aShardParams.y * 6.28) * 0.4, cos(aShardParams.y * 6.28) * 0.4, aShardParams.w * 0.6));
        vec3 arcOffset = outwardDir * (arc * ${SHATTER_SCATTER_RADIUS.toFixed(2)});

        vec3 curCentroid = mix(aRestCentroid, aTargetCentroid, smoothTNorm) + arcOffset + crackOffset;
        vec3 transformed = curCentroid + rotRel;
        `
      );

      shader.fragmentShader =
        `
        varying float vShardTravel;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
        #ifdef OPAQUE
        diffuseColor.a = 1.0;
        #endif
        #ifdef USE_TRANSMISSION
        diffuseColor.a *= material.transmissionAlpha;
        #endif

        // Fresnel rim highlight on glass shards
        float rimNdotV = saturate( dot( normal, geometryViewDir ) );
        float rimFactor = pow( 1.0 - rimNdotV, 4.5 );
        vec3 rimBase = vec3( 1.0, 0.2314, 0.3333 );
        vec3 rimPeak = vec3( 1.0, 0.92, 0.94 );
        vec3 finalRimColor = mix( rimBase, rimPeak, pow( rimFactor, 3.0 ) );
        outgoingLight += finalRimColor * ( rimFactor * ${HERO_ROCK_RIM_INTENSITY.toFixed(2)} );

        // Crossfade: glass fades out as shard reaches final typography destination
        float glassFade = 1.0 - smoothstep(0.75, 0.98, vShardTravel);
        diffuseColor.a *= glassFade;

        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
      );
    };

    // 1x1 dark placeholder texture while atlas loads
    const placeholderCanvas = document.createElement("canvas");
    placeholderCanvas.width = 1;
    placeholderCanvas.height = 1;
    const pCtx = placeholderCanvas.getContext("2d");
    if (pCtx) {
      pCtx.fillStyle = "#050505";
      pCtx.fillRect(0, 0, 1, 1);
    }
    const placeholderTexture = new THREE.CanvasTexture(placeholderCanvas);

    let atlasTexture: THREE.Texture | null = null;
    let isDisposed = false;

    // Photo Mosaic Shard Material (Sampling high-DPI texture atlas with glints, sweep & dissolves)
    const photoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: placeholderTexture },
        uHasAtlas: { value: 0.0 },
        uProgress: shatterUniforms.uProgress,
        uReducedMotion: shatterUniforms.uReducedMotion,
        uBounds: { value: currentShatterGeo.userData.mosaicBounds },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aTargetPos;
        attribute vec3 aTargetNormal;
        attribute vec3 aRestCentroid;
        attribute vec3 aTargetCentroid;
        attribute vec4 aShardParams;
        attribute vec3 aBarycentric;
        attribute vec2 aAtlasUv;

        uniform float uProgress;
        uniform float uReducedMotion;

        varying vec3 vBarycentric;
        varying vec2 vAtlasUv;
        varying float vShardTravel;
        varying float vLandingGlint;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying float vShardSeed;

        vec3 rotateVectorByAxis(vec3 v, vec3 axis, float angle) {
          return v * cos(angle) + cross(axis, v) * sin(angle) + axis * dot(axis, v) * (1.0 - cos(angle));
        }

        void main() {
          vBarycentric = aBarycentric;
          vAtlasUv = aAtlasUv;
          vShardSeed = aShardParams.y;

          float p = clamp(uProgress, 0.0, 1.0);
          float stagger = aShardParams.x * ${SHATTER_STAGGER_SPREAD.toFixed(2)};
          float pStart = 0.08 + stagger;
          float pEnd = ${SHATTER_PHASE_GATHER.toFixed(2)};
          float t = clamp((p - pStart) / (pEnd - pStart), 0.0, 1.0);
          float smoothT = smoothstep(0.0, 1.0, t);
          vShardTravel = smoothT;

          float crack = smoothstep(0.06, ${SHATTER_PHASE_HOLD.toFixed(2)}, p) * 0.015 * (1.0 - smoothT);
          vec3 crackOffset = normalize(aRestCentroid) * crack;

          vec3 restRel = position - aRestCentroid;
          float gapScale = mix(${SHATTER_GAP_SCALE.toFixed(3)}, 1.0, smoothstep(0.85, 0.98, smoothT));
          vec3 targetRel = (aTargetPos - aTargetCentroid) * gapScale;
          vec3 curRel = mix(restRel, targetRel, smoothT);

          vec3 axis = normalize(vec3(
            sin(aShardParams.y * 31.41),
            cos(aShardParams.y * 17.29),
            sin(aShardParams.y * 53.11 + 1.0)
          ));
          float tumbleDecay = pow(1.0 - smoothT, 1.8);
          float tumbleAngle = (uReducedMotion > 0.5) ? 0.0 : sin(smoothT * 3.14159265) * ${SHATTER_MAX_TUMBLE_RAD.toFixed(2)} * aShardParams.z * tumbleDecay;
          vec3 rotRel = rotateVectorByAxis(curRel, axis, tumbleAngle);

          float arc = (uReducedMotion > 0.5) ? 0.0 : sin(smoothT * 3.14159265);
          vec3 outwardDir = normalize(aRestCentroid + vec3(sin(aShardParams.y * 6.28) * 0.4, cos(aShardParams.y * 6.28) * 0.4, aShardParams.w * 0.6));
          vec3 arcOffset = outwardDir * (arc * ${SHATTER_SCATTER_RADIUS.toFixed(2)});

          vec3 curCentroid = mix(aRestCentroid, aTargetCentroid, smoothT) + arcOffset + crackOffset;
          vec3 finalPos = curCentroid + rotRel;

          vec3 rotNorm = rotateVectorByAxis(normal, axis, tumbleAngle);
          vec3 finalNorm = normalize(mix(rotNorm, vec3(0.0, 0.0, 1.0), smoothstep(0.65, 0.95, smoothT)));
          vWorldNormal = normalize((modelMatrix * vec4(finalNorm, 0.0)).xyz);
          vWorldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;

          // Landing glint flash on facet edges as shard lands
          vLandingGlint = sin(clamp((smoothT - 0.82) / 0.18, 0.0, 1.0) * 3.14159265);

          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlas;
        uniform float uHasAtlas;
        uniform float uProgress;
        uniform vec4 uBounds;
        uniform float uTime;

        varying vec3 vBarycentric;
        varying vec2 vAtlasUv;
        varying float vShardTravel;
        varying float vLandingGlint;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying float vShardSeed;

        void main() {
          if (vShardTravel < 0.65) {
            discard;
          }

          float photoFade = smoothstep(0.70, 0.92, vShardTravel);

          // Sample texture atlas or dark fallback
          vec4 sampleTex = (uHasAtlas > 0.5) ? texture2D(uAtlas, vAtlasUv) : vec4(0.08, 0.08, 0.09, 1.0);
          vec3 basePhoto = sampleTex.rgb;

          // Warm ruby glass transition tint that fades out as photos settle
          vec3 rubyTint = vec3(0.92, 0.14, 0.28) * (1.0 - smoothstep(0.72, 0.94, vShardTravel)) * 0.45;

          // Subtle crystal facet seams that smoothly dissolve as shards lock into the seamless photo mosaic
          float edgeDist = min(vBarycentric.x, min(vBarycentric.y, vBarycentric.z));
          float seam = 1.0 - smoothstep(0.002, 0.016, edgeDist);
          float seamDissolve = 1.0 - smoothstep(0.85, 0.98, uProgress);
          vec3 seamColor = vec3(1.0, 0.88, 0.92) * (seam * seamDissolve * 0.50);

          // Horizontal cinematic light sweep as mosaic solidifies (uProgress in [0.80, 0.98])
          float normX = clamp((vWorldPos.x - uBounds.x) / max(0.001, uBounds.y - uBounds.x), 0.0, 1.0);
          float sweepCenter = mix(-0.25, 1.25, smoothstep(0.80, 0.98, uProgress));
          float sweepDist = abs(normX - sweepCenter);
          float sweepBeam = exp(-sweepDist * sweepDist * 22.0);
          vec3 sweepGlow = vec3(1.0, 0.96, 0.98) * (sweepBeam * 0.35);

          // Landing spark flash on each facet
          vec3 glintColor = vec3(1.0, 0.96, 0.98) * (vLandingGlint * 0.45);

          // Delicate grazing Fresnel rim highlight along outer edges
          float rim = pow(1.0 - clamp(dot(vWorldNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.5);
          float rimFade = 1.0 - smoothstep(0.92, 1.0, uProgress);
          vec3 rimColor = vec3(1.0, 0.70, 0.80) * (rim * 0.35 * rimFade);

          vec3 finalColor = basePhoto + rubyTint + seamColor + sweepGlow + glintColor + rimColor;

          gl_FragColor = vec4(finalColor, photoFade);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    loadAndBuildTextureAtlas(
      MOSAIC_IMAGE_URLS,
      isMobileViewport,
      renderer.capabilities.getMaxAnisotropy()
    ).then((tex) => {
      if (isDisposed) {
        tex.dispose();
        return;
      }
      atlasTexture = tex;
      photoMaterial.uniforms.uAtlas.value = tex;
      photoMaterial.uniforms.uHasAtlas.value = 1.0;
    });

    const shardsGroup = new THREE.Group();
    heroGroup.add(shardsGroup);
    shardsGroup.visible = false;

    const shardsMesh = new THREE.Mesh(currentShatterGeo, shardGlassMaterial);
    shardsMesh.layers.enable(1);
    shardsMesh.renderOrder = 1;
    shardsGroup.add(shardsMesh);

    const photoMesh = new THREE.Mesh(currentShatterGeo, photoMaterial);
    photoMesh.layers.enable(1);
    photoMesh.renderOrder = 2;
    shardsGroup.add(photoMesh);

    // ----------------------------------------------------
    // WORLDWIDE SCENE: Interactive 3D Dotted Globe
    // ----------------------------------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.visible = false;

    const pointsCount = 1400;
    const globePositions = new Float32Array(pointsCount * 3);
    const globeScales = new Float32Array(pointsCount);
    const globeRadius = 1.95;

    for (let i = 0; i < pointsCount; i++) {
      const phi = Math.acos(-1.0 + (2.0 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      globePositions[i * 3] = globeRadius * Math.cos(theta) * Math.sin(phi);
      globePositions[i * 3 + 1] = globeRadius * Math.sin(theta) * Math.sin(phi);
      globePositions[i * 3 + 2] = globeRadius * Math.cos(phi);
      globeScales[i] = Math.random() * 0.4 + 0.8;
    }

    const globeGeo = new THREE.BufferGeometry();
    globeGeo.setAttribute("position", new THREE.BufferAttribute(globePositions, 3));
    globeGeo.setAttribute("aScale", new THREE.BufferAttribute(globeScales, 1));

    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: 3.2 },
        uOpacity: { value: 0.9 },
      },
      vertexShader: `
        uniform float uSize;
        attribute float aScale;
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          gl_PointSize = uSize * aScale * (42.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vWorldPos;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.28, dist);
          float depthFactor = smoothstep(-1.9, 1.9, vWorldPos.z);
          float finalAlpha = alpha * mix(0.2, 0.95, depthFactor) * uOpacity;
          gl_FragColor = vec4(vec3(1.0), finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const globePoints = new THREE.Points(globeGeo, globeMaterial);
    globeGroup.add(globePoints);

    // Globe Drag Interaction State with Inertial Decay
    const globeVelocity = { x: 0, y: 0 };
    let isGlobeDragging = false;

    const onGlobeDrag = (e: Event) => {
      const customEvent = e as CustomEvent<{ dx: number; dy: number }>;
      const { dx, dy } = customEvent.detail;
      globeVelocity.x += dx * 0.0028;
      globeVelocity.y += dy * 0.0028;
    };

    const onGlobeDragStart = () => {
      isGlobeDragging = true;
    };

    const onGlobeDragEnd = () => {
      isGlobeDragging = false;
    };

    window.addEventListener("globe-drag", onGlobeDrag);
    window.addEventListener("globe-drag-start", onGlobeDragStart);
    window.addEventListener("globe-drag-end", onGlobeDragEnd);

    // ----------------------------------------------------
    // GSAP ScrollTrigger Section Transitions & Scrubbing
    // ----------------------------------------------------
    const ctx = gsap.context(() => {
      // 1. Hero Scroll Track: Shatter rock into crystal IDENTITY wordmark
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          heroScrollProgress = self.progress;
        },
      });

      // Hero visibility tracking through complete scroll-out
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
          activeScene = "hero";
          heroGroup.visible = true;
          globeGroup.visible = false;
        },
        onLeave: () => {
          activeScene = "none";
          heroGroup.visible = false;
        },
        onEnterBack: () => {
          activeScene = "hero";
          heroGroup.visible = true;
          globeGroup.visible = false;
        },
        onLeaveBack: () => {
          activeScene = "hero";
          heroGroup.visible = true;
          globeGroup.visible = false;
        },
      });

      // 2. Worldwide Section: Enable 3D Globe
      ScrollTrigger.create({
        trigger: "#worldwide",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          activeScene = "globe";
          globeGroup.visible = true;
          heroGroup.visible = false;
        },
        onLeave: () => {
          activeScene = "none";
          globeGroup.visible = false;
        },
        onEnterBack: () => {
          activeScene = "globe";
          globeGroup.visible = true;
          heroGroup.visible = false;
        },
        onLeaveBack: () => {
          activeScene = "none";
          globeGroup.visible = false;
        },
      });
    });

    // Refresh ScrollTrigger once fonts are loaded to ensure precise layout geometry
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // ----------------------------------------------------
    // Render Loop & Performance Optimization
    // ----------------------------------------------------
    let animId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const rawDelta = (now - lastTime) * 0.001;
      lastTime = now;

      if (document.hidden) {
        return;
      }

      // Clamp time delta to max 0.1s per frame to prevent rotation/glint jump on tab resume
      const dt = Math.min(rawDelta, 0.1);
      accumulatedTime += dt;

      if (activeScene === "none") {
        return;
      }

      const elapsedTime = accumulatedTime;

      // Render Hero Scene
      if (activeScene === "hero") {
        const p = heroScrollProgress;
        shatterUniforms.uProgress.value = p;
        photoMaterial.uniforms.uTime.value = elapsedTime;

        // Rock / Shards Idle Rotation and Visibility Swap
        if (p <= SHATTER_SWAP_THRESHOLD) {
          rockMesh.visible = true;
          shardsGroup.visible = false;
          rockMesh.rotation.y = elapsedTime * 0.12;
          rockMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
          rockMaterial.opacity = 1.0;
        } else {
          rockMesh.visible = false;
          shardsGroup.visible = true;
          // Smoothly decay idle rotation as scatter takes over (p in [0.06, 0.20])
          const idleFade = Math.max(0, 1.0 - (p - 0.06) / 0.14);
          shardsGroup.rotation.y = elapsedTime * 0.12 * idleFade;
          shardsGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08 * idleFade;
        }

        // Glint lights slow circling motion over ~8 seconds
        if (!isReducedMotion) {
          const glintAngle1 = elapsedTime * ((Math.PI * 2) / 8.0);
          glintLight1.position.set(
            Math.cos(glintAngle1) * 2.5,
            1.0 + Math.sin(glintAngle1 * 0.5) * 0.4,
            Math.sin(glintAngle1) * 2.5
          );

          const glintAngle2 = -elapsedTime * ((Math.PI * 2) / 8.0) + Math.PI;
          glintLight2.position.set(
            Math.cos(glintAngle2) * 2.3,
            -0.6 + Math.cos(glintAngle2 * 0.5) * 0.3,
            Math.sin(glintAngle2) * 2.3
          );
        } else {
          glintLight1.position.set(2.2, 1.0, 1.6);
          glintLight2.position.set(-1.8, -0.6, -1.4);
        }

        // Canvas background interpolates from pure white (#ffffff) to deep slate/black (#020202) by 30% of scroll
        const bgFade = Math.min(1.0, p / 0.3);
        scene.background = new THREE.Color("#ffffff").lerp(
          new THREE.Color("#020202"),
          bgFade
        );

        // Camera zoom across track
        camera.position.z = THREE.MathUtils.lerp(6.2, 3.2, p);

        // Backdrop plane smooth fade so shards are naturally exposed to dark background
        backdropMat.opacity = Math.max(0, 1.0 - p * 3.0);
        backdropPlane.visible = backdropMat.opacity > 0.001;

        renderer.render(scene, camera);
      }

      // Render Worldwide Globe Scene
      if (activeScene === "globe") {
        scene.background = new THREE.Color("#020202");
        const isMobile = window.innerWidth < 768;
        const targetZ = isMobile ? 6.6 : 5.0;
        camera.position.set(0, 0, targetZ);

        globePoints.rotation.y += globeVelocity.x;
        globePoints.rotation.x += globeVelocity.y;

        globeVelocity.x *= 0.93;
        globeVelocity.y *= 0.93;

        if (!isGlobeDragging && Math.abs(globeVelocity.x) < 0.0003) {
          globePoints.rotation.y += 0.0022;
        }

        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animate);

    // Debounced (~150ms) Resize Handler adapting to portrait / landscape
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isNowPortrait = h > w;
        const isNowMobile =
          w < 768 || window.matchMedia("(pointer: coarse)").matches;
        const newGeo = buildShatterGeometry(
          isNowPortrait,
          isNowMobile,
          baseRockPositions,
          3.2
        );
        currentShatterGeo.dispose();
        currentShatterGeo = newGeo;
        shardsMesh.geometry = newGeo;
        photoMesh.geometry = newGeo;
        photoMaterial.uniforms.uBounds.value.copy(
          newGeo.userData.mosaicBounds
        );
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("globe-drag", onGlobeDrag);
      window.removeEventListener("globe-drag-start", onGlobeDragStart);
      window.removeEventListener("globe-drag-end", onGlobeDragEnd);
      ctx.revert();

      // Dispose Three.js resources
      rockGeo.dispose();
      rockMaterial.dispose();
      backdropGeo.dispose();
      backdropMat.dispose();
      rubyEnvMap.dispose();
      currentShatterGeo.dispose();
      shardGlassMaterial.dispose();
      isDisposed = true;
      placeholderTexture.dispose();
      if (atlasTexture) {
        (atlasTexture as THREE.Texture).dispose();
      }
      photoMaterial.dispose();
      globeGeo.dispose();
      globeMaterial.dispose();
      renderer.dispose();
    };
  }, [hasWebGL, isReducedMotion]);

  // Static Gradient Fallback for WebGL unavailable (Requirement 6)
  if (!hasWebGL) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white via-black to-black"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
      style={{
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <canvas
        id="global-canvas"
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
