/* eslint-disable react/no-unknown-property */
"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { siteConfig } from "@/config/site";
import "./Lanyard.css";

const CARD_GLB = "/assets/lanyard/card.glb";
const LANYARD_BAND = "/assets/lanyard/lanyard.png";

const SOCIAL_HANDLES: Record<string, string> = {
  max: "max.ru",
  telegram: "t.me",
  instagram: "@pcbarbershop",
};

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

type CardGLTF = {
  nodes: {
    card: { geometry: THREE.BufferGeometry };
    clip: { geometry: THREE.BufferGeometry };
    clamp: { geometry: THREE.BufferGeometry };
  };
  materials: {
    base: { map: THREE.Texture };
    metal: THREE.Material;
  };
};

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function CardSocialFace({ groupRef }: { groupRef: RefObject<THREE.Group | null> }) {
  const [frontVisible, setFrontVisible] = useState(true);
  const faceNormal = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;

    group.getWorldPosition(worldPos);
    worldNormal.copy(faceNormal).applyQuaternion(group.quaternion).normalize();
    toCamera.copy(camera.position).sub(worldPos).normalize();

    const isFrontFacing = worldNormal.dot(toCamera) > 0.25;
    setFrontVisible((prev) => (prev === isFrontFacing ? prev : isFrontFacing));
  });

  if (!frontVisible) return null;

  return (
    <Html
      transform
      occlude={false}
      wrapperClass="lanyard-html"
      distanceFactor={1.66}
      position={[0, 0.02, 0.078]}
      center
      style={{ pointerEvents: "none" }}
    >
      <div className="lanyard-card-face">
        <p className="lanyard-card-face__title">PC БАРБЕРШОП</p>
        <p className="lanyard-card-face__sub">МЫ В СОЦСЕТЯХ</p>
        <div className="lanyard-card-face__links">
          {siteConfig.social.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lanyard-card-face__link"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className={`lanyard-card-face__icon lanyard-card-face__icon--${item.id}`}>
                {item.id === "max" ? "M" : item.id === "telegram" ? "TG" : "IG"}
              </span>
              <span>
                <span className="lanyard-card-face__label">{item.label}</span>
                <span className="lanyard-card-face__handle">
                  {SOCIAL_HANDLES[item.id] ?? item.url}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </Html>
  );
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true, powerPreference: "high-performance" }}
        frameloop="always"
        style={{ touchAction: "none" }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 8]} intensity={1.35} />
        <directionalLight position={[-6, 2, 4]} intensity={0.55} color="#e8e8e8" />
        <pointLight position={[0, 2, 6]} intensity={0.9} color="#ffffff" />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
}: BandProps) {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const cardVisualRef = useRef<THREE.Group>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const attachLocal = new THREE.Vector3(0, 1.45, 0);
  const attachWorld = new THREE.Vector3();
  const cardEuler = new THREE.Euler();

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }
    return body.lerped;
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as CardGLTF;
  const texture = useTexture(lanyardImage || LANYARD_BAND);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as CanvasImageSource & { width: number; height: number };
    const W = baseImg.width;
    const H = baseImg.height;
    if (!W || !H) return baseMap;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    if (!frontImage) {
      const rx = FRONT_UV_RECT.x * W;
      const ry = FRONT_UV_RECT.y * H;
      const rw = FRONT_UV_RECT.w * W;
      const rh = FRONT_UV_RECT.h * H;
      ctx.clearRect(rx, ry, rw, rh);
    }

    const drawFitted = (
      img: CanvasImageSource & { width: number; height: number },
      rect: typeof FRONT_UV_RECT,
    ) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) {
      drawFitted(frontTex.image as CanvasImageSource & { width: number; height: number }, FRONT_UV_RECT);
    }
    if (backImage && backTex.image) {
      const backFit = frontImage ? imageFit : "contain";
      const pick = backFit === "contain" ? Math.min : Math.max;
      const img = backTex.image as CanvasImageSource & { width: number; height: number };
      const rect = BACK_UV_RECT;
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(rx, ry, rw, rh);
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    if (!frontImage) {
      composite.format = THREE.RGBAFormat;
    }
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    const releaseDrag = () => drag(false);
    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointercancel", releaseDrag);
    return () => {
      window.removeEventListener("pointerup", releaseDrag);
      window.removeEventListener("pointercancel", releaseDrag);
    };
  }, []);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && band.current && card.current && j1.current && j2.current && j3.current) {
      [j1, j2].forEach((ref) => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      cardEuler.set(cardRot.x, cardRot.y, cardRot.z);
      attachWorld.copy(attachLocal).applyEuler(cardEuler);
      attachWorld.x += cardPos.x;
      attachWorld.y += cardPos.y;
      attachWorld.z += cardPos.z;
      curve.points[0].copy(attachWorld);
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      const geometry = band.current.geometry as InstanceType<typeof MeshLineGeometry>;
      geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    if (!card.current) return;
    card.current.wakeUp();
    drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    drag(false);
  };

  return (
    <>
      <group position={[-0.8, 5.4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardVisualRef}
            scale={2.45}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                transparent={!frontImage}
                alphaTest={frontImage ? 0 : 0.45}
                depthWrite
                clearcoat={0}
                clearcoatRoughness={0.15}
                roughness={0.92}
                metalness={0.15}
                side={THREE.FrontSide}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            <CardSocialFace groupRef={cardVisualRef} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} raycast={() => null}>
        <meshLineGeometry />
        <meshLineMaterial
          {...({
            color: "white",
            depthTest: false,
            resolution: isMobile ? [1000, 2000] : [1000, 1000],
            useMap: true,
            map: texture,
            repeat: [-4, 1],
            lineWidth: lanyardWidth,
          } as Record<string, unknown>)}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
