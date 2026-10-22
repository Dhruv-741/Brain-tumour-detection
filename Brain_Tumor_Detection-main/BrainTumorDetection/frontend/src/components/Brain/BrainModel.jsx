import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BRAIN_URL = 'https://assets.codepen.io/3194077/cloud-viz-brain-Aug-15-2020-V1-Optimized.glb';

export const BrainModel = ({ onSelectRegion, activeRegion }) => {
    const { nodes, materials } = useGLTF(BRAIN_URL);
    const group = useRef();
    const [hovered, setHovered] = useState(null);

    // Neural Pulse Animation
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = t * 0.1; // Slow idle rotation
        
        // Pulse effect on materials
        Object.values(materials).forEach((material) => {
            if (material.emissive) {
                material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.2;
            }
        });
    });

    // Helper to handle clicks
    const handlePointerDown = (e) => {
        e.stopPropagation();
        const partName = e.object.name;
        onSelectRegion(partName);
    };

    return (
        <group ref={group} dispose={null} scale={0.012} position={[0, -0.5, 0]}>
            {Object.keys(nodes).map((key) => {
                const node = nodes[key];
                if (node.type === 'Mesh') {
                    const isSelected = activeRegion === node.name;
                    const isHovered = hovered === node.name;

                    return (
                        <mesh
                            key={node.uuid}
                            geometry={node.geometry}
                            name={node.name}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHovered(node.name);
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={() => {
                                setHovered(null);
                                document.body.style.cursor = 'default';
                            }}
                            onPointerDown={handlePointerDown}
                        >
                            <meshStandardMaterial
                                color={isSelected ? '#22d3ee' : isHovered ? '#0891b2' : '#1e293b'}
                                emissive={isSelected ? '#22d3ee' : '#0891b2'}
                                emissiveIntensity={isSelected ? 1.5 : isHovered ? 0.8 : 0.2}
                                roughness={0.1}
                                metalness={0.9}
                                transparent
                                opacity={0.9}
                            />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
};

// Pre-load the model
useGLTF.preload(BRAIN_URL);
