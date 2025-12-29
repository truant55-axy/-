import React, { useEffect, useMemo, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import { Layer } from '../types';

interface STLModelProps {
  layer: Layer;
  onVolumeCalculated: (id: string, volume: number) => void;
}

const STLModel: React.FC<STLModelProps> = ({ layer, onVolumeCalculated }) => {
  // If no URL is provided, we return null. In a real app, we might show a placeholder.
  // For this demo, we handle the case where the user hasn't uploaded anything by not rendering this component or rendering a fallback box in parent.
  
  const geom = useLoader(STLLoader, layer.url || ''); // Note: Empty string will fail, handled in parent
  
  const [material, setMaterial] = useState<THREE.MeshPhysicalMaterial>();

  const volume = useMemo(() => {
    if (!geom) return 0;
    
    // Calculate volume
    // Signed volume of a triangle mesh
    let vol = 0;
    const position = geom.attributes.position;
    if (position) {
        const p1 = new THREE.Vector3();
        const p2 = new THREE.Vector3();
        const p3 = new THREE.Vector3();
        for (let i = 0; i < position.count; i += 3) {
            p1.fromBufferAttribute(position, i);
            p2.fromBufferAttribute(position, i + 1);
            p3.fromBufferAttribute(position, i + 2);
            vol += p1.dot(p2.cross(p3)) / 6.0;
        }
    }
    return Math.abs(vol) / 1000; // Convert to roughly ml/cm3 depending on unit scale (assuming mm input)
  }, [geom]);

  useEffect(() => {
    onVolumeCalculated(layer.id, volume);
  }, [volume, layer.id]);

  useEffect(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: layer.color,
      metalness: 0.1,
      roughness: 0.5,
      transparent: true,
      opacity: layer.opacity,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });
    setMaterial(mat);
  }, [layer.color, layer.opacity]);

  if (!geom) return null;

  return (
    // @ts-ignore
    <mesh geometry={geom} material={material} visible={layer.visible} castShadow receiveShadow>
       {/* Center geometry logic is often handled by <Center> or <Stage> in parent */}
    {/* @ts-ignore */}
    </mesh>
  );
};

export default STLModel;