import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import { BrainModel } from './BrainModel';

// Visual Loading Progress Indicator
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center">
                <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
                    Fetching Anatomy {Math.round(progress)}%
                </p>
            </div>
        </Html>
    );
}

export const BrainCanvas = ({ onSelectRegion, activeRegion }) => {
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} color="#9333ea" intensity={1} />
            
            <Suspense fallback={<Loader />}>
                <BrainModel onSelectRegion={onSelectRegion} activeRegion={activeRegion} />
                <Environment preset="night" />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
            </Suspense>

            <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={20} autoRotate={!activeRegion} autoRotateSpeed={0.5} />
        </Canvas>
    );
};
