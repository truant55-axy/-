import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Float } from '@react-three/drei';
import STLModel from './STLModel';
import { Layer } from '../types';
import * as THREE from 'three';

interface SceneProps {
  layers: Layer[];
  brightness: number;
  onVolumeCalculated: (id: string, vol: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const BackgroundAdjuster = ({ brightness }: { brightness: number }) => {
    const { scene } = useThree();
    // 0 = Black (#000000), 1 = White (#ffffff)
    const c1 = new THREE.Color('#000000'); 
    const c2 = new THREE.Color('#ffffff');
    const finalColor = c1.clone().lerp(c2, brightness);
    scene.background = finalColor;
    return null;
}

interface PlaceholderModelProps {
  layer: Layer;
  onVolumeCalculated: (id: string, v: number) => void;
}

// A generic mesh to show when no STL is loaded (Demo Mode)
const PlaceholderModel: React.FC<PlaceholderModelProps> = ({ layer, onVolumeCalculated }) => {
    // Simulate volume calculation for demo items once
    useEffect(() => {
        if (layer.volume === 0) {
             onVolumeCalculated(layer.id, Math.random() * 50 + 20);
        }
    }, []);

    // Distinct shapes based on ID or Name to make them look different
    // @ts-ignore
    let geometry = <boxGeometry args={[30, 30, 30]} />;
    let position: [number, number, number] = [0, 0, 0];

    if (layer.name.includes("上颌")) {
        // @ts-ignore
        geometry = <torusKnotGeometry args={[15, 4, 100, 16]} />;
        position = [0, 20, 0];
    } else if (layer.name.includes("下颌")) {
         // @ts-ignore
         geometry = <cylinderGeometry args={[15, 15, 40, 32]} />;
         position = [0, -20, 0];
    } else {
         // @ts-ignore
         geometry = <icosahedronGeometry args={[20, 1]} />;
    }

    return (
        // @ts-ignore
        <group position={position} visible={layer.visible}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* @ts-ignore */}
                <mesh castShadow receiveShadow>
                    {geometry}
                    {/* @ts-ignore */}
                    <meshStandardMaterial 
                        color={layer.color} 
                        transparent 
                        opacity={layer.opacity} 
                        roughness={0.3}
                        metalness={0.2}
                    />
                {/* @ts-ignore */}
                </mesh>
            </Float>
        {/* @ts-ignore */}
        </group>
    );
}

const Scene: React.FC<SceneProps> = ({ layers, brightness, onVolumeCalculated, canvasRef }) => {
  return (
    <Canvas
      ref={canvasRef as any}
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 50, 150], fov: 45 }}
    >
      <BackgroundAdjuster brightness={brightness} />
      
      {/* @ts-ignore */}
      <ambientLight intensity={0.5} />
      {/* @ts-ignore */}
      <directionalLight position={[50, 50, 25]} intensity={1} castShadow shadow-bias={-0.0001} />
      {/* @ts-ignore */}
      <pointLight position={[-50, -50, -50]} intensity={0.5} color="blue" />
      
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.5} adjustCamera={false}>
          <Center top>
            {layers.map((layer) => {
               if (layer.url) {
                   return (
                        <STLModel 
                            key={layer.id} 
                            layer={layer} 
                            onVolumeCalculated={onVolumeCalculated}
                        />
                   );
               } else {
                   return (
                       <PlaceholderModel 
                            key={layer.id} 
                            layer={layer} 
                            onVolumeCalculated={onVolumeCalculated} 
                       />
                   );
               }
            })}
          </Center>
        </Stage>
      </Suspense>
      
      {/* Removed Grid (base) as requested */}
      
      {/* Removed minPolarAngle/maxPolarAngle to allow unrestricted rotation */}
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Scene;