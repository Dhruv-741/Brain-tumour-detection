import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Info, Activity, AlertTriangle } from 'lucide-react';

const REGION_INFO = {
    'Frontal_Lobe': {
        name: 'Frontal Lobe',
        desc: 'Responsible for executive function, motor control, and personality.',
        tumorInsight: 'Tumors here can cause mood changes, muscle weakness, or loss of smell.',
        color: '#22d3ee'
    },
    'Parietal_Lobe': {
        name: 'Parietal Lobe',
        desc: 'Processes sensory information from across the body.',
        tumorInsight: 'Tumors here often lead to difficulties with spatial awareness or reading.',
        color: '#3b82f6'
    },
    'Temporal_Lobe': {
        name: 'Temporal Lobe',
        desc: 'Critical for hearing, memory, and language processing.',
        tumorInsight: 'Lesions in this area may cause complex seizures or speech issues.',
        color: '#6366f1'
    },
    'Occipital_Lobe': {
        name: 'Occipital Lobe',
        desc: 'The primary visual processing center of the brain.',
        tumorInsight: 'Tumors typically manifest as vision loss or visual hallucinations.',
        color: '#8b5cf6'
    },
    'Cerebellum': {
        name: 'Cerebellum',
        desc: 'Coordinates voluntary movements, posture, and balance.',
        tumorInsight: 'Tumors cause ataxic gait, tremors, and balance disturbances.',
        color: '#a855f7'
    },
    'Stem': {
        name: 'Brain Stem',
        desc: 'Controls vital life functions like breathing and heart rate.',
        tumorInsight: 'Extremely critical area; tumors here can affect multiple cranial nerves.',
        color: '#d946ef'
    }
};

export const InfoPanel = ({ activeRegion, onClear }) => {
    // Basic mapping check
    const displayInfo = REGION_INFO[activeRegion] || {
        name: activeRegion ? activeRegion.replace('_', ' ') : 'Select a Region',
        desc: 'Explore the 3D model to see anatomical details.',
        tumorInsight: 'Click on any part of the brain to learn about its role in oncology.',
        color: '#94a3b8'
    };

    return (
        <AnimatePresence>
            {activeRegion && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    className="absolute top-10 right-10 z-50 w-80 p-6 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-3xl text-white"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                                <Brain size={24} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">{displayInfo.name}</h2>
                        </div>
                        <button 
                            onClick={onClear}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                <Info size={14} className="mr-2" /> Anatomy
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed">{displayInfo.desc}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="flex items-center text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                                <AlertTriangle size={14} className="mr-2" /> Clinical Insight
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed">{displayInfo.tumorInsight}</p>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button className="w-full py-3 bg-cyan-500 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                View MRI Reference
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
