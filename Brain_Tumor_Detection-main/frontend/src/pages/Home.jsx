import React from 'react';
import { ShieldCheck, Zap, Layers, Cpu, Server, Lock, ArrowRight, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';

const FeatureCard = ({ icon: Icon, title, description, color, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.8 }}
        viewport={{ once: true }}
        className="relative group p-10 rounded-[2.5rem] bg-slate-900/30 border border-white/5 backdrop-blur-2xl transition-all duration-700 hover:border-cyan-500/30 hover:bg-slate-900/50 hover:-translate-y-2"
    >
        <div className={`absolute -top-10 -right-10 w-40 h-40 ${color} opacity-5 rounded-full blur-[80px] group-hover:opacity-10 transition-opacity`}></div>
        <div className="relative z-10 text-center lg:text-left">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-900 text-cyan-400 mb-8 border border-white/5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-500`}>
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
                {description}
            </p>
        </div>
    </motion.div>
);

const Home = () => {
    return (
        <div className="bg-transparent text-white pt-10">
            {/* High-End Cinematic Hero */}
            <Hero />

            {/* Feature Analytics Grid */}
            <div className="py-20 lg:py-40 relative px-4 sm:px-6 lg:px-8">
                {/* Visual Separator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-cyan-400 text-xs font-black tracking-[0.5em] uppercase mb-6 flex items-center justify-center">
                                <span className="w-10 h-[1px] bg-cyan-400 mr-4"></span>
                                Clinical Grade Performance
                                <span className="w-10 h-[1px] bg-cyan-400 ml-4"></span>
                            </h2>
                            <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-10 leading-none lg:-ml-1">
                                THE NEW STANDARD <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 italic">
                                    IN NEURO-AI
                                </span>
                            </h2>
                            <p className="text-slate-400 text-xl lg:text-2xl leading-relaxed font-medium max-w-3xl mx-auto">
                                Deep Learning meets absolute precision. Our ResNet-powered inference engine provides unparalleled diagnostic depth.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard 
                            index={0}
                            icon={Brain}
                            color="bg-cyan-500"
                            title="4-Class Diagnostic"
                            description="Deep classification of Glioma, Meningioma, Pituitary, and healthy tissue states with sub-voxel accuracy."
                        />
                        <FeatureCard 
                            index={1}
                            icon={Cpu}
                            color="bg-blue-500"
                            title="TensorFlow V2.0 Core"
                            description="Leveraging the latest Keras-optimized weight matrices for robust and high-concurrency MRI processing."
                        />
                        <FeatureCard 
                            index={2}
                            icon={Layers}
                            color="bg-purple-500"
                            title="Medical Preprocessing"
                            description="Automated CLAHE medical enhancement stabilizes contrast across different MRI scanner hardware."
                        />
                        <FeatureCard 
                            index={3}
                            icon={Activity}
                            color="bg-emerald-500"
                            title="Real-time Metrics"
                            description="Live telemetry of training history, accuracy convergence, and loss reduction benchmarks."
                        />
                        <FeatureCard 
                            index={4}
                            icon={Lock}
                            color="bg-rose-500"
                            title="Patient Confidentiality"
                            description="End-to-end data encryption ensuring diagnostic integrity and secure clinical workflow management."
                        />
                        <FeatureCard 
                            index={5}
                            icon={Server}
                            color="bg-amber-500"
                            title="Scalable Backend"
                            description="High-performance FastAPI gateway ready for industrial-scale deployment in surgical environments."
                        />
                    </div>
                </div>
            </div>

            {/* Transformative CTA Section */}
            <div className="py-20 lg:py-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[4rem] overflow-hidden bg-[#020617] p-16 lg:p-32 border border-white/5 text-center shadow-3xl shadow-cyan-500/10"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]"></div>
                    
                    <h2 className="text-4xl lg:text-7xl font-black mb-12 relative z-10 tracking-tighter leading-tight italic">
                        REVOLUTIONIZE YOUR <br /> DIAGNOSTIC WORKFLOW
                    </h2>
                    <Link to="/predict">
                        <motion.button 
                            whileHover={{ scale: 1.1, shadow: "0 0 30px #22d3ee" }}
                            whileTap={{ scale: 0.9 }}
                            className="relative z-10 px-12 py-6 bg-white text-slate-950 font-black text-xl rounded-[2.5rem] shadow-2xl transition-all"
                        >
                            DEPLOY NEUROSCAN AI
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            <footer className="py-20 text-center border-t border-white/5">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <Brain className="text-cyan-400" size={32} />
                    <span className="text-2xl font-black tracking-tighter italic">NeuroScan AI</span>
                </div>
                <div className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">
                    © 2026 PRECISION NEURO-RADIOLOGY SYSTEMS • ALL RIGHTS RESERVED
                </div>
            </footer>
        </div>
    );
};

export default Home;
