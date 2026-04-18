import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRightLeft } from 'lucide-react';

interface LoginPageProps {
  loginForm: any;
  setLoginForm: (form: any) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginError: string | null;
  isProcessing: boolean;
  setView: (view: 'landing' | 'login' | 'signup' | 'admin' | 'member') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  loginForm, 
  setLoginForm, 
  handleLogin, 
  loginError, 
  isProcessing, 
  setView 
}) => (
  <div className="min-h-screen bg-[#2c1e12] flex items-center justify-center px-6 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg relative z-10"
    >
      <div className="bg-[#f5f2ed] p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-8 border-[#d4af37]">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-[#8b4513] mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-[#2c1e12] mb-2">प्रवेशः [Login]</h2>
          <p className="text-[#8b4513] text-[10px] uppercase tracking-[0.2em] font-sans font-bold">Access the Smrtisangrahah Portal</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setLoginForm({ ...loginForm, type: 'admin' })}
            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${loginForm.type === 'admin' ? 'bg-[#2c1e12] text-[#d4af37]' : 'bg-white text-[#2c1e12] border border-[#2c1e12]/10 hover:bg-[#2c1e12]/5'}`}
          >
            प्रबन्धकः (Admin)
          </button>
          <button 
            onClick={() => setLoginForm({ ...loginForm, type: 'member' })}
            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${loginForm.type === 'member' ? 'bg-[#2c1e12] text-[#d4af37]' : 'bg-white text-[#2c1e12] border border-[#2c1e12]/10 hover:bg-[#2c1e12]/5'}`}
          >
            सदस्यः (Member)
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[#5d4037] text-[10px] uppercase tracking-[0.2em] font-sans font-bold mb-2">
              {loginForm.type === 'admin' ? 'प्रयोक्तृनाम [Username]' : 'सदस्य ID [Member ID]'}
            </label>
            <input 
              type="text" required
              className="w-full bg-white border-2 border-[#8b4513]/20 px-4 py-3 text-[#2c1e12] focus:outline-none focus:border-[#d4af37] transition-colors font-serif"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[#5d4037] text-[10px] uppercase tracking-[0.2em] font-sans font-bold mb-2">कूटशब्दः [Password]</label>
            <input 
              type="password" required
              className="w-full bg-white border-2 border-[#8b4513]/20 px-4 py-3 text-[#2c1e12] focus:outline-none focus:border-[#d4af37] transition-colors font-serif"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
          
          {loginError && <p className="text-red-600 text-xs text-center font-bold">{loginError}</p>}

          <button 
            type="submit" disabled={isProcessing}
            className="w-full bg-[#2c1e12] text-[#d4af37] py-4 rounded-sm font-bold uppercase tracking-[0.3em] text-xs hover:bg-[#3d2a1a] transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent animate-spin rounded-full" />
            ) : (
              <>प्रविशतु [Enter] <ArrowRightLeft className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#8b4513]/10 text-center">
          <p className="text-[#5d4037] text-sm mb-4 italic">Not a member yet?</p>
          <button 
            onClick={() => setView('signup')}
            className="text-[#8b4513] text-[10px] uppercase tracking-widest font-bold border-b-2 border-[#8b4513]/20 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
          >
            सदस्यतायै पञ्जीकरणम् [Register for Membership]
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

export default LoginPage;
