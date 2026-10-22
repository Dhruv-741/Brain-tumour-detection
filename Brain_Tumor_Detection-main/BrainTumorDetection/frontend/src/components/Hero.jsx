import React, { Suspense, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Brain, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrainCanvas } from './Brain/BrainCanvas';
import { InfoPanel } from './Brain/InfoPanel';

const Hero = () => {
    const [activeRegion, setActiveRegion] = useState(null);

    const handleSelectRegion = (regionName) => {
        // Simple mapping for demonstration
        setActiveRegion(regionName);
    };

    return (
        <section className="relative min-h-[120vh] bg-[#020617] overflow-hidden flex items-center pt-20">
            {/* Background Ambient Lighting */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-6"
                        >
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Neuro-AI Research Excellence</span>
                        </motion.div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-loose mb-6">
                            Interact with the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                Digital Brain
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg lg:text-xl max-w-xl mb-10 leading-relaxed font-medium">
                            Explore anatomical regions and clinical insights in real-time. Click on the 3D model to see how different lobes impact tumor diagnosis.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/predict">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center group"
                                >
                                    Analyze MRI Scan
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            
                            <Link to="/metrics">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Benchmark Reports
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Visual Section: INTERACTIVE 3D BRAIN EXPLORER */}
                    <div className="relative h-[600px] lg:h-[800px] w-full mt-10 lg:mt-0">
                        {/* 3D Scene */}
                        <div className="absolute inset-0 z-0">
                            <BrainCanvas onSelectRegion={handleSelectRegion} activeRegion={activeRegion} />
                        </div>

                        {/* Floating Info UI Overlay */}
                        <InfoPanel activeRegion={activeRegion} onClear={() => setActiveRegion(null)} />

                        {/* Instructional Overlay (Fades when active) */}
                        {!activeRegion && (
                            <motion.p 
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-bold uppercase tracking-[0.3em] pointer-events-none"
                            >
                                Drag to Rotate • Click to Explore
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Hero;
