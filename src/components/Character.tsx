import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useCharacterStore } from '../store/useCharacterStore';
import * as THREE from 'three';

const Character: React.FC = () => {
  const { gender, wireframe, morphs, bones, skinTone, roughness, hairColor, lipstickColor, lipstickOpacity, tattooOpacity } = useCharacterStore();
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
        if (mesh.material) {
          const updateMaterial = (mat: any) => {
            if ('wireframe' in mat) mat.wireframe = wireframe;
            if ('color' in mat && mat.name) {
              const name = mat.name.toLowerCase();
              if (name.includes('hair')) {
                mat.color.set(hairColor);
              } else if (name.includes('skin') || name.includes('body') || name.includes('face') || name.includes('head')) {
                mat.color.set(skinTone);
                if ('roughness' in mat) mat.roughness = roughness;
                
                // Pseudo-implementation of makeup/lipstick via blending color on material (if supported)
                // Realistically, decals/tattoos require secondary UVs, multi-material layering or custom shaders.
                // We mock visual update here if it's the lips
              } else if (name.includes('lip') || name.includes('mouth')) {
                // If the model has a separate lips material
                const lipBase = new THREE.Color(skinTone);
                const lipTint = new THREE.Color(lipstickColor);
                mat.color.copy(lipBase.lerp(lipTint, lipstickOpacity));
              }
            } else if ('color' in mat && !mat.name) {
              // Fallback for unnamed materials
              mat.color.set(skinTone);
            }
          };

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(updateMaterial);
          } else {
            updateMaterial(mesh.material);
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
  }, [gltf.scene, wireframe, morphs, bones, skinTone, roughness, hairColor, lipstickColor, lipstickOpacity, tattooOpacity]);

  return <primitive ref={group} object={gltf.scene} />;
};

export default Character;
