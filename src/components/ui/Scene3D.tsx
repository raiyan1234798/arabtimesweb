import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const GoldRing = ({ radius = 2.5, tube = 0.08 }: { radius?: number; tube?: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + 0.3;
    ref.current.rotation.y += 0.003;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 64, 128]} />
      <meshStandardMaterial color="#cca800" metalness={1} roughness={0.15} envMapIntensity={2} />
    </mesh>
  );
};

const InnerRing = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.15 + 0.5;
    ref.current.rotation.z += 0.004;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.8, 0.05, 64, 128]} />
      <meshStandardMaterial color="#e5c100" metalness={1} roughness={0.1} envMapIntensity={3} />
    </mesh>
  );
};

const GlassSphere = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.005;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} scale={0.6}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#cca800"
          attenuationDistance={0.5}
          attenuationColor="#ffd700"
        />
      </mesh>
    </Float>
  );
};

const FloatingParticles = ({ count = 80 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y += 0.0005;
    ref.current.rotation.x += 0.0002;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#cca800" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const DiamondShape = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.015;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
  });
  return (
    <mesh ref={ref} position={position} scale={0.15}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.05} envMapIntensity={3} />
    </mesh>
  );
};

const WatchDial = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const hourMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      marks.push({
        position: [Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0] as [number, number, number],
        rotation: [0, 0, angle] as [number, number, number],
      });
    }
    return marks;
  }, []);

  useFrame((state) => {
    groupRef.current.rotation.z = -state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {hourMarks.map((mark, i) => (
        <mesh key={i} position={mark.position} rotation={mark.rotation}>
          <boxGeometry args={[0.12, 0.03, 0.03]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffd700" />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 0, 3]} intensity={1} color="#cca800" distance={10} />
        <spotLight position={[0, 5, 5]} angle={0.4} penumbra={1} intensity={2} color="#ffd700" />

        <GoldRing />
        <InnerRing />
        <WatchDial />
        <GlassSphere />
        <FloatingParticles />

        <DiamondShape position={[-3.5, 2, -2]} />
        <DiamondShape position={[3.8, -1.5, -3]} />
        <DiamondShape position={[2, 3, -4]} />
        <DiamondShape position={[-2.5, -2.5, -2.5]} />

        <fog attach="fog" args={["#050505", 5, 18]} />
      </Canvas>
    </div>
  );
};
