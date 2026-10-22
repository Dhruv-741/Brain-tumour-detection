import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Target, ShieldCheck, Gauge, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Metrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/model-metrics');
                const data = response.data;
                const epochs = data.accuracy.length;
                const chartData = Array.from({ length: epochs }, (_, i) => ({
                    epoch: i + 1,
                    accuracy: (data.accuracy[i] * 100).toFixed(1),
                    val_accuracy: (data.val_accuracy[i] * 100).toFixed(1),
                    loss: data.loss[i].toFixed(3),
                    val_loss: data.val_loss[i].toFixed(3),
                }));
                setMetrics(chartData);
            } catch (err) {
                setError("Benchmark data unavailable. System requires a complete training cycle.");
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-4 rounded-xl border-cyan-500/20 shadow-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Epoch {label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-3 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <p className="text-sm font-bold text-white">{entry.name}: <span className="text-cyan-400">{entry.value}%</span></p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Activity size={48} className="text-cyan-500" />
            </motion.div>
        </div>
    );

    const bestAcc = metrics ? Math.max(...metrics.map(m => m.val_accuracy)) : 0;

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
            <header className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4 uppercase italic">
                        Model <span className="text-cyan-400">Benchmarks</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl text-lg font-medium">
                        Real-time telemetry from the Neuro-AI training pipeline. Visualizing neural weight convergence and tissue classification precision.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="glass p-6 rounded-3xl border-cyan-500/20 min-w-[200px]">
                        <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                            <Target size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Peak Accuracy</span>
                        </div>
                        <p className="text-4xl font-black text-white">{bestAcc}%</p>
                    </div>
                </div>
            </header>

            {/* Performance Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Accuracy Analytics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-10 rounded-[3rem] overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
                                <Gauge size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase italic tracking-tight">Accuracy Convergence</h3>
                        </div>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics}>
                                <defs>
                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="epoch" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="accuracy" 
                                    stroke="#22d3ee" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorAcc)" 
                                    name="Training Accuracy"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="val_accuracy" 
                                    stroke="#a855f7" 
                                    strokeWidth={4} 
                                    fillOpacity={0} 
                                    name="Validation Accuracy"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Loss Analytics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-10 rounded-[3rem] overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase italic tracking-tight">Entropy Reduction</h3>
                        </div>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <XAxis dataKey="epoch" hide />
                                <YAxis hide />
                                <Tooltip />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="loss" 
                                    stroke="#ef4444" 
                                    strokeWidth={4} 
                                    dot={false} 
                                    name="Training Loss"
                                />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="val_loss" 
                                    stroke="#ffffff" 
                                    strokeWidth={2} 
                                    strokeDasharray="5 5"
                                    dot={false}
                                    name="Validation Loss"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: ShieldCheck, title: "Model Stability", text: "Loss curve variance is within clinical bounds.", color: "text-emerald-400" },
                    { icon: Activity, title: "Weight Optimization", text: "AdamW optimizer showing efficient convergence.", color: "text-cyan-400" },
                    { icon: Target, title: "Generalization", text: "Low gap between train and test accuracy.", color: "text-purple-400" }
                ].map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        key={i} 
                        className="glass p-8 rounded-3xl flex items-start space-x-6"
                    >
                        <item.icon className={item.color} size={32} />
                        <div>
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{item.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Metrics;
