import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';

function HoneyJar(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        mesh.current.rotation.y += delta * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={mesh} {...props}>
                {/* Simple Jar Shape (Cylinder) as placeholder for imported GLTF */}
                <cylinderGeometry args={[1, 1, 3, 32]} />
                <meshPhysicalMaterial
                    color="#FFB300"
                    transmission={0.9}
                    thickness={1}
                    roughness={0}
                    ior={1.5}
                    clearcoat={1}
                />
            </mesh>
            {/* Lid */}
            <mesh position={[0, 1.6, 0]}>
                <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
                <meshStandardMaterial color="#3E2723" roughness={0.3} metallic={0.5} />
            </mesh>
        </Float>
    );
}

const Hero3D = () => {
    return (
        <div className="h-[60vh] w-full bg-[#1A1A1A] relative overflow-hidden">
            {/* Cinematic Overlay Text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter opacity-90 mix-blend-overlay">
                    YEMENI
                </h1>
                <p className="text-gold text-lg md:text-xl tracking-[0.3em] uppercase mt-4 font-light">
                    Liquid Gold from Sidr Valleys
                </p>
            </div>

            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#FFD700" />

                <HoneyJar position={[0, 0, 0]} />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Hero3D;
