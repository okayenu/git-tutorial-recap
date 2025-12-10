import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Character from './Character';
import { useCharacterStore } from '../store/useCharacterStore';

const Scene: React.FC = () => {
  return (
    <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }}>
      <color attach="background" args={['#1e2024']} />
      
      {/* Lighting Rig */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[2, 2, 2]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={1024} 
      />
      <spotLight 
        position={[-2, 2, -2]} 
        intensity={0.8} 
        color="#b0c4de" 
      />
      <pointLight 
        position={[0, 3, 2]} 
        intensity={1} 
        distance={5} 
      />

      <Suspense fallback={null}>
        <Character />
        <Environment preset="city" />
        <ContactShadows position={[0, -0.05, 0]} opacity={0.4} scale={5} blur={2} far={4} />
      </Suspense>

      <OrbitControls 
        target={[0, 1, 0]} 
        minDistance={0.5} 
        maxDistance={5} 
        maxPolarAngle={Math.PI / 2 + 0.1}
      />
    </Canvas>
  );
};

export default Scene;
