import React from 'react';
import { motion } from 'motion/react';
import { 
  Scroll, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  LogOut, 
  Search 
} from 'lucide-react';
import { User, Book, Demand } from '../types';

interface MemberPanelProps {
  user: User | null;
  memberTab: 'dashboard' | 'books' | 'demands';
  setMemberTab: (tab: 'dashboard' | 'books' | 'demands') => void;
  handleLogout: () => void;
  books: Book[];
  handleDemandBook: (bookId: string) => void;
  handleUndemandBook: (demandId: string) => void;
  memberDemands: Demand[];
}

const MemberPanel: React.FC<MemberPanelProps> = ({ 
  user, 
  memberTab, 
  setMemberTab, 
  handleLogout, 
  books, 
  handleDemandBook, 
  handleUndemandBook,
  memberDemands 
}) => (
  <div className="min-h-screen bg-[#fdfaf5] flex font-serif text-[#1a120b]">
    {/* Sidebar Navigation */}
    <aside className="w-80 bg-[#1a120b] text-[#d4af37] flex flex-col h-screen sticky top-0 overflow-y-auto shadow-2xl z-20 border-r border-[#d4af37]/10">
      <div className="p-10 border-b border-[#d4af37]/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#d4af37]/5 rounded-sm border border-[#d4af37]/20">
            <Scroll className="w-8 h-8 text-[#d4af37]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#fdfaf5] font-serif font-bold tracking-wider text-2xl leading-tight">स्मृतिसंग्रहः</span>
            <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.3em] font-medium opacity-70">Smrtisangrahah</span>
          </div>
        </div>
        <div className="mt-10 p-5 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-sm">
          <p className="text-[#fdfaf5] font-bold text-sm mb-1">{user?.name}</p>
          <p className="text-[#d4af37]/50 text-[9px] uppercase tracking-[0.2em] font-sans font-bold">Respected Member</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 mt-6">
        {[
          { id: 'dashboard', label: 'Dashboard [फलकम्]', icon: LayoutDashboard },
          { id: 'books', label: 'Books [ग्रन्थाः]', icon: BookOpen },
          { id: 'demands', label: 'My Requests [प्रार्थनाः]', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMemberTab(tab.id as any)}
            className={`w-full flex items-center gap-5 px-6 py-4.5 transition-all rounded-sm group relative ${
              memberTab === tab.id 
                ? 'bg-[#d4af37] text-[#1a120b] shadow-[0_10px_20px_rgba(212,175,55,0.15)]' 
                : 'hover:bg-[#d4af37]/5 text-[#d4af37]/40 hover:text-[#d4af37]'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${memberTab === tab.id ? 'text-[#1a120b]' : 'group-hover:text-[#d4af37]'}`} />
            <span className="text-[11px] uppercase tracking-[0.15em] font-bold font-sans">{tab.label}</span>
            {memberTab === tab.id && (
              <motion.div 
                layoutId="activeMemberTab"
                className="absolute left-0 top-0 h-full w-1 bg-[#1a120b]/20" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-[#d4af37]/10 bg-[#0d0905]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-transparent text-[#d4af37]/60 px-6 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-[#d4af37] hover:text-[#1a120b] transition-all border border-[#d4af37]/20"
        >
          <LogOut className="w-4 h-4" />
          निर्गमनम् (Logout)
        </button>
      </div>
    </aside>

    {/* Main Content Area */}
    <main className="flex-1 p-12 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
      <div className="max-w-7xl mx-auto">
        {memberTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end border-b-2 border-[#d4af37]/20 pb-8">
              <div>
                <h1 className="text-5xl font-serif font-bold text-[#2c1e12] mb-3">स्वागतम् [Welcome]</h1>
                <p className="text-[#8b4513] text-[10px] uppercase tracking-[0.3em] font-sans font-bold">Explore the Sanctuary of Wisdom</p>
              </div>
              <div className="text-right">
                <p className="text-[#2c1e12] font-bold text-xl">{new Date().toLocaleDateString('sa-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-widest font-sans font-bold">Current Date</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-[#d4af37]">
                <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-widest font-bold mb-2">My ID</p>
                <p className="text-2xl font-bold text-[#2c1e12]">{user?.id}</p>
              </div>
              <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-[#556b2f]">
                <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-widest font-bold mb-2">Status</p>
                <p className="text-2xl font-bold text-[#556b2f] uppercase tracking-widest">{user?.status}</p>
              </div>
              <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-[#8b4513]">
                <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-widest font-bold mb-2">Joined</p>
                <p className="text-2xl font-bold text-[#2c1e12]">{user?.joinedDate}</p>
              </div>
            </div>
          </div>
        )}

        {memberTab === 'books' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-serif font-bold text-[#2c1e12]">ग्रन्थ सूची [Book Collection]</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/40" />
                  <input 
                    type="text" 
                    placeholder="Search books..."
                    className="bg-white border-2 border-[#8b4513]/10 pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-all w-80"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book: any) => (
                <motion.div 
                  key={book.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-sm shadow-sm border border-[#8b4513]/10 relative group"
                >
                  <div className="absolute top-4 right-4">
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                      book.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <BookOpen className="w-10 h-10 text-[#d4af37] mb-6 opacity-40" />
                  <h3 className="text-xl font-bold text-[#2c1e12] mb-2 line-clamp-1">{book.title}</h3>
                  <p className="text-[#8b4513] text-sm mb-4 italic">by {book.author}</p>
                  <div className="flex justify-between items-center pt-6 border-t border-[#8b4513]/5">
                    <span className="text-[10px] uppercase tracking-widest text-[#8b4513]/60 font-bold">{book.category}</span>
                    {book.status === 'Available' && (
                      <button 
                        onClick={() => handleDemandBook(book.id)}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#2c1e12] hover:text-[#d4af37] transition-colors"
                      >
                        Request [प्रार्थयतु]
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {memberTab === 'demands' && (
          <div className="space-y-10">
            <h2 className="text-4xl font-serif font-bold text-[#2c1e12]">मम प्रार्थनाः [My Requests]</h2>
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-[#8b4513]/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9f7f2] border-b border-[#8b4513]/10">
                    <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Book [ग्रन्थः]</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-bold">Date [दिनाङ्कः]</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-bold text-center">Status [स्थितिः]</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-bold text-right">Action [क्रिया]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8b4513]/5">
                  {memberDemands.map((demand: any) => (
                    <tr key={demand.id} className="hover:bg-[#f9f7f2]/50 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-[#2c1e12]">{demand.bookTitle}</div>
                        <div className="text-[10px] text-[#8b4513]/60 uppercase tracking-widest">ID: {demand.bookId}</div>
                      </td>
                      <td className="p-6 text-sm text-[#5d4037]">{demand.requestDate}</td>
                      <td className="p-6 text-center">
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full ${
                          demand.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {demand.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        {demand.status === 'pending' && (
                          <button
                            onClick={() => handleUndemandBook(demand.id)}
                            className="text-[9px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Cancel [रद्द]
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {memberDemands.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-[#8b4513]/40 italic">
                        No requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
);

export default MemberPanel;
