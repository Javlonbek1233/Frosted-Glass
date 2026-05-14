import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, Activity, MessageSquare } from 'lucide-react';
import { formatCurrency, cn, formatCompactNumber } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface CoinCardProps {
  coin: any;
  onClick: (coin: any) => void;
}

export default function CoinCard({ coin, onClick }: CoinCardProps) {
  const isPositive = coin.price_change_percentage_24h > 0;
  
  // Transform sparkline data for recharts
  const chartData = coin.sparkline_in_7d?.price.map((price: number, index: number) => ({
    value: price,
    index
  })) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="frost-card p-5 cursor-pointer group hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
      onClick={() => onClick(coin)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
            <img src={coin.image} alt={coin.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight text-sm uppercase">{coin.symbol}</h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{coin.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-white tracking-tighter">
            {formatCurrency(coin.current_price)}
          </p>
          <div className={cn(
            "text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1",
            isPositive ? "text-neon-green" : "text-neon-pink"
          )}>
            {isPositive ? '+' : '-'}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="h-20 w-full mb-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#4ade80" : "#f43f5e"} stopOpacity={0.2} />
                <stop offset="100%" stopColor={isPositive ? "#4ade80" : "#f43f5e"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['auto', 'auto']} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#4ade80" : "#f43f5e"} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Vol 24H</span>
            <span className="text-[10px] text-slate-300 font-bold tracking-tight">{formatCompactNumber(coin.total_volume)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Sentiment</span>
            <span className={cn(
              "text-[10px] font-bold uppercase",
              isPositive ? "text-neon-green" : "text-neon-pink"
            )}>{isPositive ? 'Bull' : 'Bear'}</span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-neon-blue hover:bg-neon-blue/10 transition-all">
          <Activity className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
