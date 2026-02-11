import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Donation Model
 * Replace `/models/human_donation.glb` with your real GLB
 */
function DonationModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/human_donation.glb');

  // Idle subtle rotation (life-like)
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  // Scroll-based scale enhancement
  useLayoutEffect(() => {
    if (!modelRef.current) return;

    gsap.to(modelRef.current.scale, {
      x: 2.2,
      y: 2.2,
      z: 2.2,
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top center',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return <primitive ref={modelRef} object={scene} scale={1.8} position={[0, -1, 0]} />;
}

/**
 * Scroll-controlled camera (cinematic zoom)
 */
function AnimatedCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useLayoutEffect(() => {
    if (!cameraRef.current) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
      .to(cameraRef.current.position, {
        z: 3.5,
        y: 1,
        ease: 'none',
      })
      .to(cameraRef.current.position, {
        z: 2,
        y: 0.3,
        ease: 'none',
      });
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0.6, 6]} />;
}

/**
 * Fullscreen 3D Hero Canvas
 */
const ThreeHero = () => {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <AnimatedCamera />

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />

      <DonationModel />
      <Environment preset="city" />
    </Canvas>
  );
};

export default ThreeHero;