'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { routeNodes } from '@/data/routes';

function latLonToVector3(lat: number, lon: number, radius = 1.52) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function useEarthTexture() {
  const texture = useMemo(() => {
    const width = 1024;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const ocean = context.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, '#031225');
    ocean.addColorStop(0.42, '#06345c');
    ocean.addColorStop(1, '#020817');
    context.fillStyle = ocean;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'rgba(103, 232, 249, 0.12)';
    context.lineWidth = 1;
    for (let x = 0; x <= width; x += 64) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += 64) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const drawContinent = (points: Array<[number, number]>, fill: string) => {
      context.beginPath();
      points.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x * width, y * height);
        else context.lineTo(x * width, y * height);
      });
      context.closePath();
      context.fillStyle = fill;
      context.shadowColor = 'rgba(34, 211, 238, 0.28)';
      context.shadowBlur = 18;
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = 'rgba(125, 211, 252, 0.28)';
      context.lineWidth = 2;
      context.stroke();
    };

    const landFill = 'rgba(20, 83, 117, 0.92)';
    drawContinent([[0.13, 0.22], [0.2, 0.18], [0.28, 0.28], [0.25, 0.42], [0.2, 0.5], [0.15, 0.4]], landFill);
    drawContinent([[0.27, 0.5], [0.32, 0.55], [0.34, 0.7], [0.3, 0.86], [0.25, 0.74], [0.23, 0.6]], landFill);
    drawContinent([[0.45, 0.2], [0.58, 0.15], [0.75, 0.22], [0.83, 0.34], [0.75, 0.46], [0.61, 0.42], [0.5, 0.5], [0.42, 0.38]], landFill);
    drawContinent([[0.52, 0.45], [0.6, 0.46], [0.64, 0.62], [0.6, 0.8], [0.53, 0.72], [0.49, 0.58]], 'rgba(21, 94, 117, 0.9)');
    drawContinent([[0.78, 0.56], [0.86, 0.6], [0.88, 0.72], [0.8, 0.78], [0.74, 0.68]], 'rgba(21, 94, 117, 0.82)');
    drawContinent([[0.02, 0.32], [0.07, 0.3], [0.08, 0.43], [0.03, 0.48]], landFill);

    for (let i = 0; i < 220; i += 1) {
      const x = seededUnit(i + 3000) * width;
      const y = (0.18 + seededUnit(i + 4000) * 0.64) * height;
      const onLandBand = (x > width * 0.12 && x < width * 0.34) || (x > width * 0.42 && x < width * 0.86);
      if (!onLandBand) continue;
      const radius = 0.7 + seededUnit(i + 5000) * 1.7;
      context.beginPath();
      context.fillStyle = seededUnit(i + 6000) > 0.7 ? 'rgba(244, 179, 91, 0.86)' : 'rgba(103, 232, 249, 0.82)';
      context.shadowColor = context.fillStyle;
      context.shadowBlur = 9;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    }

    const atmosphere = context.createRadialGradient(width * 0.5, height * 0.5, height * 0.1, width * 0.5, height * 0.5, width * 0.62);
    atmosphere.addColorStop(0, 'rgba(255,255,255,0.06)');
    atmosphere.addColorStop(0.58, 'rgba(34,211,238,0.05)');
    atmosphere.addColorStop(1, 'rgba(2,8,23,0.28)');
    context.fillStyle = atmosphere;
    context.fillRect(0, 0, width, height);

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
    canvasTexture.anisotropy = 8;
    canvasTexture.needsUpdate = true;
    return canvasTexture;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

function CommandEarth() {
  const earthRef = useRef<THREE.Group>(null);
  const earthTexture = useEarthTexture();
  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={earthRef} rotation={[0.1, -0.35, 0]}>
      <mesh>
        <sphereGeometry args={[1.32, 128, 128]} />
        <meshStandardMaterial map={earthTexture ?? undefined} color={earthTexture ? '#ffffff' : '#08264a'} roughness={0.62} metalness={0.18} emissive="#041a2f" emissiveIntensity={0.18} />
      </mesh>
      <mesh scale={1.006}>
        <sphereGeometry args={[1.32, 96, 96]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={1.018}>
        <sphereGeometry args={[1.32, 96, 96]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.075} />
      </mesh>
      <mesh scale={1.13}>
        <sphereGeometry args={[1.32, 96, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.065} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.004, 8, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.3, 0.2]}>
        <torusGeometry args={[1.8, 0.003, 8, 160]} />
        <meshBasicMaterial color="#f4b35b" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function RoutePulse({ points, delay = 0 }: { points: THREE.Vector3[]; delay?: number }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const progress = useRef(delay);

  useFrame((_, delta) => {
    progress.current = (progress.current + delta * 0.22) % 1;
    const index = Math.min(points.length - 1, Math.floor(progress.current * (points.length - 1)));
    if (dotRef.current) dotRef.current.position.copy(points[index]);
  });

  return (
    <mesh ref={dotRef}>
      <sphereGeometry args={[0.035, 18, 18]} />
      <meshBasicMaterial color="#f4b35b" toneMapped={false} />
    </mesh>
  );
}

function HeroRoutes() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.09;
  });

  const origin = routeNodes[0];
  const routes = useMemo(() => routeNodes.slice(1).map((node, index) => {
    const start = latLonToVector3(origin.lat, origin.lon);
    const end = latLonToVector3(node.lat, node.lon);
    const mid = start.clone().add(end).normalize().multiplyScalar(2.35 + index * 0.05);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return { city: node.city, points: curve.getPoints(80), index };
  }), [origin.lat, origin.lon]);

  return (
    <group ref={groupRef} rotation={[0.1, -0.35, 0]}>
      {routes.map((route) => (
        <group key={route.city}>
          <Line points={route.points} color={route.index % 2 ? '#38bdf8' : '#f4b35b'} lineWidth={1.6} transparent opacity={0.62} />
          <RoutePulse points={route.points} delay={route.index * 0.17} />
          <mesh position={route.points[route.points.length - 1]}>
            <sphereGeometry args={[0.045, 18, 18]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function seededUnit(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function ParticleHalo() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 800;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.6 + seededUnit(i) * 2.2;
      const theta = seededUnit(i + 1000) * Math.PI * 2;
      const phi = Math.acos(2 * seededUnit(i + 2000) - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi);
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018;
      ref.current.rotation.x += delta * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#67e8f9" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export function HeroGlobe() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[-12vw] hidden w-[72vw] md:block lg:right-[-7vw]">
      <Canvas camera={{ position: [0.25, 0.05, 4.75], fov: 42 }} dpr={[1, 1.65]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.75} />
        <pointLight position={[3.5, 2.5, 4]} intensity={3.6} color="#22d3ee" />
        <pointLight position={[-4, -1.5, 2]} intensity={1.4} color="#f4b35b" />
        <Stars radius={90} depth={50} count={1800} factor={4.2} fade speed={0.8} />
        <ParticleHalo />
        <CommandEarth />
        <HeroRoutes />
      </Canvas>
    </div>
  );
}
