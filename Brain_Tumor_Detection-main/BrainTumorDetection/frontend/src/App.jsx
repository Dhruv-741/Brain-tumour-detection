import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Metrics from './pages/Metrics';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.98, filter: 'blur(10px)' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* Global Animated Neural Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05] animate-grid"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/predict" element={<PageTransition><Predict /></PageTransition>} />
            <Route path="/metrics" element={<PageTransition><Metrics /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
