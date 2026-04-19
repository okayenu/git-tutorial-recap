import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useCharacterStore } from '../store/useCharacterStore';
import * as THREE from 'three';

const Character: React.FC = () => {
  const { gender, wireframe, morphs, bones } = useCharacterStore();
  const group = useRef<THREE.Group>(null);
  
  // Load models from public folder
  const femaleGltf = useGLTF('/characters/female_model.glb');
  const maleGltf = useGLTF('/characters/man_model.glb');
  
  const gltf = gender === 'female' ? femaleGltf : maleGltf;

  useEffect(() => {
    if (!gltf.scene) return;

    // Traverse the model to apply wireframe and morphs/bones
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Material handling
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ('wireframe' in mat) mat.wireframe = wireframe;
            });
          } else {
            if ('wireframe' in mesh.material) mesh.material.wireframe = wireframe;
          }
        }

        // Morph Targets handling
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          Object.entries(morphs).forEach(([name, value]) => {
            const index = mesh.morphTargetDictionary![name];
            if (index !== undefined) {
              mesh.morphTargetInfluences![index] = value;
            }
          });
        }
      }

      // Bone scaling handling
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        if (bones[bone.name] !== undefined) {
          const scale = bones[bone.name];
          // Determine scaling axes based on bone type (simplification)
          bone.scale.set(scale, scale, scale);
        } else {
          // Reset if not in store
          bone.scale.set(1, 1, 1);
        }
      }
    });
  }, [gltf.scene, wireframe, morphs, bones]);

  return <primitive ref={group} object={gltf.scene} />;
};

export default Character;
