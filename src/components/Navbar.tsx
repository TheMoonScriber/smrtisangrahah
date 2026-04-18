import React from 'react';
import { Scroll } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  setView: (view: 'landing' | 'login' | 'signup' | 'admin' | 'member') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setView }) => (
  <nav className="fixed top-0 w-full z-50 bg-[#2c1e12]/90 backdrop-blur-sm border-b border-[#d4af37]/30 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
      <Scroll className="w-6 h-6 text-[#d4af37]" />
      <div className="flex flex-col">
        <span className="text-[#f5f2ed] font-serif font-bold tracking-wider text-lg leading-tight">स्मृतिसंग्रहः</span>
        <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.2em] font-medium">Smrtisangrahah</span>
      </div>
    </div>
    <div className="flex items-center gap-8">
      {user ? (
        <button 
          onClick={() => setView(user.role === 'admin' ? 'admin' : 'member')} 
          className="text-[#f5f2ed]/70 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors font-medium"
        >
          फलकम् (Dashboard)
        </button>
      ) : (
        <button 
          onClick={() => setView('login')} 
          className="px-5 py-2 border border-[#d4af37]/40 rounded-sm text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#2c1e12] transition-all duration-300 font-bold"
        >
          प्रवेशः [Login]
        </button>
      )}
    </div>
  </nav>
);

export default Navbar;
