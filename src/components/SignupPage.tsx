import React from 'react';
import { motion } from 'motion/react';
import { Scroll, ArrowLeft, User as UserIcon, Camera } from 'lucide-react';
import { formatMobile, formatAadhaar } from '../utils/formatters';

interface SignupPageProps {
  signupForm: any;
  setSignupForm: (form: any) => void;
  handleSignup: (e: React.FormEvent) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setView: (view: 'landing' | 'login' | 'signup' | 'admin' | 'member') => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ 
  signupForm, 
  setSignupForm, 
  handleSignup, 
  handlePhotoChange, 
  setView 
}) => {
  return (
    <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center p-6 font-serif bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-4xl shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-[#8b4513]/10 overflow-hidden rounded-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          <div className="md:col-span-2 bg-[#2c1e12] p-12 text-[#d4af37] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <Scroll className="w-96 h-96 -translate-x-20 -translate-y-20 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-[#d4af37]/10 rounded-sm border border-[#d4af37]/30">
                  <Scroll className="w-8 h-8 text-[#d4af37]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#f5f2ed] font-serif font-bold tracking-wider text-2xl leading-tight">स्मृतिसंग्रहः</span>
                  <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.2em] font-medium">Smrtisangrahah</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight text-[#f5f2ed]">Join the Sanctuary of Wisdom</h2>
              <p className="text-[#d4af37]/80 text-sm leading-relaxed italic">
                "ज्ञानं परमं बलम्" — Knowledge is the ultimate strength. Register to access our vast collection of ancient and modern wisdom.
              </p>
            </div>
            <div className="relative z-10 mt-12">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-4">Already a member?</p>
              <button 
                onClick={() => setView('login')}
                className="flex items-center gap-3 text-sm font-bold hover:text-[#f5f2ed] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </button>
            </div>
          </div>

          <div className="md:col-span-3 p-12 overflow-y-auto max-h-[90vh]">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#2c1e12] mb-2">Member Registration</h3>
              <p className="text-[#8b4513]/60 text-xs uppercase tracking-widest font-bold">Please provide your authentic details</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-[#d4af37]/20 overflow-hidden bg-[#f9f7f2] flex items-center justify-center relative transition-all group-hover:border-[#d4af37]/50">
                    {signupForm.photo ? (
                      <img src={signupForm.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-[#8b4513]/20" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8b4513]/60 font-bold mt-3 text-center">Upload Member Photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Full Name [पूर्ण नाम]</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Father's Name [पितुः नाम]</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.fatherName}
                    onChange={(e) => setSignupForm({ ...signupForm, fatherName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Email ID [ईमेल]</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Mobile Number [दूरभाषः]</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="+91 - XXXXXXXXXX"
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.mobile}
                    onChange={(e) => setSignupForm({ ...signupForm, mobile: formatMobile(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Date of Birth [जन्मदिनाङ्कः]</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.dob}
                    onChange={(e) => setSignupForm({ ...signupForm, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Joining Date [प्रवेश दिनाङ्कः]</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                    value={signupForm.joiningDate}
                    onChange={(e) => setSignupForm({ ...signupForm, joiningDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Aadhaar Number [आधार सङ्ख्या]</label>
                <input 
                  type="text" 
                  required 
                  placeholder="XXXX - XXXX - XXXX"
                  className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                  value={signupForm.aadhaar}
                  onChange={(e) => setSignupForm({ ...signupForm, aadhaar: formatAadhaar(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Full Address [पूर्णं सङ्केतः]</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans resize-none"
                  value={signupForm.address}
                  onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Set Password [कूटशब्दः]</label>
                <input 
                  type="password" 
                  required 
                  className="w-full bg-[#f9f7f2] border-b-2 border-[#8b4513]/10 px-0 py-3 focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-[#2c1e12] text-[#d4af37] py-5 rounded-sm text-xs uppercase font-bold tracking-[0.3em] shadow-xl hover:bg-[#3d2b1a] transition-all border border-[#d4af37]/20 mt-10"
              >
                Request Membership [सदस्यतायै प्रार्थना]
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
