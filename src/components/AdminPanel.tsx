import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, LayoutDashboard, BookOpen, Users, CheckCircle2, ArrowRightLeft, 
  Bookmark, Gift, Shield, LogOut, Plus, UserPlus, Clock, Search, Download, 
  History, Edit3, Trash2, X 
} from 'lucide-react';
import { Book, Member, Transaction, GiftRecord, User, Demand } from '../types';
import { getBookStatus } from '../utils/libraryUtils';

interface AdminPanelProps {
  user: User | null;
  adminTab: 'dashboard' | 'books' | 'members' | 'approvals' | 'transactions' | 'categories' | 'gifting' | 'security';
  setAdminTab: (tab: 'dashboard' | 'books' | 'members' | 'approvals' | 'transactions' | 'categories' | 'gifting' | 'security') => void;
  handleLogout: () => void;
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  categories: string[];
  gifts: GiftRecord[];
  demands: Demand[];
  bookSearchQuery: string;
  setBookSearchQuery: (query: string) => void;
  memberSearchQuery: string;
  setMemberSearchQuery: (query: string) => void;
  exportInventoryPDF: () => void;
  exportMembersPDF: () => void;
  exportCirculationPDF: () => void;
  generateIDCard: (member: Member) => void;
  handleApproveMember: (id: string) => void;
  handleApproveDemand: (id: string) => void;
  handleReceiveBook: (id: string) => void;
  handleAddCategory: (e: React.FormEvent) => void;
  handleDeleteCategory: (cat: string) => void;
  handleGiftBook: (e: React.FormEvent) => void;
  handleUpdateAccount: (e: React.FormEvent) => void;
  setBookForm: (form: any) => void;
  setMemberForm: (form: any) => void;
  setModalType: (type: any) => void;
  setIsModalOpen: (open: boolean) => void;
  setItemToDelete: (id: string | null) => void;
  setSelectedBill: (bill: any) => void;
  newCategory: string;
  setNewCategory: (cat: string) => void;
  giftForm: any;
  setGiftForm: (form: any) => void;
  securityForm: any;
  setSecurityForm: (form: any) => void;
  isProcessing: boolean;
  processingType: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  adminTab,
  setAdminTab,
  handleLogout,
  books,
  members,
  transactions,
  categories,
  gifts,
  demands,
  bookSearchQuery,
  setBookSearchQuery,
  memberSearchQuery,
  setMemberSearchQuery,
  exportInventoryPDF,
  exportMembersPDF,
  exportCirculationPDF,
  generateIDCard,
  handleApproveMember,
  handleApproveDemand,
  handleReceiveBook,
  handleAddCategory,
  handleDeleteCategory,
  handleGiftBook,
  handleUpdateAccount,
  setBookForm,
  setMemberForm,
  setModalType,
  setIsModalOpen,
  setItemToDelete,
  setSelectedBill,
  newCategory,
  setNewCategory,
  giftForm,
  setGiftForm,
  securityForm,
  setSecurityForm,
  isProcessing,
  processingType
}) => {
  return (
    <div className="min-h-screen bg-[#fdfaf5] flex font-serif">
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
            <p className="text-[#fdfaf5] font-bold text-sm mb-1">{user?.username}</p>
            <p className="text-[#d4af37]/50 text-[9px] uppercase tracking-[0.2em] font-sans font-bold">Authorized Librarian</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 mt-6">
          {[
            { id: 'dashboard', label: 'मुख्यपृष्ठम् [Dashboard]', icon: LayoutDashboard },
            { id: 'books', label: 'सूची [Inventory]', icon: BookOpen },
            { id: 'members', label: 'सदस्याः [Members]', icon: Users },
            { id: 'approvals', label: 'अनुमोदनम् [Approvals]', icon: CheckCircle2 },
            { id: 'transactions', label: 'विनिमयः [Circulation]', icon: ArrowRightLeft },
            { id: 'categories', label: 'वर्गाः [Categories]', icon: Bookmark },
            { id: 'gifting', label: 'उपहारः [Gifting]', icon: Gift },
            { id: 'security', label: 'सुरक्षा [Security]', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`w-full flex items-center gap-5 px-6 py-4.5 transition-all rounded-sm group relative ${
                adminTab === tab.id 
                  ? 'bg-[#d4af37] text-[#1a120b] shadow-[0_10px_20px_rgba(212,175,55,0.15)]' 
                  : 'hover:bg-[#d4af37]/5 text-[#d4af37]/40 hover:text-[#d4af37]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${adminTab === tab.id ? 'text-[#1a120b]' : 'group-hover:text-[#d4af37]'}`} />
              <span className="text-[11px] uppercase tracking-[0.15em] font-bold font-sans">{tab.label}</span>
              {adminTab === tab.id && (
                <motion.div 
                  layoutId="activeAdminTab"
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
      <main className="flex-1 p-16 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-[#d4af37]" />
              <span className="text-[#8b4513] text-[10px] uppercase tracking-[0.5em] font-bold opacity-60">Administrator Portal</span>
            </div>
            <h1 className="text-6xl font-serif font-bold text-[#1a120b] mb-6 tracking-tight">
              {adminTab === 'dashboard' && 'मुख्यपृष्ठम् [Dashboard]'}
              {adminTab === 'books' && 'ग्रन्थ सूची [Inventory]'}
              {adminTab === 'members' && 'सदस्य सूची [Members]'}
              {adminTab === 'approvals' && 'लम्बित अनुमोदनम् [Approvals]'}
              {adminTab === 'transactions' && 'विनिमय इतिहासः [Circulation]'}
              {adminTab === 'categories' && 'वर्ग प्रबन्धनम् [Categories]'}
              {adminTab === 'gifting' && 'ग्रन्थ उपहारः [Gifting]'}
              {adminTab === 'security' && 'लेखा सुरक्षा [Security]'}
            </h1>
          </header>

          <div className="bg-white p-14 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-[#8b4513]/5 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
            
            <AnimatePresence mode="wait">
              {adminTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: 'Total Books', value: books.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Total Members', value: members.filter(m => m.status === 'approved').length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Pending Approvals', value: members.filter(m => m.status === 'pending').length, icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' },
                      { label: 'Active Transactions', value: transactions.filter(t => !t.returnDate).length, icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-sm border border-[#8b4513]/10 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-4 ${stat.bg} rounded-sm group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <span className="text-3xl font-serif font-bold text-[#1a120b]">{stat.value}</span>
                        </div>
                        <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-[0.2em] font-sans font-bold">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-[#f9f7f2] p-10 rounded-sm border border-[#8b4513]/10">
                        <h3 className="text-xl font-serif font-bold text-[#1a120b] mb-8 flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#d4af37]" />
                          Recent Activity [नवीनतम गतिविधयः]
                        </h3>
                        <div className="space-y-6">
                          {transactions.slice(0, 5).map((t, i) => {
                            const book = books.find(b => b.id === t.bookId);
                            const member = members.find(m => m.id === t.memberId);
                            return (
                              <div key={t.id} className="flex items-center gap-6 p-4 hover:bg-white rounded-sm transition-colors border-l-2 border-transparent hover:border-[#d4af37]">
                                <div className="w-10 h-10 bg-[#1a120b] text-[#d4af37] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                  {i + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-[#1a120b]">
                                    {book?.title} <span className="text-[#8b4513]/40 font-normal mx-2">issued to</span> {member?.name}
                                  </p>
                                  <p className="text-[10px] text-[#8b4513]/60 uppercase tracking-wider mt-1">{t.issueDate}</p>
                                </div>
                                <div className="text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/5 px-3 py-1 rounded-full border border-[#d4af37]/10">
                                  {t.returnDate ? 'RETURNED' : 'ACTIVE'}
                                </div>
                              </div>
                            );
                          })}
                          {transactions.length === 0 && (
                            <p className="text-center py-10 text-[#8b4513]/40 italic">No recent transactions found.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-[#1a120b] p-10 rounded-sm shadow-xl border border-[#d4af37]/20">
                        <h3 className="text-xl font-serif font-bold text-[#d4af37] mb-8">Quick Actions</h3>
                        <div className="space-y-4">
                          <button 
                            onClick={() => { setBookForm({}); setModalType('addBook'); setIsModalOpen(true); }}
                            className="w-full flex items-center gap-4 p-4 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-[#d4af37] rounded-sm border border-[#d4af37]/20 transition-all text-left group"
                          >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-bold">Add New Book</span>
                          </button>
                          <button 
                            onClick={() => { setModalType('addMember'); setIsModalOpen(true); }}
                            className="w-full flex items-center gap-4 p-4 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-[#d4af37] rounded-sm border border-[#d4af37]/20 transition-all text-left group"
                          >
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-bold">Register Member</span>
                          </button>
                          <button 
                            onClick={() => setAdminTab('approvals')}
                            className="w-full flex items-center gap-4 p-4 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-[#d4af37] rounded-sm border border-[#d4af37]/20 transition-all text-left group"
                          >
                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-bold">Review Approvals</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-10 rounded-sm border border-[#8b4513]/10 shadow-sm">
                        <h3 className="text-xl font-serif font-bold text-[#1a120b] mb-6">Library Health</h3>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-[#8b4513]/60 mb-2">
                              <span>Inventory Utilization</span>
                              <span>{books.length > 0 ? Math.round((transactions.filter(t => !t.returnDate).length / books.length) * 100) : 0}%</span>
                            </div>
                            <div className="h-1.5 bg-[#f9f7f2] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${books.length > 0 ? (transactions.filter(t => !t.returnDate).length / books.length) * 100 : 0}%` }}
                                className="h-full bg-[#d4af37]" 
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-[#8b4513]/60 mb-2">
                              <span>Member Growth</span>
                              <span>{members.length > 0 ? Math.round((members.filter(m => m.status === 'approved').length / members.length) * 100) : 0}%</span>
                            </div>
                            <div className="h-1.5 bg-[#f9f7f2] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${members.length > 0 ? (members.filter(m => m.status === 'approved').length / members.length) * 100 : 0}%` }}
                                className="h-full bg-[#556b2f]" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {adminTab === 'books' && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <h2 className="text-3xl font-bold text-[#2c1e12] border-l-4 border-[#d4af37] pl-6">Book Collection</h2>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <div className="relative group flex-1 md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/30 group-focus-within:text-[#d4af37] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search by Book ID (e.g. SMR/CAT/2026/1)..."
                          className="w-full bg-[#f9f7f2] border-2 border-[#8b4513]/10 pl-12 pr-4 py-4 rounded-sm focus:outline-none focus:border-[#d4af37] transition-all text-sm font-sans"
                          value={bookSearchQuery}
                          onChange={(e) => setBookSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={exportInventoryPDF}
                          className="bg-[#2c1e12] text-[#d4af37] px-8 py-4 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all shadow-lg whitespace-nowrap border border-[#d4af37]/20"
                        >
                          <Download className="w-4 h-4" />
                          PDF निर्यात [Export]
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setBookForm({}); setModalType('addBook'); setIsModalOpen(true); }}
                          className="bg-[#556b2f] text-white px-10 py-4 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#455a25] transition-all shadow-lg whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" />
                          नवीन ग्रन्थः [Add]
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-sm border border-[#8b4513]/10">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#2c1e12]/10 bg-[#f9f7f2]">
                          <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">पञ्जीकरण ID [Reg ID]</th>
                          <th className="p-6 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">शीर्षकम् [Title]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">लेखकः [Author]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">वर्गः [Category]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">स्थितिः [Status]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold text-right">क्रिया [Actions]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8b4513]/10">
                      {books
                        .filter(book => book.id.toLowerCase().includes(bookSearchQuery.toLowerCase()))
                        .map((book) => {
                          const status = getBookStatus(book.id, books, transactions);
                          return (
                            <motion.tr 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={book.id} 
                              className="hover:bg-[#f9f7f2]/50 transition-colors"
                            >
                              <td className="p-5 font-mono text-[10px] font-bold text-[#8b4513]">{book.id}</td>
                              <td className="p-5 font-bold text-[#2c1e12]">{book.title}</td>
                              <td className="p-5 text-[#5d4037] italic">{book.author}</td>
                              <td className="p-5 text-sm text-[#5d4037]">{book.category}</td>
                              <td className="p-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="p-5 text-right">
                                <div className="flex justify-end gap-2">
                                  {book.billData && (
                                    <button 
                                      onClick={() => { setSelectedBill(book.billData); setModalType('viewBill'); setIsModalOpen(true); }}
                                      className="p-2 text-[#556b2f] hover:bg-[#556b2f]/10 rounded-full transition-all"
                                      title="View Bill"
                                    >
                                      <History className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => { setBookForm(book); setModalType('editBook'); setIsModalOpen(true); }}
                                    className="p-2 text-[#2c1e12] hover:bg-[#2c1e12]/10 rounded-full transition-all"
                                    title="Edit Book"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => { setItemToDelete(book.id); setModalType('confirmDeleteBook'); setIsModalOpen(true); }}
                                    className="p-2 text-[#8b4513]/40 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                                    title="Delete Book (ग्रन्थं निष्कासयतु)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {adminTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <h2 className="text-2xl font-bold text-[#2c1e12]">वर्ग प्रबन्धनम् [Category Management]</h2>
                </div>
                <form onSubmit={handleAddCategory} className="flex gap-4 mb-10 max-w-md">
                  <input 
                    type="text" 
                    required 
                    placeholder="New Category Name..."
                    className="flex-1 bg-white border-2 border-[#8b4513]/10 px-4 py-2 focus:outline-none focus:border-[#d4af37]"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="bg-[#2c1e12] text-[#d4af37] px-6 py-2 text-xs uppercase font-bold tracking-widest"
                  >
                    Add [योजयतु]
                  </motion.button>
                </form>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categories.map((cat) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={cat} 
                      className="bg-[#f9f7f2] border border-[#8b4513]/20 p-4 flex justify-between items-center group"
                    >
                      <span className="text-sm font-bold text-[#2c1e12]">{cat}</span>
                      <button 
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-[#8b4513]/30 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {adminTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <h2 className="text-2xl font-bold text-[#2c1e12]">सदस्य सूची [Library Members]</h2>
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/30 group-focus-within:text-[#d4af37] transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search by Member ID (e.g. SMR/MEM/2026/1)..."
                        className="w-full bg-[#f9f7f2] border-2 border-[#8b4513]/10 pl-12 pr-4 py-3 rounded-sm focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportMembersPDF}
                        className="bg-[#2c1e12] text-[#d4af37] px-6 py-3 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all shadow-md whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        PDF निर्यात [Export PDF]
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setModalType('addMember'); setIsModalOpen(true); }}
                        className="bg-[#556b2f] text-white px-8 py-3 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#455a25] transition-all shadow-md whitespace-nowrap"
                      >
                        <UserPlus className="w-4 h-4" />
                        नवीन सदस्यः [New Member]
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#2c1e12]/10 bg-[#f9f7f2]">
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">सदस्य ID [Member ID]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">नाम [Name]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">सम्पर्कः [Contact]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold">विवरणम् [Details]</th>
                        <th className="p-5 text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold text-right">क्रिया [Actions]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8b4513]/10">
                      {members
                        .filter(m => m.status === 'approved')
                        .filter(member => member.id.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                        .map((member) => (
                          <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={member.id} 
                            className="hover:bg-[#f9f7f2]/50 transition-colors"
                          >
                            <td className="p-5">
                              <div className="flex items-center gap-4">
                                {member.photo ? (
                                  <img src={member.photo} alt={member.name} className="w-10 h-10 object-cover rounded-full border border-[#d4af37]" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-10 h-10 bg-[#2c1e12] text-[#d4af37] rounded-full flex items-center justify-center text-xs font-bold">
                                    {member.name[0]}
                                  </div>
                                )}
                                <span className="font-mono text-[10px] font-bold text-[#8b4513]">{member.id}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="font-bold text-[#2c1e12]">{member.name}</div>
                              <div className="text-[10px] uppercase tracking-widest text-[#8b4513] opacity-60">{member.fatherName}</div>
                            </td>
                            <td className="p-5">
                              <div className="text-sm text-[#5d4037]">{member.email}</div>
                              <div className="text-xs text-[#8b4513]/60">{member.mobile}</div>
                            </td>
                            <td className="p-5">
                              <div className="text-xs text-[#5d4037]">DOB: {member.dob}</div>
                              <div className="text-xs text-[#5d4037]">Joined: {member.joinedDate}</div>
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setMemberForm(member); setModalType('editMember'); setIsModalOpen(true); }}
                                  className="p-2 text-[#2c1e12] hover:bg-[#2c1e12]/10 rounded-full transition-all"
                                  title="Edit Member"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => generateIDCard(member)}
                                  className="p-2 text-[#556b2f] hover:bg-[#556b2f]/10 rounded-full transition-all"
                                  title="Download ID Card"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setItemToDelete(member.id); setModalType('confirmDeleteMember'); setIsModalOpen(true); }}
                                  className="p-2 text-[#8b4513]/40 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                                  title="Delete Member (सदस्यं निष्कासयतु)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {adminTab === 'approvals' && (
              <motion.div
                key="approvals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-white p-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#d4af37]/10">
                  <div className="flex items-center gap-6 mb-12 border-b border-[#d4af37]/10 pb-8">
                    <div className="p-4 bg-[#d4af37]/5 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-[#1a120b]">Membership Approvals</h2>
                      <p className="text-[#8b4513]/60 text-[10px] uppercase tracking-[0.2em] font-sans font-bold mt-1">Review and welcome new seekers of wisdom</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fdfaf5] border-b border-[#d4af37]/20">
                          <th className="p-6 text-[11px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold">Candidate Details</th>
                          <th className="p-6 text-[11px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold">Contact Information</th>
                          <th className="p-6 text-[11px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold">Application Metadata</th>
                          <th className="p-6 text-[11px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d4af37]/5">
                        {members
                          .filter(m => m.status === 'pending')
                          .map((member) => (
                            <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={member.id} 
                              className="hover:bg-[#fdfaf5] transition-colors group"
                            >
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-[#1a120b] flex items-center justify-center overflow-hidden border border-[#d4af37]/20">
                                    {member.photo ? (
                                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[#d4af37] font-bold">{member.name.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#1a120b] text-lg">{member.name}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-[#8b4513] opacity-60">S/O: {member.fatherName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="text-sm font-sans text-[#1a120b] font-medium">{member.email}</div>
                                <div className="text-[11px] text-[#8b4513]/60 font-mono mt-1">{member.mobile}</div>
                              </td>
                              <td className="p-6">
                                <div className="text-[11px] text-[#1a120b] font-mono">Aadhaar: {member.aadhaar}</div>
                                <div className="text-[11px] text-[#8b4513]/60 mt-1 font-sans">Applied: {member.joinedDate}</div>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex justify-end gap-3">
                                  <button 
                                    disabled={isProcessing}
                                    onClick={() => handleApproveMember(member.id)}
                                    className="bg-[#1a120b] text-[#d4af37] px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-sm border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#1a120b] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                  >
                                    {isProcessing && processingType === 'update' ? 'Processing...' : 'Approve [अनुमोदयतु]'}
                                  </button>
                                  <button 
                                    disabled={isProcessing}
                                    onClick={() => { setItemToDelete(member.id); setModalType('confirmDeleteMember'); setIsModalOpen(true); }}
                                    className="bg-transparent text-red-800/60 border border-red-800/20 px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-red-50 hover:text-red-800 transition-all disabled:opacity-50"
                                  >
                                    Reject [अस्वीकरोतु]
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        {members.filter(m => m.status === 'pending').length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-20 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-30">
                                <CheckCircle2 className="w-12 h-12 text-[#d4af37]" />
                                <p className="text-[#8b4513] font-serif italic">All applications have been processed.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {adminTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <h2 className="text-2xl font-bold text-[#2c1e12]">विनिमय लेखा [Circulation Records]</h2>
                  <div className="flex gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exportCirculationPDF}
                      className="bg-[#2c1e12] text-[#d4af37] px-6 py-3 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      PDF निर्यात [Export PDF]
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setModalType('issueBook'); setIsModalOpen(true); }}
                      className="bg-[#556b2f] text-white px-8 py-3 rounded-sm flex items-center gap-3 text-xs uppercase tracking-widest font-bold hover:bg-[#455a25] transition-all shadow-md"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      ग्रन्थ निर्गमनम् [Issue Book]
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-6">
                  {transactions.map((t) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={t.id} 
                      className={`p-8 rounded-sm border-2 flex flex-col lg:flex-row justify-between items-center gap-8 ${t.returnDate ? 'bg-zinc-50 border-[#8b4513]/5 opacity-70' : 'bg-white border-[#8b4513]/20 shadow-lg'}`}
                    >
                      <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${t.returnDate ? 'bg-zinc-200 text-zinc-500' : 'bg-[#d4af37]/20 text-[#8b4513]'}`}>
                          {t.returnDate ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-[#2c1e12]">{t.book?.title}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold mt-1">Issued to: {t.member?.name}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-center flex-1">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-[#8b4513]/40 font-sans font-bold mb-2">निर्गमनम् (Issued)</div>
                          <div className="text-sm font-bold text-[#2c1e12]">{t.issueDate}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-[#8b4513]/40 font-sans font-bold mb-2">अन्तिमतिथिः (Due)</div>
                          <div className="text-sm font-bold text-red-700">{t.dueDate}</div>
                        </div>
                        {t.returnDate && (
                          <div className="col-span-2 md:col-span-1">
                            <div className="text-[10px] uppercase tracking-widest text-[#8b4513]/40 font-sans font-bold mb-2">प्रतिदानम् (Returned)</div>
                            <div className="text-sm font-bold text-[#556b2f]">{t.returnDate}</div>
                          </div>
                        )}
                      </div>
                      
                      {!t.returnDate && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReceiveBook(t.id)}
                          className="w-full lg:w-auto bg-[#2c1e12] text-[#d4af37] px-8 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all shadow-md"
                        >
                          ग्रन्थ प्राप्तिः (Receive)
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {adminTab === 'gifting' && (
              <motion.div
                key="gifting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <h2 className="text-2xl font-bold text-[#2c1e12]">ग्रन्थ उपहारः [Book Gifting]</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1">
                    <div className="bg-[#f9f7f2] p-8 border-2 border-[#8b4513]/10 rounded-sm">
                      <h3 className="text-lg font-bold text-[#2c1e12] mb-6 border-b border-[#8b4513]/10 pb-4 flex items-center gap-3">
                        <Gift className="w-5 h-5 text-[#d4af37]" />
                        नवीन उपहारः [New Gift]
                      </h3>
                      <form onSubmit={handleGiftBook} className="space-y-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2">ग्रन्थ ID [Book ID]</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. SMR/CAT/2026/1"
                            className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] text-sm font-mono"
                            value={giftForm.bookId}
                            onChange={(e) => setGiftForm({ ...giftForm, bookId: e.target.value })}
                          />
                          {giftForm.bookId && (
                            <div className="mt-2 p-2 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-sm">
                              <p className="text-[10px] uppercase tracking-widest text-[#8b4513]/60 font-bold mb-1">Book Name:</p>
                              <p className="text-sm font-bold text-[#2c1e12]">
                                {books.find(b => b.id === giftForm.bookId)?.title || <span className="text-red-500 italic">Not Found</span>}
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2">सदस्य ID [Member ID]</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. SMR/MEM/2026/1"
                            className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] text-sm font-mono"
                            value={giftForm.memberId}
                            onChange={(e) => setGiftForm({ ...giftForm, memberId: e.target.value })}
                          />
                          {giftForm.memberId && (
                            <div className="mt-2 p-2 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-sm">
                              <p className="text-[10px] uppercase tracking-widest text-[#8b4513]/60 font-bold mb-1">Member Name:</p>
                              <p className="text-sm font-bold text-[#2c1e12]">
                                {members.find(m => m.id === giftForm.memberId)?.name || <span className="text-red-500 italic">Not Found</span>}
                              </p>
                            </div>
                          )}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit" 
                          className="w-full bg-[#556b2f] text-white py-4 rounded-sm text-xs uppercase font-bold tracking-widest hover:bg-[#455a25] transition-all shadow-md"
                        >
                          उपहारं ददातु [Give Gift]
                        </motion.button>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-[#2c1e12] mb-6 flex items-center gap-3">
                      <History className="w-5 h-5 text-[#8b4513]/40" />
                      उपहार इतिहासः [Gift History]
                    </h3>
                    <div className="space-y-4">
                      {gifts.length === 0 ? (
                        <div className="text-center py-20 bg-[#f9f7f2] border border-dashed border-[#8b4513]/20 text-[#8b4513]/40 italic">
                          No gifts recorded yet.
                        </div>
                      ) : (
                        gifts.map((gift) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={gift.id} 
                            className="bg-white border-2 border-[#8b4513]/10 p-6 flex justify-between items-center group hover:border-[#d4af37] transition-all"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-[#556b2f]/10 text-[#556b2f] rounded-full flex items-center justify-center">
                                <Gift className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="font-bold text-[#2c1e12]">{gift.book?.title || 'Unknown Book'}</div>
                                <div className="text-[10px] uppercase tracking-widest text-[#8b4513] font-bold mt-1">
                                  Gifted to: {gift.member?.name || 'Unknown Member'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase tracking-widest text-[#8b4513]/40 font-bold mb-1">Date</div>
                              <div className="text-sm font-bold text-[#2c1e12]">{gift.giftDate}</div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {adminTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                  <h2 className="text-2xl font-bold text-[#2c1e12]">लेखा सुरक्षा [Account Security]</h2>
                </div>
                
                <div className="max-w-2xl bg-white p-12 border-2 border-[#8b4513]/10 rounded-sm shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#d4af37]" />
                  <div className="flex items-start gap-8 mb-12">
                    <div className="w-16 h-16 bg-[#2c1e12] text-[#d4af37] rounded-sm flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2c1e12] mb-2">ग्रन्थाध्यक्ष विवरणम् [Librarian Credentials]</h3>
                      <p className="text-[#8b4513] text-sm italic">Update your administrative access credentials here. Ensure you use a strong password.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateAccount} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold mb-3 group-focus-within:text-[#d4af37] transition-colors">नवीन प्रयोक्तृनाम [New Username]</label>
                        <input 
                          type="text" 
                          placeholder={`Current: ${user?.username || 'librarian'}`}
                          className="w-full bg-[#f9f7f2] border-2 border-[#8b4513]/10 px-6 py-4 focus:outline-none focus:border-[#d4af37] transition-all font-serif"
                          value={securityForm.username}
                          onChange={(e) => setSecurityForm({ ...securityForm, username: e.target.value })}
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8b4513] font-sans font-bold mb-3 group-focus-within:text-[#d4af37] transition-colors">नवीन कूटशब्दः [New Password]</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-[#f9f7f2] border-2 border-[#8b4513]/10 px-6 py-4 focus:outline-none focus:border-[#d4af37] transition-all font-serif"
                          value={securityForm.password}
                          onChange={(e) => setSecurityForm({ ...securityForm, password: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#8b4513]/10">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="bg-[#2c1e12] text-[#d4af37] px-12 py-4 text-xs uppercase font-bold tracking-[0.3em] hover:bg-[#3d2b1a] transition-all shadow-lg"
                      >
                        विवरणं रक्षतु [Save Credentials]
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
