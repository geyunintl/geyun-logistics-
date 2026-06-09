'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { routeNodes } from '@/data/routes';

function latLonToVector3(lat: number, lon: number, radius = 1.38) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
  );
}

/* ─── Globe surface ──────────────────────────────────────────────────────── */
function DotMatrixEarth() {
  const ref  = useRef<THREE.Group>(null);
  const dots = useMemo(() => {
    const items: THREE.Vector3[] = [];
    for (let lat = -66; lat <= 66; lat += 7) {
      for (let lon = -180; lon < 180; lon += 7) {
        if ((lat + lon) % 3 === 0) items.push(latLonToVector3(lat, lon, 1.265));
      }
    }
    return items;
  }, []);

  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.10; });

  return (
    <group ref={ref} rotation={[0.1, -0.45, 0]}>
      {/* Core dark sphere */}
      <mesh>
        <sphereGeometry args={[1.22, 96, 96]} />
        <meshStandardMaterial color="#061b35" roughness={0.68} metalness={0.30} transparent opacity={0.95} />
      </mesh>
      {/* Lat/lon wireframe — brighter */}
      <mesh scale={1.010}>
        <sphereGeometry args={[1.22, 72, 72]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Surface dots — denser */}
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.009, 6, 6]} />
          <meshBasicMaterial color={i % 7 === 0 ? '#f4b35b' : '#67e8f9'} toneMapped={false} />
        </mesh>
      ))}
      {/* Outer atmosphere halo */}
      <mesh scale={1.16}>
        <sphereGeometry args={[1.22, 64, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.10} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ─── Cargo dot — visible sphere moving along arc ────────────────────────── */
function CargoDot({
  points, delay = 0, active, isCyan,
}: {
  points: THREE.Vector3[];
  delay?: number;
  active: boolean;
  isCyan: boolean;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const prog    = useRef(delay);

  useFrame((_, d) => {
    prog.current = (prog.current + d * (active ? 0.26 : 0.13)) % 1;
    const i = Math.min(points.length - 1, Math.floor(prog.current * (points.length - 1)));
    coreRef.current?.position.copy(points[i]);
    haloRef.current?.position.copy(points[i]);
  });

  const coreColor = active ? '#ffffff' : (isCyan ? '#7dd3fc' : '#fde68a');
  const haloColor = isCyan ? '#22d3ee' : '#f4b35b';
  const sz        = active ? 0.065 : 0.044;

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[sz, 16, 16]} />
        <meshBasicMaterial color={coreColor} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[sz * 2.4, 10, 10]} />
        <meshBasicMaterial color={haloColor} transparent opacity={active ? 0.42 : 0.26} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </>
  );
}

/* ─── YIWU HUB origin node ───────────────────────────────────────────────── */
function OriginNode({ position }: { position: THREE.Vector3 }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const t  = useRef(0);

  useFrame((_, d) => {
    t.current += d;
    if (r1.current) {
      const p1 = (t.current * 1.2) % 1;
      r1.current.scale.setScalar(1 + p1 * 2.2);
      (r1.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - p1);
    }
    if (r2.current) {
      const p2 = ((t.current * 1.2) + 0.45) % 1;
      r2.current.scale.setScalar(1 + p2 * 2.2);
      (r2.current.material as THREE.MeshBasicMaterial).opacity = 0.38 * (1 - p2);
    }
  });

  return (
    <group position={position}>
      {/* Core bright gold */}
      <mesh>
        <sphereGeometry args={[0.14, 22, 22]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshBasicMaterial color="#f4b35b" transparent opacity={0.45} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* Pulse ring 1 */}
      <mesh ref={r1}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.50} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* Pulse ring 2 */}
      <mesh ref={r2}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#f4b35b" transparent opacity={0.35} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─── Routes ─────────────────────────────────────────────────────────────── */
function Routes({ activeIndex }: { activeIndex?: number | null }) {
  const group     = useRef<THREE.Group>(null);
  const origin    = routeNodes[0];

  const lines = useMemo(() => routeNodes.slice(1).map((node, index) => {
    const start = latLonToVector3(origin.lat, origin.lon);
    const end   = latLonToVector3(node.lat, node.lon);
    const mid   = start.clone().add(end).normalize().multiplyScalar(1.95 + index * 0.05);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return { node, points: curve.getPoints(120), index };
  }), [origin.lat, origin.lon]);

  const originPos = useMemo(
    () => latLonToVector3(origin.lat, origin.lon),
    [origin.lat, origin.lon],
  );

  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.08; });

  const hasActive = activeIndex !== null && activeIndex !== undefined;

  return (
    <group ref={group} rotation={[0.1, -0.45, 0]}>
      <OriginNode position={originPos} />

      {lines.map(({ node, points, index }) => {
        const isActive  = hasActive && index === activeIndex;
        const isDimmed  = hasActive && !isActive;
        const isCyan    = index % 2 === 1;
        const base      = isCyan ? '#38bdf8' : '#f4b35b';
        const hi        = isCyan ? '#93c5fd' : '#fde68a';

        return (
          <group key={node.city}>
            {/* Route arc */}
            <Line
              points={points}
              color={isActive ? hi : base}
              lineWidth={isActive ? 5.5 : 3.2}
              transparent
              opacity={isDimmed ? 0.22 : isActive ? 1.0 : 0.88}
            />

            {/* Cargo dot */}
            <CargoDot points={points} delay={index * 0.18} active={isActive} isCyan={isCyan} />

            {/* Destination sphere */}
            <mesh position={points[points.length - 1]}>
              <sphereGeometry args={[isActive ? 0.09 : 0.06, 20, 20]} />
              <meshBasicMaterial color={isActive ? hi : '#22d3ee'} toneMapped={false} />
            </mesh>
            {/* Destination halo */}
            <mesh position={points[points.length - 1]}>
              <sphereGeometry args={[isActive ? 0.20 : 0.12, 14, 14]} />
              <meshBasicMaterial
                color={isCyan ? '#22d3ee' : '#f4b35b'}
                transparent opacity={isActive ? 0.30 : 0.14}
                blending={THREE.AdditiveBlending} toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export function GlobeScene({ activeIndex }: { activeIndex?: number | null }) {
  return (
    <div className="h-[620px] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3.85], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 3, 4]}  intensity={3.4} color="#22d3ee" />
        <pointLight position={[-3, -2, 2]} intensity={1.8} color="#f4b35b" />
        <Stars radius={90} depth={45} count={2400} factor={4} fade speed={0.5} />
        <DotMatrixEarth />
        <Routes activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}
