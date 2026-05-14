/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MarketOverview from './components/MarketOverview';
import AIChatPanel from './components/AIChatPanel';
import { motion } from 'motion/react';
import { TrendingUp, Shield, Zap, Globe } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen pt-24 pb-12 px-6 overflow-x-hidden selection:bg-neon-blue/30 selection:text-white">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon-purple/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px]" />
        </div>

        <Navbar />

        <main className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none text-white uppercase italic">
                MARKET <span className="font-black not-italic text-transparent bg-clip-text bg-gradient-to-br from-neon-blue to-neon-purple drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">INTELLIGENCE</span>
              </h1>
              <p className="mt-6 text-slate-400 uppercase tracking-[0.3em] text-[10px] max-w-xl mx-auto leading-loose font-medium">
                Autonomous Neural Analysis • Real-time Data Streams • Quantum Risk Assessment
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: TrendingUp, label: 'Bullish Phase' },
                { icon: Zap, label: 'Neural Engine active' },
                { icon: Globe, label: 'Global Node Sync' }
              ].map((item, i) => (
                <div key={i} className="glass-tag">
                  <item.icon className="w-3 h-3 text-neon-blue" />
                  {item.label}
                </div>
              ))}
            </div>
          </section>

          {/* Market Section */}
          <section className="relative">
            <div className="flex items-end justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 bg-gradient-to-t from-neon-blue to-transparent rounded-full" />
                <div>
                  <h2 className="text-3xl font-light text-white uppercase tracking-tight">Market <span className="font-bold">Grid</span></h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Asset Intelligence</p>
                </div>
              </div>
            </div>
            
            <MarketOverview />
          </section>
        </main>

        <AIChatPanel />

        <footer className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#4ade80] animate-pulse" />
            SYSTEM CORE v4.28 // STABLE
          </div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-neon-blue transition-colors">Neural Policy</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Grid Status</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Terminal Access</a>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
