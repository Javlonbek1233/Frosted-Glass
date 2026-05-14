import { useAuth } from '../context/AuthContext';
import { Coins, LogIn, LogOut, LayoutDashboard, Briefcase, Zap, Search } from 'lucide-react';

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-white/5 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white hidden sm:block">
            CRYPTO<span className="text-neon-blue">VISION</span>
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <a href="#" className="flex items-center gap-2 text-neon-blue relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[2px] after:bg-neon-blue after:shadow-[0_0_8px_#22d3ee]">
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              AI Signals
            </a>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-white uppercase tracking-tight">{user.displayName}</span>
                <span className="text-[9px] text-neon-blue uppercase tracking-widest font-black opacity-80">NEURAL TIER // 01</span>
              </div>
              <div className="w-10 h-10 rounded-xl border-2 border-white/10 p-0.5 overflow-hidden">
                <img src={user.photoURL || ''} alt="avatar" className="w-full h-full rounded-[10px] object-cover" />
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-500 hover:text-neon-pink transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="neon-btn-primary flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Initialize Connection
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
