import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, Activity, Brain, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { BrainCanvas } from '../components/Brain/BrainCanvas';

const Predict = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            setError('System Error: Unable to communicate with Neuro-AI engine. Ensure backend is active.');
        } finally {
            setLoading(false);
        }
    };

    const resultColors = {
        'Glioma': 'from-red-500 to-orange-600',
        'Meningioma': 'from-orange-400 to-yellow-500',
        'Pituitary': 'from-purple-500 to-indigo-600',
        'No Tumor': 'from-emerald-400 to-cyan-500'
    };

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
            {/* Page Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
                    Diagnostic <span className="text-cyan-400">Analysis Center</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Real-time neurological diagnostics using our high-resolution ResNet backbone. Upload a clinical MRI scan for sub-second classification.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Upload & Control */}
                <div className="lg:col-span-5 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-1 rounded-3xl group overflow-hidden"
                    >
                        <div className="relative p-8 border-2 border-dashed border-slate-700/50 rounded-2xl transition-all group-hover:bg-cyan-500/5 group-hover:border-cyan-500/30">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                accept="image/*"
                            />
                            {!preview ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex h-20 w-20 rounded-2xl bg-slate-800 text-cyan-400 items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                        <Upload className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Deploy Clinical MRI</h3>
                                    <p className="text-slate-500 text-sm">Drag and drop or click to fetch from storage</p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                    <img src={preview} alt="MRI Scan Preview" className="w-full h-auto" />
                                    <button 
                                        onClick={() => { setFile(null); setPreview(null); }}
                                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all z-20"
                                    >
                                        <X size={20} />
                                    </button>
                                    
                                    {loading && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                            <div className="relative w-full h-full">
                                                <motion.div 
                                                    animate={{ top: ['0%', '100%', '0%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute h-1 w-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!file || loading}
                        onClick={handleUpload}
                        className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${
                            !file || loading 
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                            : 'bg-cyan-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:bg-cyan-400'
                        }`}
                    >
                        {loading ? 'SYNCHRONIZING ENGINE...' : 'EXECUTE DIAGNOSIS'}
                    </motion.button>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center space-x-3 text-sm font-bold"
                        >
                            <ShieldAlert />
                            <p>{error}</p>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Interaction & Results */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[600px] glass-card rounded-[3rem] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 z-0">
                                    <BrainCanvas onSelectRegion={() => {}} activeRegion={null} />
                                </div>
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                                    <h3 className="text-xl font-black text-slate-500 uppercase tracking-[0.5em] mb-2">NEURO-ENGINE ACTIVE</h3>
                                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Awaiting Clinical Data Stream</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full space-y-8"
                            >
                                {/* Result Hero Card */}
                                <div className={`glass-card p-10 rounded-[3rem] border-l-8 bg-gradient-to-br from-slate-900 via-slate-900 to-black overflow-hidden relative border-cyan-400`}>
                                    <div className={`absolute top-0 right-0 w-64 h-64 opacity-20 rounded-full blur-[100px] bg-cyan-400`}></div>
                                    
                                    <div className="relative z-10">
                                        <p className="text-cyan-400 text-xs font-black tracking-widest uppercase mb-6 flex items-center">
                                            <CheckCircle size={16} className="mr-2" /> Analysis Protocol Complete
                                        </p>
                                        <h2 className="text-7xl font-black text-white tracking-tighter mb-8 uppercase italic leading-none">
                                            {result.label}
                                        </h2>
                                        
                                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Diagnostic Confidence</p>
                                                <div className="flex items-end space-x-3">
                                                    <p className="text-4xl font-black text-cyan-400">{(result.confidence * 100).toFixed(2)}%</p>
                                                    <div className="h-6 w-24 bg-slate-800 rounded-full overflow-hidden mb-2">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${result.confidence * 100}%` }}
                                                            transition={{ delay: 0.5, duration: 1 }}
                                                            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Oncology Status</p>
                                                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                                                    <span className={`w-3 h-3 rounded-full mr-3 ${result.has_tumor ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`}></span>
                                                    <span className="text-xs font-black uppercase text-white tracking-widest">
                                                        {result.has_tumor ? 'Tumor Detected' : 'Scan Evaluated Normal'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Modules */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass-card p-8 rounded-3xl">
                                        <Activity className="text-purple-400 mb-6" size={32} />
                                        <h3 className="text-lg font-bold mb-3">Tissue Segmentation</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            Our U-Net head is localizing tissue irregularities. Initial region-of-interest analysis is currently processing.
                                        </p>
                                        <button className="text-purple-400 text-xs font-black uppercase hover:text-white transition-colors">Download Report →</button>
                                    </div>
                                    <div className="glass-card p-8 rounded-3xl">
                                        <ShieldAlert className="text-amber-400 mb-6" size={32} />
                                        <h3 className="text-lg font-bold mb-3">Clinical Disclaimer</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            NeuroScan AI is a diagnostic assistant tool. All results must be validated by a licensed radiology professional.
                                        </p>
                                        <button className="text-amber-400 text-xs font-black uppercase hover:text-white transition-colors">Safety Protocol →</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Predict;
