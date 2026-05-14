import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, TrendingUp, Cpu, ShieldAlert, Target } from 'lucide-react';
import { getTopCoins, CoinData } from '../services/cryptoService';
import CoinCard from './CoinCard';
import TradingViewWidget from './TradingViewWidget';
import { getMarketPrediction, AIPrediction } from '../services/geminiService';
import { formatCurrency, formatCompactNumber, cn } from '../lib/utils';

export default function MarketOverview() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getTopCoins();
      setCoins(data);
      setLoading(false);
      if (data.length > 0) setSelectedCoin(data[0]);
    }
    fetchData();
  }, []);

  const handlePredict = async (coin: CoinData) => {
    setIsPredicting(true);
    setPrediction(null);
    const result = await getMarketPrediction(coin.id, coin.current_price, {
      sentiment: coin.price_change_percentage_24h > 0 ? 'bullish' : 'bearish',
      mc: coin.market_cap,
      vol: coin.total_volume
    });
    setPrediction(result);
    setIsPredicting(false);
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
          <p className="font-display text-[10px] tracking-widest uppercase animate-pulse">Syncing with blockchain grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Market Cap', value: '$2.56T', change: '+1.2%', icon: TrendingUp },
          { label: '24h Volume', value: '$84.2B', change: '-4.5%', icon: Activity },
          { label: 'BTC Dominance', value: '52.4%', change: '+0.1%', icon: Target },
          { label: 'Network Gas', value: '24 Gwei', change: 'Stable', icon: ShieldAlert }
        ].map((stat, i) => (
          <div key={i} className="frost-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/5 rounded-full blur-2xl translate-x-8 -translate-y-8" />
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="w-3 h-3 text-slate-500" />
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold text-white tracking-tighter">{stat.value}</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                stat.change.startsWith('+') ? "bg-neon-green/10 text-neon-green" : "bg-neon-pink/10 text-neon-pink"
              )}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Market List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="FILTER BLOCKCHAIN GRID..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-neon-blue/40 focus:bg-white/[0.08] transition-all"
            />
          </div>
          
          <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCoins.map(coin => (
              <CoinCard 
                key={coin.id} 
                coin={coin} 
                onClick={(c) => {
                  setSelectedCoin(c);
                  setPrediction(null);
                }} 
              />
            ))}
          </div>
        </div>

        {/* Detailed Analysis & Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedCoin && (
            <>
              <div className="frost-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center">
                    <img src={selectedCoin.image} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-light text-white tracking-tight italic uppercase">
                        {selectedCoin.name}
                      </h2>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-black text-slate-400 uppercase">{selectedCoin.symbol}</span>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5 glass-tag py-0.5 border-none bg-transparent px-0">
                         <span className="text-slate-500">Global Rank</span>
                         <span className="text-white">#{selectedCoin.market_cap_rank}</span>
                       </div>
                       <div className="flex items-center gap-1.5 glass-tag py-0.5 border-none bg-transparent px-0">
                         <span className="text-slate-500">Market Cap</span>
                         <span className="text-white">{formatCompactNumber(selectedCoin.market_cap)}</span>
                       </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handlePredict(selectedCoin)}
                  disabled={isPredicting}
                  className="neon-btn-primary group h-12 flex items-center gap-3"
                >
                  <Cpu className={cn("w-4 h-4 transition-transform duration-700", isPredicting && "animate-spin scale-110")} />
                  <span className="font-bold tracking-widest">{isPredicting ? 'NEURAL SYNCING...' : 'RUN AI ANALYSIS'}</span>
                </button>
              </div>

              <div className="h-[500px] frost-card p-2">
                <TradingViewWidget symbol={selectedCoin.symbol} />
              </div>

              <AnimatePresence>
                {prediction && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="frost-card p-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue shadow-[0_0_15px_#22d3ee]" />
                    
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-neon-blue/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-neon-blue" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Neural Intelligence Output</h3>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Model: Gemini 3-Flash // Quantum Enhanced</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-10">
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Decision Signal</p>
                        <div className={cn(
                          "text-3xl font-black italic uppercase leading-none",
                          prediction.prediction === 'bullish' ? 'text-neon-green' : prediction.prediction === 'bearish' ? 'text-neon-pink' : 'text-slate-400'
                        )}>
                          {prediction.prediction}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Neural Confidence</p>
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-black text-white italic">{(prediction.confidence).toFixed(1)}</span>
                          <span className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">% Score</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Neural Price Target</p>
                        <div className="text-3xl font-black text-neon-blue italic leading-none">{formatCurrency(prediction.targetPrice)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                      <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                        &quot;{prediction.rationale}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!prediction && !isPredicting && (
                <div className="frost-card p-16 flex flex-col items-center justify-center text-center group">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Cpu className="w-8 h-8 text-slate-600 group-hover:text-neon-blue transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Neural Engine Idle</h3>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold max-w-sm">Select an asset and initialize analysis to experience the full power of CryptoVision AI.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { Activity } from 'lucide-react';
import { Sparkles } from 'lucide-react';
