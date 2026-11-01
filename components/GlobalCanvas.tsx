"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

    // A. Procedural Rock-Podium (Requirement 2 & 5)
    // Displaced low-poly geometry with custom rock shader
    const rockGeo = new THREE.IcosahedronGeometry(0.95, 2);
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

    const rockShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;
          pos += normal * (sin(pos.y * 3.0 + uTime * 1.5) * 0.02);
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 lightDir = normalize(vec3(0.5, 0.9, 0.7));
          float diff = max(dot(vNormal, lightDir), 0.0);
          float amb = 0.35;
          // Cool slate stone palette matching spec-screenshots
          vec3 stoneDark = vec3(0.18, 0.20, 0.22);
          vec3 stoneLight = vec3(0.54, 0.55, 0.53);
          vec3 baseColor = mix(stoneDark, stoneLight, clamp(vNormal.y * 0.5 + 0.5, 0.0, 1.0));
          vec3 color = baseColor * (diff * 0.75 + amb);
          // Subtle rim lighting
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          color += vec3(0.12, 0.12, 0.12) * pow(rim, 3.5);
          gl_FragColor = vec4(color, uOpacity);
        }
      `,
      transparent: true,
    });

    const rockMesh = new THREE.Mesh(rockGeo, rockShaderMaterial);
    heroGroup.add(rockMesh);

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
        rockShaderMaterial.uniforms.uTime.value = elapsedTime;

        // Rock podium: subtle floating & scaling with scroll
        rockMesh.rotation.y = elapsedTime * 0.12;
        rockMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;

        const p = heroScrollProgress;

        // Canvas background interpolates from pure white (#ffffff) to deep slate/black (#020202) by 30% of scroll
        const bgFade = Math.min(1.0, p / 0.30);
        scene.background = new THREE.Color("#ffffff").lerp(new THREE.Color("#020202"), bgFade);

        // Camera zoom across track
        camera.position.z = THREE.MathUtils.lerp(6.2, 3.2, p);

        // Rock podium scale and fade
        const rockScale = 1.0 + p * 0.6;
        rockMesh.scale.set(rockScale, rockScale, rockScale);
        rockShaderMaterial.uniforms.uOpacity.value = Math.max(0, 1.0 - p * 2.0);

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
      rockShaderMaterial.dispose();
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
