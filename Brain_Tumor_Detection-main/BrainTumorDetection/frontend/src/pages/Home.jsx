import React from 'react';
import { ShieldCheck, Zap, Layers, Cpu, Server, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="relative group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:bg-slate-900 overflow-hidden">
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
        <div className="relative z-10">
            <div className={`inline-flex items-center justify-center h-14 w-14 rounded-xl bg-slate-800 text-cyan-400 mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    </div>
);

const Home = () => {
    return (
        <div className="bg-[#020617] text-white">
            <Hero />

            {/* Feature Section */}
            <div className="py-32 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Precision Engineering</h2>
                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Cutting-Edge Features for
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"> Modern Oncology</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Our proprietary deep learning engine offers a multi-layered diagnostic stack, ensuring patient data integrity and diagnostic precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Cpu}
                            color="bg-cyan-500"
                            title="ResNet50 Backbone"
                            description="Trained on 4+ categories including Glioma, Meningioma, and Pituitary tumors with a focus on edge classification accuracy."
                        />
                        <FeatureCard 
                            icon={Layers}
                            color="bg-blue-500"
                            title="Multi-Layer Ingest"
                            description="Our AI engine handles MRI scans through a multi-stage preprocessing pipeline including CLAHE and high-res normalization."
                        />
                        <FeatureCard 
                            icon={Zap}
                            color="bg-purple-500"
                            title="Real-Time Inference"
                            description="Optimized model quantization ensures minimal latency, providing diagnostic results in milliseconds on consumer-grade hardware."
                        />
                        <FeatureCard 
                            icon={Lock}
                            color="bg-emerald-500"
                            title="HIPAA Compliant"
                            description="Diagnostic processing follows end-to-end encryption protocols, prioritizing data privacy and patient confidentiality at every step."
                        />
                        <FeatureCard 
                            icon={ShieldCheck}
                            color="bg-amber-500"
                            title="Expert-Validated"
                            description="Developed in collaboration with neurological professionals to ensure the model focuses on clinically relevant ROI (Regions of Interest)."
                        />
                        <FeatureCard 
                            icon={Server}
                            color="bg-rose-500"
                            title="Cloud-Native Architecture"
                            description="Scalable backend built on FastAPI and Redis, ready for high-concurrency clinical hospital environments."
                        />
                    </div>
                </div>
            </div>

            {/* Call to Action Banner */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 p-12 lg:p-20 border border-indigo-500/20 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
                    
                    <h2 className="text-3xl lg:text-5xl font-bold mb-8 relative z-10 tracking-tight leading-tight">
                        Ready to revolutionize <br /> your diagnostic workflow?
                    </h2>
                    <Link to="/predict">
                        <button className="relative z-10 px-10 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-cyan-50 transition-all hover:scale-105 shadow-2xl">
                            Deploy Analysis Engine
                        </button>
                    </Link>
                </div>
            </div>

            <footer className="py-12 text-center text-slate-600 text-sm tracking-widest uppercase font-bold border-t border-slate-900/50">
                © 2026 NeuroScan AI • Clinical Research Excellence
            </footer>
        </div>
    );
};

export default Home;

