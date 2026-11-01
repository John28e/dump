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
const HERO_ROCK_COLOR = "#dc1a38"; // Tint of the glass (Requirement: vibrant ruby red tint)
const HERO_ROCK_ATTENUATION_COLOR = "#7a0614"; // Absorption color in thick volume (Requirement: #7a0614)
const HERO_ROCK_ATTENUATION_DISTANCE = 1.8; // Distance for volume absorption (center deepens to ruby, edges stay lighter)
const HERO_ROCK_EMISSIVE_COLOR = "#3a0008"; // Deep red inner glow so deepest areas never turn black (#3a0008)
const HERO_ROCK_EMISSIVE_INTENSITY = 0.15; // Emissive intensity: prevents black shadow falloff
const HERO_ROCK_ENV_TINT = "#5a0612"; // Procedural room environment tint (red-to-black grading)

// --- Transmission & Refraction Controls ---
const HERO_ROCK_TRANSMISSION = 1.0; // Translucent glass transmission (1.0 = full glass)
const HERO_ROCK_THICKNESS = 1.4; // Optical thickness for volume absorption (center darker than edges)
const HERO_ROCK_IOR = 1.77; // Refractive index of ruby / corundum crystal (1.77)
const HERO_ROCK_DISPERSION = 0.015; // Subtle chromatic dispersion across cut facets

// --- Crystal Finish & Shine Controls ---
const HERO_ROCK_ROUGHNESS = 0.04; // Ultra-low surface roughness for crystal transparency (0.04)
const HERO_ROCK_CLEARCOAT = 1.0; // Full high-gloss clearcoat layer (1.0)
const HERO_ROCK_CLEARCOAT_ROUGHNESS = 0.03; // Clearcoat mirror finish (0.03)
const HERO_ROCK_SPECULAR_INTENSITY = 1.0; // Facet specular reflection intensity (1.0)
const HERO_ROCK_SPECULAR_COLOR = "#ffd0d8"; // Warm rose specular highlight color (Requirement: #ffd0d8)
const HERO_ROCK_ENV_INTENSITY = 1.2; // Procedural environment reflection intensity (~1.2)
const HERO_ROCK_RIM_COLOR = "#ff3b55"; // Narrow Fresnel rim highlight color (Requirement: #ff3b55)
const HERO_ROCK_RIM_INTENSITY = 0.35; // Fresnel rim brightness on grazing edges
const HERO_ROCK_GLINT_COLOR = "#ffe3e8"; // Glint spark color for facet edge sparkles (Requirement: #ffe3e8)
const HERO_ROCK_GLINT_INTENSITY = 0.28; // Glint point light sparkle intensity
const HERO_ROCK_MAIN_LIGHT_COLOR = "#d61836"; // Key light color for top facet specular
const HERO_ROCK_MAIN_LIGHT_INTENSITY = 1.2; // Key light intensity for crystal facet shine

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

// Helper: Tint the rock'\''s own envMap red-to-black with warm white area lights (Requirement 4)
function createRubyRoomEnvironment(): THREE.Scene {
  const envScene = new THREE.Scene();
  envScene.name = "RubyRoomEnvironment";
  envScene.background = new THREE.Color("#150104"); // Deep ruby-black environment background
  envScene.position.y = -3.5;

  const geometry = new THREE.BoxGeometry();
  geometry.deleteAttribute("uv");

  // Tint walls and floor toward #5a0612 (red-to-black grading)
  // Using emissive dark ruby ensures the room reflects deep red, not white-grey
  const roomMaterial = new THREE.MeshLambertMaterial({
    side: THREE.BackSide,
    color: 0x000000,
    emissive: new THREE.Color(HERO_ROCK_ENV_TINT), // #5a0612
    emissiveIntensity: 0.75,
  });

  const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000,
    emissive: new THREE.Color("#2a0208"), // Darker red-to-black
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

  // Area lights: warm white only at small sizes (Requirement 4)
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
    if (!hasWebGL || isReducedMotion) return;
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
    camera.layers.enable(1); // Enable layer 1 so camera sees both default meshes and rock-only lights

    const isMobileViewport =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);

    // 2. WebGL Renderer with DPR clamped to [1, 2] (Requirement 6)
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
      // Performance: scale transmission buffer on mobile
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
    // HERO SCENE: Procedural Rock-Podium + Unfolding Mosaic
    // ----------------------------------------------------
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // A. Procedural Rock-Podium (Requirements 1-7)
    // Non-indexed displaced geometry with computeVertexNormals for crisp crystal facets
    const baseRockGeo = new THREE.IcosahedronGeometry(0.95, 2);
    const rockGeo = baseRockGeo.toNonIndexed();
    baseRockGeo.dispose();
    const rockPosAttr = rockGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < rockPosAttr.count; i++) {
      v.fromBufferAttribute(rockPosAttr, i);
      // Displace vertices with harmonic noise for natural rocky facets
      const noise =
        Math.sin(v.x * 2.8) * Math.cos(v.y * 3.2) * Math.sin(v.z * 2.6);
      const factor = 1.0 + noise * 0.28;
      v.multiplyScalar(factor);
      // Flatten top/bottom slightly like a podium stone
      v.y *= 0.78;
      rockPosAttr.setXYZ(i, v.x, v.y, v.z);
    }
    rockGeo.computeVertexNormals();

    // Generate tinted Ruby RoomEnvironment for rock reflections (Reflections 1-3)
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

    // Opaque white backdrop plane directly behind rock for transmission pass only (Backdrop 1-3)
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

    // Visible to transmission pass only (colorWrite/depthWrite enabled when target != null)
    backdropPlane.onBeforeRender = (rndr) => {
      const isTransmissionPass = rndr.getRenderTarget() !== null;
      backdropMat.colorWrite = isTransmissionPass;
      backdropMat.depthWrite = isTransmissionPass;
    };
    heroGroup.add(backdropPlane);

    // Dark ruby translucent glass material (Material 1-5)
    const rockMaterial = new THREE.MeshPhysicalMaterial({
      transmission: HERO_ROCK_TRANSMISSION, // 1.0
      thickness: HERO_ROCK_THICKNESS, // 1.4
      color: new THREE.Color(HERO_ROCK_COLOR), // #c4122e
      attenuationColor: new THREE.Color(HERO_ROCK_ATTENUATION_COLOR), // #7a0614
      attenuationDistance: HERO_ROCK_ATTENUATION_DISTANCE, // 0.9
      ior: HERO_ROCK_IOR, // 1.77
      roughness: HERO_ROCK_ROUGHNESS, // 0.04
      clearcoat: HERO_ROCK_CLEARCOAT, // 1.0
      clearcoatRoughness: HERO_ROCK_CLEARCOAT_ROUGHNESS, // 0.03
      specularIntensity: HERO_ROCK_SPECULAR_INTENSITY, // 1.0
      specularColor: new THREE.Color(HERO_ROCK_SPECULAR_COLOR), // #ffd0d8
      emissive: new THREE.Color(HERO_ROCK_EMISSIVE_COLOR), // #3a0008
      emissiveIntensity: HERO_ROCK_EMISSIVE_INTENSITY, // 0.15
      flatShading: true, // Cut crystal facets
      side: isMobileViewport ? THREE.FrontSide : THREE.DoubleSide, // DoubleSide on desktop
      envMap: rubyEnvMap,
      envMapIntensity: HERO_ROCK_ENV_INTENSITY, // 1.2
      transparent: true,
      opacity: 1.0,
    });

    if (!isMobileViewport && "dispersion" in rockMaterial) {
      (rockMaterial as unknown as { dispersion: number }).dispersion = HERO_ROCK_DISPERSION;
    }

    // Fresnel rim via onBeforeCompile: narrow, color #ff3b55, reaching bright rose-white only at peak
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

        // Narrow Fresnel rim highlight (Requirement: color #ff3b55)
        float rimNdotV = saturate( dot( normal, geometryViewDir ) );
        float rimFactor = pow( 1.0 - rimNdotV, 4.5 ); // Narrow rim
        vec3 rimBase = vec3( 1.0, 0.2314, 0.3333 ); // #ff3b55
        vec3 rimPeak = vec3( 1.0, 0.92, 0.94 ); // Reaches rose-white at peak on sharpest facets
        vec3 finalRimColor = mix( rimBase, rimPeak, pow( rimFactor, 3.0 ) );
        outgoingLight += finalRimColor * ( rimFactor * ${HERO_ROCK_RIM_INTENSITY.toFixed(2)} );

        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
      );
    };

    const rockMesh = new THREE.Mesh(rockGeo, rockMaterial);
    rockMesh.layers.enable(1); // Enable layer 1 so only rock receives glint lights
    heroGroup.add(rockMesh);

    // Two small glint point lights used ONLY for this rock (layer 1)
    const glintLight1 = new THREE.PointLight(
      new THREE.Color(HERO_ROCK_GLINT_COLOR), // #ffe3e8
      HERO_ROCK_GLINT_INTENSITY, // 0.28
      7,
      2
    );
    glintLight1.layers.set(1);

    const glintLight2 = new THREE.PointLight(
      new THREE.Color(HERO_ROCK_GLINT_COLOR), // #ffe3e8
      HERO_ROCK_GLINT_INTENSITY * 0.8,
      7,
      2
    );
    glintLight2.layers.set(1);

    heroGroup.add(glintLight1);
    heroGroup.add(glintLight2);

    // Directional main light used ONLY for this rock (layer 1) to shade top facets
    const mainLight = new THREE.DirectionalLight(
      new THREE.Color(HERO_ROCK_MAIN_LIGHT_COLOR),
      HERO_ROCK_MAIN_LIGHT_INTENSITY
    );
    mainLight.position.set(0.6, 4.0, 2.2);
    mainLight.target = rockMesh;
    mainLight.layers.set(1);
    heroGroup.add(mainLight);

    // B. Unfolding Mosaic Grid of Textured Planes (Requirement 3 & 5)
    const mosaicGroup = new THREE.Group();
    heroGroup.add(mosaicGroup);

    const mosaicData: {
      url: string;
      isPortrait: boolean;
      baseOffset: [number, number, number];
    }[] = [
      {
        url: "/images/mosaic/mosaic-01-trail-stride.webp",
        isPortrait: false,
        baseOffset: [-2.6, 1.4, -1.2],
      },
      {
        url: "/images/mosaic/mosaic-02-cyclist-climb.webp",
        isPortrait: true,
        baseOffset: [2.7, 1.5, -0.9],
      },
      {
        url: "/images/mosaic/mosaic-03-sprinter-blocks.webp",
        isPortrait: false,
        baseOffset: [-2.8, -1.3, -0.8],
      },
      {
        url: "/images/mosaic/mosaic-04-basketball.webp",
        isPortrait: false,
        baseOffset: [2.6, -1.4, -1.3],
      },
      {
        url: "/images/mosaic/mosaic-05-swimmer.webp",
        isPortrait: true,
        baseOffset: [-1.2, 2.4, -1.8],
      },
      {
        url: "/images/mosaic/mosaic-06-soccer.webp",
        isPortrait: false,
        baseOffset: [1.3, 2.3, -2.1],
      },
      {
        url: "/images/mosaic/mosaic-07-boxer.webp",
        isPortrait: false,
        baseOffset: [-1.3, -2.4, -1.7],
      },
      {
        url: "/images/mosaic/mosaic-08-skier.webp",
        isPortrait: false,
        baseOffset: [1.2, -2.4, -2.0],
      },
      {
        url: "/images/mosaic/mosaic-09-mountain-runner.webp",
        isPortrait: false,
        baseOffset: [-4.2, 0.2, -2.5],
      },
      {
        url: "/images/mosaic/mosaic-10-cyclist-pack.webp",
        isPortrait: true,
        baseOffset: [4.2, 0.2, -2.5],
      },
      {
        url: "/images/mosaic/mosaic-11-surfer-wave.webp",
        isPortrait: false,
        baseOffset: [-3.5, 2.2, -3.0],
      },
      {
        url: "/images/mosaic/mosaic-12-rock-climbing.webp",
        isPortrait: true,
        baseOffset: [3.5, -2.2, -3.0],
      },
    ];

    const landscapeGeo = new THREE.PlaneGeometry(1.85, 1.04);
    const portraitGeo = new THREE.PlaneGeometry(1.05, 1.40);
    const textureLoader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];

    const mosaicPlanes: {
      mesh: THREE.Mesh;
      baseOffset: [number, number, number];
      material: THREE.ShaderMaterial;
    }[] = [];

    mosaicData.forEach((item) => {
      const texture = textureLoader.load(item.url);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);

      const planeMat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uOpacity: { value: 0.9 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vDepth = -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uOpacity;
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            // Border highlight
            float borderX = step(0.012, vUv.x) * step(vUv.x, 0.988);
            float borderY = step(0.018, vUv.y) * step(vUv.y, 0.982);
            float border = borderX * borderY;
            vec3 finalColor = mix(vec3(0.35), texColor.rgb, border);
            // Fade out when passing camera
            float nearFade = smoothstep(0.4, 1.5, vDepth);
            gl_FragColor = vec4(finalColor, texColor.a * uOpacity * nearFade);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const geo = item.isPortrait ? portraitGeo : landscapeGeo;
      const mesh = new THREE.Mesh(geo, planeMat);
      mosaicGroup.add(mesh);
      mosaicPlanes.push({
        mesh,
        baseOffset: item.baseOffset,
        material: planeMat,
      });
    });

    // ----------------------------------------------------
    // WORLDWIDE SCENE: Interactive 3D Dotted Globe (Requirement 4 & 5)
    // ----------------------------------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.visible = false;

    // Fibonacci sphere distribution of 1400 points
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
          // Depth factor: camera-facing dots are bright, rear dots are softly dimmed
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

    // Globe Drag Interaction State with Inertial Decay (Requirement 4)
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
      // 1. Hero Scroll Track: Unfold mosaic and zoom camera linearly across h-svh + 200svh
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          heroScrollProgress = self.progress;
        },
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

    // ----------------------------------------------------
    // Render Loop & Performance Optimization (Requirement 6)
    // ----------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Performance: Pause rendering when off-screen / inactive (Requirement 6)
      if (activeScene === "none") {
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Render Hero Scene
      if (activeScene === "hero") {
        // Rock podium: subtle floating & scaling with scroll
        rockMesh.rotation.y = elapsedTime * 0.12;
        rockMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;

        // Glint lights slow circling motion over ~8 seconds (Crystal Shine 2 & 3)
        if (!isReducedMotion) {
          const glintAngle1 = elapsedTime * (Math.PI * 2 / 8.0);
          glintLight1.position.set(
            Math.cos(glintAngle1) * 2.5,
            1.0 + Math.sin(glintAngle1 * 0.5) * 0.4,
            Math.sin(glintAngle1) * 2.5
          );

          const glintAngle2 = -elapsedTime * (Math.PI * 2 / 8.0) + Math.PI;
          glintLight2.position.set(
            Math.cos(glintAngle2) * 2.3,
            -0.6 + Math.cos(glintAngle2 * 0.5) * 0.3,
            Math.sin(glintAngle2) * 2.3
          );
        } else {
          glintLight1.position.set(2.2, 1.0, 1.6);
          glintLight2.position.set(-1.8, -0.6, -1.4);
        }

        const p = heroScrollProgress;

        // Canvas background interpolates from pure white (#ffffff) to deep slate/black (#020202) by 30% of scroll
        const bgFade = Math.min(1.0, p / 0.30);
        scene.background = new THREE.Color("#ffffff").lerp(new THREE.Color("#020202"), bgFade);

        // Camera zoom across track
        camera.position.z = THREE.MathUtils.lerp(6.2, 3.2, p);

        // Rock podium scale and fade
        const rockScale = 1.0 + p * 0.6;
        rockMesh.scale.set(rockScale, rockScale, rockScale);
        rockMaterial.opacity = Math.max(0, 1.0 - p * 2.0);
        rockMesh.visible = rockMaterial.opacity > 0.001;

        // Backdrop plane smooth fade so mosaic planes behind are naturally refracted
        backdropMat.opacity = Math.max(0, 1.0 - p * 3.0);
        backdropPlane.visible = backdropMat.opacity > 0.001;

        // Mosaic planes: unfold outwards and zoom past camera
        mosaicPlanes.forEach((item) => {
          const [bx, by, bz] = item.baseOffset;
          // Unfold expansion factor
          const unfold = THREE.MathUtils.lerp(0.5, 1.5, p);
          item.mesh.position.x = bx * unfold;
          item.mesh.position.y = by * unfold;
          // Z translation towards camera
          item.mesh.position.z = bz + p * 3.5;

          // Subtle tilting
          item.mesh.rotation.y = bx * 0.08 * (1 - p);
          item.mesh.rotation.x = by * 0.06 * (1 - p);

          // Opacity fade
          item.material.uniforms.uOpacity.value = Math.min(1.0, p * 2.0);
        });

        renderer.render(scene, camera);
      }

      // Render Worldwide Globe Scene
      if (activeScene === "globe") {
        scene.background = new THREE.Color("#020202");
        const isMobile = window.innerWidth < 768;
        const targetZ = isMobile ? 6.6 : 5.0;
        camera.position.set(0, 0, targetZ);

        // Apply drag rotation with inertial decay (damping)
        globePoints.rotation.y += globeVelocity.x;
        globePoints.rotation.x += globeVelocity.y;

        // Damping factor
        globeVelocity.x *= 0.93;
        globeVelocity.y *= 0.93;

        // Subtle idle rotation when not dragging
        if (!isGlobeDragging && Math.abs(globeVelocity.x) < 0.0003) {
          globePoints.rotation.y += 0.0022;
        }

        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
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
      landscapeGeo.dispose();
      portraitGeo.dispose();
      mosaicPlanes.forEach((item) => {
        item.material.dispose();
      });
      textures.forEach((t) => t.dispose());
      globeGeo.dispose();
      globeMaterial.dispose();
      renderer.dispose();
    };
  }, [hasWebGL, isReducedMotion]);

  // Static Gradient Fallback for WebGL unavailable or prefers-reduced-motion (Requirement 6)
  if (!hasWebGL || isReducedMotion) {
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
