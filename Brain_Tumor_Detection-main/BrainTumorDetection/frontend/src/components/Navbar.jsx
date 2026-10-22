import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Activity, BarChart2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6">
            <div className="max-w-7xl mx-auto px-8 py-4 glass rounded-3xl flex justify-between items-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-3 group relative z-10">
                    <div className="relative">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-cyan-400 blur-md opacity-20"
                        />
                        <Brain className="h-8 w-8 text-cyan-400 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div>
                        <span className="font-black text-xl text-white tracking-tighter uppercase italic leading-none block">NeuroScan</span>
                        <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-[0.3em] block mt-1">Research Engine v3.0</span>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-12 items-center relative z-10">
                    {[
                        { name: 'Home', path: '/', icon: Activity },
                        { name: 'Diagnosis', path: '/predict', icon: Cpu },
                        { name: 'Benchmarks', path: '/metrics', icon: BarChart2 }
                    ].map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`group relative py-2 text-xs font-black uppercase tracking-widest transition-all ${active ? 'text-white' : 'text-slate-500 hover:text-cyan-400'}`}
                            >
                                <span className="flex items-center space-x-2">
                                    <item.icon size={14} className={active ? "text-cyan-400" : ""} />
                                    <span>{item.name}</span>
                                </span>
                                
                                {active && (
                                    <motion.div 
                                        layoutId="nav-pill"
                                        className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_2px_10px_#22d3ee]"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right CTA / Status */}
                <div className="hidden md:flex items-center space-x-4 relative z-10">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
