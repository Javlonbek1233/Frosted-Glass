import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.type = "text/javascript";
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": `BINANCE:${symbol.toUpperCase()}USDT`,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": container.current.id,
          "hide_side_toolbar": false,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if needed
    };
  }, [symbol]);

  return (
    <div className="w-full h-full cyberpunk-chart-container">
      <div 
        id={`tradingview_${symbol}`} 
        ref={container} 
        className="w-full h-full rounded-2xl overflow-hidden border border-cyber-border shadow-2xl shadow-neon-blue/10"
      />
    </div>
  );
}
