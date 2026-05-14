import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Greetings, trader. I am CryptoVision AI. How can I assist with your market analysis today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are CryptoVision Assistant, a futuristic, high-end AI crypto analyst. Use a technical, professional, but cyberpunk-influenced tone. Provide deep insights, not just direct answers. Use markdown formatting."
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Error processing request.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'System breach detected. Connection to AI grid lost.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-5 bg-gradient-to-br from-neon-blue to-neon-purple text-white rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-white/20"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-50 w-full max-w-[420px] h-[600px] frost-card flex flex-col border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neon-blue/10 rounded-lg">
                   <Bot className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white flex items-center gap-2">
                    Neural Analyst <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  </span>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Encrypted Connection Established</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex flex-col max-w-[90%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-neon-blue/10 border border-neon-blue/20 text-blue-100 rounded-tr-none" 
                      : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none shadow-sm"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-[8px] mt-1.5 text-slate-600 uppercase font-bold tracking-widest">
                    {msg.role === 'user' ? 'Client' : 'Neural Core'} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Decrypting market grids...
                </div>
              )}
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="QUERY NEURAL ENGINE..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-neon-blue/40 focus:bg-white/10 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-neon-blue transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
