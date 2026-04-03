import React, { useState, useEffect } from 'react';
import { 
  Library, 
  BookOpen, 
  Users, 
  Plus, 
  Search, 
  LogOut, 
  ChevronRight, 
  Calendar, 
  UserPlus, 
  ArrowRightLeft, 
  Gift,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  X,
  Scroll,
  History,
  Bookmark,
  Compass,
  Download,
  Shield,
  LayoutDashboard,
  ArrowLeft,
  User as UserIcon,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AIAssistant from './components/AIAssistant';
import { Book, Member, Demand, Transaction, GiftRecord, User } from './types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MemberPanel from './components/MemberPanel';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import { formatAadhaar, formatMobile } from './utils/formatters';
import { getBookStatus } from './utils/libraryUtils';

// --- Utility Functions ---
// Removed local formatters as they are imported

// Removed local Navbar and LandingPage as they are imported

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'admin' | 'member'>('landing');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'books' | 'members' | 'approvals' | 'transactions' | 'categories' | 'gifting' | 'security'>('dashboard');
  const [memberTab, setMemberTab] = useState<'dashboard' | 'books' | 'demands'>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [memberDemands, setMemberDemands] = useState<Demand[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'login' | 'logout' | 'register' | 'delete' | 'update' | 'account' | 'gift' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Forms
  const [loginForm, setLoginForm] = useState({ id: '', username: '', password: '', type: 'admin' });
  const [signupForm, setSignupForm] = useState<any>({ 
    name: '', 
    fatherName: '', 
    address: '', 
    aadhaar: '', 
    mobile: '', 
    email: '', 
    dob: '', 
    joiningDate: new Date().toISOString().split('T')[0],
    photo: null,
    password: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignupForm({ ...signupForm, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const [isSignup, setIsSignup] = useState(false);
  const [securityForm, setSecurityForm] = useState({ username: '', password: '' });
  const [giftForm, setGiftForm] = useState({ bookId: '', memberId: '' });
  const [loginError, setLoginError] = useState('');
  const [bookForm, setBookForm] = useState<Partial<Book>>({});
  const [memberForm, setMemberForm] = useState<Partial<Member>>({
    joinedDate: new Date().toISOString().split('T')[0],
    dob: ''
  });
  const [issueForm, setIssueForm] = useState({ bookId: '', memberId: '', dueDate: '' });
  const [newCategory, setNewCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'addBook' | 'editBook' | 'addMember' | 'editMember' | 'issueBook' | 'viewBill' | 'confirmDeleteBook' | 'confirmDeleteMember' | null>(null);
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [billBlobUrl, setBillBlobUrl] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBill && modalType === 'viewBill') {
      const createBlobUrl = async () => {
        try {
          const res = await fetch(selectedBill);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setBillBlobUrl(url);
        } catch (error) {
          console.error('Error creating blob URL:', error);
          setBillBlobUrl(selectedBill);
        }
      };
      createBlobUrl();
    } else {
      if (billBlobUrl) {
        URL.revokeObjectURL(billBlobUrl);
        setBillBlobUrl(null);
      }
    }
    
    return () => {
      if (billBlobUrl) {
        URL.revokeObjectURL(billBlobUrl);
      }
    };
  }, [selectedBill, modalType]);

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth();
        await fetchCategories();
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);


  const checkAuth = async () => {
    const token = localStorage.getItem('library_token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const userData: User = { 
          ...data.user, 
          isAdmin: data.user.isAdmin,
          role: data.user.isAdmin ? 'admin' : 'member'
        };
        setUser(userData);
        if (userData.isAdmin) {
          setView('admin');
          fetchAdminData();
        } else {
          setView('member');
          fetchMemberData();
        }
      } else {
        localStorage.removeItem('library_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const triggerSuccess = async (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setLastError(null);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowSuccess(false);
  };

  const triggerError = (message: string) => {
    setLastError(message);
    alert(message);
  };

  const simulateProcessing = async (type: typeof processingType, callback: () => Promise<void> | void) => {
    setIsProcessing(true);
    setProcessingType(type);
    const startTime = Date.now();
    try {
      await callback();
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2500 - elapsedTime);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingType(null);
      }, remainingTime);
    }
  };

  const handleDeleteMember = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('library_token');
    simulateProcessing('delete', async () => {
      try {
        const response = await fetch(`/api/members/${encodeURIComponent(itemToDelete)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          setItemToDelete(null);
          await triggerSuccess('Member record removed successfully.');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to delete member'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        triggerError('An unexpected error occurred while deleting the member.');
      }
    });
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('library_token');
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch('/api/categories', { headers });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAdminData = async () => {
    const token = localStorage.getItem('library_token');
    if (!token) return;

    try {
      const [booksRes, membersRes, transRes, catRes, giftRes, demandsRes] = await Promise.all([
        fetch('/api/books', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/members', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/transactions', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/gifts', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/demands', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (booksRes.ok) setBooks(await booksRes.json());
      if (membersRes.ok) setMembers(await membersRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (giftRes.ok) setGifts(await giftRes.json());
      if (demandsRes.ok) setDemands(await demandsRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchMemberData = async () => {
    const token = localStorage.getItem('library_token');
    if (!token) return;

    try {
      const [booksRes, catRes, demandsRes] = await Promise.all([
        fetch('/api/books', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/member/demands', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (booksRes.ok) setBooks(await booksRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (demandsRes.ok) setMemberDemands(await demandsRes.json());
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    if (!token) return;

    simulateProcessing('account', async () => {
      try {
        const response = await fetch('/api/admin/account', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(securityForm),
        });
        if (response.ok) {
          await triggerSuccess('Account security updated successfully!');
          setSecurityForm({ username: '', password: '' });
        } else {
          triggerError('Failed to update account security');
        }
      } catch (error) {
        console.error('Error updating account:', error);
      }
    });
  };

  const handleGiftBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    if (!token) return;

    simulateProcessing('gift', async () => {
      try {
        const response = await fetch('/api/gift', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(giftForm),
        });
        if (response.ok) {
          await fetchAdminData();
          await triggerSuccess('Book gifted successfully for life!');
          setGiftForm({ bookId: '', memberId: '' });
        } else {
          const data = await response.json();
          triggerError(data.error || 'Failed to gift book');
        }
      } catch (error) {
        console.error('Error gifting book:', error);
      }
    });
  };

  const exportInventoryPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.text("Smriti Sangrah Library - Inventory Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Books: ${books.length}`, 14, 38);

    const tableData = books.map(book => [
      book.id,
      book.title,
      book.author,
      book.category,
      book.year,
      book.status
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'Title', 'Author', 'Category', 'Year', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [44, 30, 18] }
    });

    doc.save(`library_inventory_${date}.pdf`);
  };

  const exportMembersPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.text("Smriti Sangrah Library - Members Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Members: ${members.length}`, 14, 38);

    const tableData = members.map(member => [
      member.id,
      member.name,
      member.mobile,
      member.email,
      member.joinedDate
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'Name', 'Mobile', 'Email', 'Joined Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [44, 30, 18] }
    });

    doc.save(`library_members_${date}.pdf`);
  };

  const exportCirculationPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.text("Smriti Sangrah Library - Circulation Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Transactions: ${transactions.length}`, 14, 38);

    const tableData = transactions.map(t => [
      t.id,
      t.book?.title || t.bookId,
      t.member?.name || t.memberId,
      t.issueDate,
      t.dueDate,
      t.returnDate || 'Not Returned'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'Book', 'Member', 'Issue Date', 'Due Date', 'Return Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [44, 30, 18] }
    });

    doc.save(`library_circulation_${date}.pdf`);
  };

  const handleApproveMember = async (memberId: string) => {
    setIsProcessing(true);
    setProcessingType('update');
    try {
      const res = await fetch('/api/admin/approve-member', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('library_token')}`
        },
        body: JSON.stringify({ memberId })
      });
      if (res.ok) {
        await triggerSuccess(`Member approved successfully!`);
        await fetchAdminData();
      } else {
        const err = await res.json();
        triggerError(err.error || 'Approval failed');
        setLastError(err.error || 'Approval failed');
      }
    } catch (error) {
      setLastError('Connection error');
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    simulateProcessing('login', async () => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('library_token', data.token);
          const userData: User = { 
            ...data.user, 
            isAdmin: data.user.isAdmin,
            role: data.user.isAdmin ? 'admin' : 'member'
          };
          setUser(userData);
          if (userData.isAdmin) {
            setView('admin');
            fetchAdminData();
          } else {
            setView('member');
            fetchMemberData();
          }
          triggerSuccess('Login Successful! Welcome to Smrtisangrahah.');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            setLoginError(errorData.error || 'Invalid credentials');
          } else {
            setLoginError(`Login failed: ${response.status} ${response.statusText}`);
          }
        }
      } catch (error) {
        setLoginError('An unexpected error occurred during login');
        console.error('Login error:', error);
      }
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    simulateProcessing('register', async () => {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupForm),
        });
        if (response.ok) {
          const data = await response.json();
          triggerSuccess(`Registration successful! Member ID: ${data.memberId}. Please wait for admin approval.`);
          setView('landing');
          setSignupForm({ 
            name: '', 
            fatherName: '', 
            address: '', 
            aadhaar: '', 
            mobile: '', 
            email: '', 
            dob: '', 
            joiningDate: new Date().toISOString().split('T')[0],
            photo: null,
            password: ''
          });
        } else {
          const errorData = await response.json();
          triggerError(errorData.error || 'Signup failed');
        }
      } catch (error) {
        triggerError('An unexpected error occurred during signup');
      }
    });
  };

  const handleDemandBook = async (bookId: string) => {
    const token = localStorage.getItem('library_token');
    if (!token) return;

    simulateProcessing('register', async () => {
      try {
        const response = await fetch('/api/member/demand', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ bookId }),
        });
        if (response.ok) {
          await fetchMemberData();
          await triggerSuccess('Book requested successfully!');
        } else {
          const data = await response.json();
          triggerError(data.error || 'Failed to request book');
        }
      } catch (error) {
        console.error('Error demanding book:', error);
      }
    });
  };

  const handleUndemandBook = async (demandId: string) => {
    const token = localStorage.getItem('library_token');
    if (!token) return;

    simulateProcessing('delete', async () => {
      try {
        const response = await fetch('/api/member/undemand', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ demandId }),
        });
        if (response.ok) {
          await fetchMemberData();
          await triggerSuccess('Request cancelled successfully.');
        } else {
          const data = await response.json();
          triggerError(data.error || 'Failed to cancel request');
        }
      } catch (error) {
        console.error('Error undemanding book:', error);
      }
    });
  };

  const handleApproveDemand = async (demandId: string) => {
    const token = localStorage.getItem('library_token');
    if (!token) return;

    simulateProcessing('update', async () => {
      try {
        const response = await fetch('/api/admin/approve-demand', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ demandId }),
        });
        if (response.ok) {
          await fetchAdminData();
          await triggerSuccess('Demand approved and volume issued!');
        } else {
          const data = await response.json();
          triggerError(data.error || 'Failed to approve demand');
        }
      } catch (error) {
        console.error('Error approving demand:', error);
      }
    });
  };
  const handleLogout = () => {
    simulateProcessing('logout', () => {
      localStorage.removeItem('library_token');
      setUser(null);
      setView('landing');
      triggerSuccess('Logged out successfully.');
    });
  };

  // --- Admin Actions ---
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    if (!token) return;
    
    simulateProcessing('register', async () => {
      try {
        const isEdit = modalType === 'editBook';
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `/api/books/${encodeURIComponent(bookForm.id)}` : '/api/books';
        
        const response = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(bookForm),
        });

        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          setBookForm({});
          await triggerSuccess(isEdit ? 'Book details updated successfully!' : 'New book registered successfully!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to save book'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error saving book:', error);
        triggerError('An unexpected error occurred while saving the book.');
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      triggerError('Please upload a PDF file.');
      return;
    }

    if (file.size > 200 * 1024) {
      triggerError('File size must be under 200 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBookForm({ ...bookForm, billData: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    simulateProcessing('register', async () => {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: newCategory }),
        });
        if (response.ok) {
          await fetchAdminData();
          setNewCategory('');
          await triggerSuccess('Category added successfully!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to add category'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error adding category:', error);
        triggerError('An unexpected error occurred while adding the category.');
      }
    });
  };

  const handleDeleteCategory = async (name: string) => {
    const token = localStorage.getItem('library_token');
    simulateProcessing('delete', async () => {
      try {
        const response = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          await fetchAdminData();
          await triggerSuccess('Category removed successfully.');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to delete category'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        triggerError('An unexpected error occurred while deleting the category.');
      }
    });
  };

  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerError('Please upload an image file.');
      return;
    }

    if (file.size > 50 * 1024) {
      triggerError('Photo size must be under 50 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMemberForm({ ...memberForm, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const generateIDCard = (member: Member) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // ID-1 standard size
    });

    // Background
    doc.setFillColor(249, 247, 242);
    doc.rect(0, 0, 85.6, 54, 'F');

    // Header
    doc.setFillColor(44, 30, 18);
    doc.rect(0, 0, 85.6, 12, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(14);
    doc.text('SMRTISANGRAHAH', 42.8, 8, { align: 'center' });

    // Photo
    if (member.photo) {
      // Draw a circular border first
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.8);
      doc.circle(15, 28, 11, 'S');
      
      // Clipping for circular photo
      // Note: jsPDF clipping can be complex, using a simpler approach with a circle mask if needed
      // but standard clip() works in most modern versions
      doc.saveGraphicsState();
      doc.circle(15, 28, 10.5, 'F');
      doc.clip();
      // Zoomed in effect: draw image slightly larger than the circle
      doc.addImage(member.photo, 'JPEG', 3, 16, 24, 24); 
      doc.restoreGraphicsState();
    } else {
      doc.setDrawColor(139, 69, 19);
      doc.setLineWidth(0.5);
      doc.circle(15, 28, 10, 'S');
      doc.setTextColor(139, 69, 19);
      doc.setFontSize(6);
      doc.text('NO PHOTO', 15, 29, { align: 'center' });
    }

    // Member Info
    doc.setTextColor(44, 30, 18);
    doc.setFontSize(10);
    doc.text(member.name, 30, 18);
    
    doc.setFontSize(7);
    doc.setTextColor(139, 69, 19);
    doc.text(`ID: ${member.id}`, 30, 22);
    doc.text(`Father: ${member.fatherName}`, 30, 26);
    doc.text(`DOB: ${member.dob}`, 30, 30);
    doc.text(`Mobile: ${member.mobile}`, 30, 34);
    doc.text(`Aadhaar: ${member.aadhaar}`, 30, 38);
    doc.text(`Email: ${member.email}`, 30, 42);
    
    doc.setFontSize(6);
    doc.text(`Address: ${member.address}`, 30, 46, { maxWidth: 50 });

    // Footer
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 50, 85.6, 4, 'F');
    doc.setTextColor(44, 30, 18);
    doc.setFontSize(6);
    doc.text(`Joined: ${member.joinedDate}`, 42.8, 53, { align: 'center' });

    doc.save(`ID_Card_${member.id.replace(/\//g, '_')}.pdf`);
  };

  const resetMemberForm = () => {
    setMemberForm({
      joinedDate: new Date().toISOString().split('T')[0],
      dob: '',
      photo: null
    });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    simulateProcessing('register', async () => {
      try {
        const response = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(memberForm),
        });
        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          resetMemberForm();
          await triggerSuccess('New member registered successfully!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to add member'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error adding member:', error);
        triggerError('An unexpected error occurred while adding the member.');
      }
    });
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    simulateProcessing('update', async () => {
      try {
        const response = await fetch(`/api/members/${encodeURIComponent(memberForm.id || '')}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(memberForm),
        });
        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          resetMemberForm();
          await triggerSuccess('Member details updated successfully!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to update member'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error updating member:', error);
        triggerError('An unexpected error occurred while updating the member.');
      }
    });
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('library_token');
    simulateProcessing('register', async () => {
      try {
        const response = await fetch('/api/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(issueForm),
        });
        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          setIssueForm({ bookId: '', memberId: '', dueDate: '' });
          await triggerSuccess('Volume issued successfully!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to issue book'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error issuing book:', error);
        triggerError('An unexpected error occurred while issuing the book.');
      }
    });
  };

  const handleReceiveBook = async (transactionId: string) => {
    const token = localStorage.getItem('library_token');
    simulateProcessing('update', async () => {
      try {
        const response = await fetch(`/api/receive/${transactionId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          await fetchAdminData();
          await triggerSuccess('Volume received and catalog updated!');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to receive book'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error receiving book:', error);
        triggerError('An unexpected error occurred while receiving the book.');
      }
    });
  };

  const handleDeleteBook = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('library_token');
    simulateProcessing('delete', async () => {
      try {
        const response = await fetch(`/api/books/${encodeURIComponent(itemToDelete)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          await fetchAdminData();
          setIsModalOpen(false);
          setItemToDelete(null);
          await triggerSuccess('Book record removed successfully.');
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            triggerError(`Error: ${errorData.error || 'Failed to delete book'}`);
          } else {
            const errorText = await response.text();
            triggerError(`Error: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
          }
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        triggerError('An unexpected error occurred while deleting the book.');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2c1e12] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed] selection:bg-[#d4af37]/30 selection:text-[#2c1e12]">
      {view !== 'admin' && <Navbar user={user} setView={setView} />}
      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage setView={setView} />
            </motion.div>
          )}
          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage 
                loginForm={loginForm} 
                setLoginForm={setLoginForm} 
                handleLogin={handleLogin} 
                loginError={loginError} 
                isProcessing={isProcessing} 
                setView={setView}
              />
            </motion.div>
          )}
          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel 
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                user={user}
                books={books}
                members={members}
                transactions={transactions}
                categories={categories}
                gifts={gifts}
                demands={demands}
                isProcessing={isProcessing}
                processingType={processingType || ''}
                handleLogout={handleLogout}
                handleApproveMember={handleApproveMember}
                handleApproveDemand={handleApproveDemand}
                handleDeleteCategory={handleDeleteCategory}
                handleReceiveBook={handleReceiveBook}
                setModalType={setModalType}
                setIsModalOpen={setIsModalOpen}
                setBookForm={setBookForm}
                setMemberForm={setMemberForm}
                setItemToDelete={setItemToDelete}
                setSecurityForm={setSecurityForm}
                securityForm={securityForm}
                handleUpdateAccount={handleUpdateAccount}
                giftForm={giftForm}
                setGiftForm={setGiftForm}
                handleGiftBook={handleGiftBook}
                exportInventoryPDF={exportInventoryPDF}
                exportMembersPDF={exportMembersPDF}
                exportCirculationPDF={exportCirculationPDF}
                generateIDCard={generateIDCard}
                bookSearchQuery={bookSearchQuery}
                setBookSearchQuery={setBookSearchQuery}
                memberSearchQuery={memberSearchQuery}
                setMemberSearchQuery={setMemberSearchQuery}
                handleAddCategory={handleAddCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                setSelectedBill={setSelectedBill}
              />
            </motion.div>
          )}
          {view === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SignupPage 
                signupForm={signupForm}
                setSignupForm={setSignupForm}
                handleSignup={handleSignup}
                handlePhotoChange={handlePhotoChange}
                setView={setView}
              />
            </motion.div>
          )}
          {view === 'member' && (
            <motion.div
              key="member"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MemberPanel 
                memberTab={memberTab}
                setMemberTab={setMemberTab}
                user={user}
                books={books}
                handleLogout={handleLogout}
                handleDemandBook={handleDemandBook}
                handleUndemandBook={handleUndemandBook}
                memberDemands={memberDemands}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#2c1e12]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-[#f5f2ed] w-full max-w-lg rounded-sm p-10 shadow-2xl border-t-8 border-[#d4af37] font-serif"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-[#8b4513]/10 rounded-full transition-colors text-[#8b4513]"
              >
                <X className="w-5 h-5" />
              </button>

              {(modalType === 'addBook' || modalType === 'editBook') && (
                <form onSubmit={handleAddBook} className="space-y-6 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide relative">
                  {/* Decorative Graphic */}
                  <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                    <Scroll className="w-40 h-40 text-[#8b4513]" />
                  </div>

                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-8 border-b-2 border-[#d4af37]/30 pb-4 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-[#d4af37]" />
                    <span>
                      {modalType === 'editBook' ? 'ग्रन्थ संशोधनम् [Edit Volume]' : 'नवीन ग्रन्थ पञ्जीकरणम् [Add New Volume]'}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">शीर्षकम् [Book Title]</label>
                      <input 
                        required 
                        className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" 
                        value={bookForm.title || ''}
                        onChange={e => setBookForm({...bookForm, title: e.target.value})} 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">लेखकः [Author Name]</label>
                        <input 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={bookForm.author || ''}
                          onChange={e => setBookForm({...bookForm, author: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">प्रकाशकः [Publisher's Details]</label>
                        <input 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={bookForm.publisher || ''}
                          onChange={e => setBookForm({...bookForm, publisher: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">वर्गः [Category]</label>
                        <div className="relative">
                          <select 
                            required 
                            className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] appearance-none transition-colors"
                            value={bookForm.category || ''}
                            onChange={e => setBookForm({...bookForm, category: e.target.value})}
                          >
                            <option value="">Select Category...</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                          <Bookmark className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/30 pointer-events-none" />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">पञ्जीकरण वर्षम् [Registration Year]</label>
                        <input 
                          type="number" 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={bookForm.regYear || new Date().getFullYear()}
                          onChange={e => setBookForm({...bookForm, regYear: parseInt(e.target.value)})} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">प्रकाशन वर्षम् [Publication Year]</label>
                        <input 
                          type="number" 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={bookForm.year || ''}
                          onChange={e => setBookForm({...bookForm, year: parseInt(e.target.value)})} 
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            id="isGift" 
                            className="w-6 h-6 accent-[#2c1e12] cursor-pointer" 
                            checked={bookForm.isGift || false}
                            onChange={e => setBookForm({...bookForm, isGift: e.target.checked})} 
                          />
                        </div>
                        <label htmlFor="isGift" className="text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold cursor-pointer">उपहारः [Gifted Volume]</label>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">क्रय-विपत्रम् [Purchase Bill - PDF max 200KB]</label>
                      <div className="border-2 border-dashed border-[#8b4513]/20 p-4 bg-[#f9f7f2] hover:border-[#d4af37] transition-colors relative">
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          onChange={handleFileUpload}
                        />
                        <div className="flex items-center justify-center gap-3 text-[#8b4513]/60">
                          <History className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {bookForm.billData ? 'विपत्रं संलग्न् [Bill Attached]' : 'विपत्रं चिन्वान्तु [Choose PDF]'}
                          </span>
                        </div>
                      </div>
                      {bookForm.billData && <p className="text-[10px] text-[#556b2f] mt-2 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> विपत्रं सफलतया संलग्न् [Bill successfully attached]</p>}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">विवरणम् [Description]</label>
                      <textarea 
                        required 
                        className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] h-28 resize-none transition-colors" 
                        value={bookForm.description || ''}
                        onChange={e => setBookForm({...bookForm, description: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-[#2c1e12] text-[#d4af37] py-5 text-sm uppercase tracking-[0.4em] font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-[#3d2b1a] active:scale-[0.98] transition-all border border-[#d4af37]/30"
                    >
                      {modalType === 'editBook' ? 'संशोधनं रक्षतु [Save Changes]' : 'ग्रन्थं पञ्जीकरोतु [Register Volume]'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'confirmDeleteBook' && (
                <div className="text-center py-10">
                  <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
                    <Trash2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-4">ग्रन्थं निष्कासयितुं निश्चितम्?</h3>
                  <p className="text-[#8b4513] text-sm uppercase tracking-widest font-bold mb-10">
                    [Are you sure you want to delete this volume?]
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-2 border-[#8b4513]/20 text-[#8b4513] py-5 text-xs uppercase tracking-widest font-bold hover:bg-[#8b4513]/5 transition-all active:scale-95"
                    >
                      निरस्तं करोतु [Cancel]
                    </button>
                    <button 
                      onClick={handleDeleteBook}
                      className="flex-1 bg-red-700 text-white py-5 text-xs uppercase tracking-widest font-bold hover:bg-red-800 transition-all shadow-lg active:scale-95"
                    >
                      निश्चितं निष्कासयतु [Confirm Delete]
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'confirmDeleteMember' && (
                <div className="text-center py-10">
                  <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
                    <Trash2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-4">सदस्यं निष्कासयितुं निश्चितम्?</h3>
                  <p className="text-[#8b4513] text-sm uppercase tracking-widest font-bold mb-10">
                    [Are you sure you want to delete this member?]
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-2 border-[#8b4513]/20 text-[#8b4513] py-5 text-xs uppercase tracking-widest font-bold hover:bg-[#8b4513]/5 transition-all active:scale-95"
                    >
                      निरस्तं करोतु [Cancel]
                    </button>
                    <button 
                      onClick={handleDeleteMember}
                      className="flex-1 bg-red-700 text-white py-5 text-xs uppercase tracking-widest font-bold hover:bg-red-800 transition-all shadow-lg active:scale-95"
                    >
                      निश्चितं निष्कासयतु [Confirm Delete]
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'addMember' || modalType === 'editMember') && (
                <form onSubmit={modalType === 'addMember' ? handleAddMember : handleEditMember} className="space-y-8 relative">
                  <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                    <UserPlus className="w-40 h-40 text-[#8b4513]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-8 border-b-2 border-[#d4af37]/30 pb-4 flex items-center gap-3">
                    <Users className="w-8 h-8 text-[#d4af37]" />
                    <span>{modalType === 'addMember' ? 'नवीन सदस्य पञ्जीकरणम् [New Member Registration]' : 'सदस्य संशोधनम् [Edit Member]'}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">पूर्णनाम [Full Name]</label>
                        <input 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.name || ''}
                          onChange={e => setMemberForm({...memberForm, name: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">पितुः नाम [Father's Name]</label>
                        <input 
                          required 
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.fatherName || ''}
                          onChange={e => setMemberForm({...memberForm, fatherName: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">जन्म तिथि [Date of Birth]</label>
                        <input 
                          required 
                          type="date"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.dob || ''}
                          onChange={e => setMemberForm({...memberForm, dob: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">आधार सङ्ख्या [Aadhaar: XXXX - XXXX - XXXX]</label>
                        <input 
                          required 
                          placeholder="XXXX - XXXX - XXXX"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.aadhaar || ''}
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '').substring(0, 12);
                            let formatted = val.match(/.{1,4}/g)?.join(' - ') || val;
                            setMemberForm({...memberForm, aadhaar: formatted});
                          }} 
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">भ्रमणभाष सङ्ख्या [Mobile: +91 - XXXXXXXXXX]</label>
                        <input 
                          required 
                          placeholder="+91 - XXXXXXXXXX"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.mobile || ''}
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.startsWith('91')) val = val.substring(2);
                            val = val.substring(0, 10);
                            let formatted = val ? `+91 - ${val}` : '';
                            setMemberForm({...memberForm, mobile: formatted});
                          }} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">ई-पत्रम् [Email ID]</label>
                        <input 
                          required 
                          type="email"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.email || ''}
                          onChange={e => setMemberForm({...memberForm, email: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">प्रवेश तिथि [Joining Date]</label>
                        <input 
                          required 
                          type="date"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors" 
                          value={memberForm.joinedDate || ''}
                          onChange={e => setMemberForm({...memberForm, joinedDate: e.target.value})} 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">सदस्य चित्रम् [Member Photo - Max 50KB]</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 border-2 border-[#8b4513]/10 bg-[#f9f7f2] flex items-center justify-center overflow-hidden">
                            {memberForm.photo ? (
                              <img src={memberForm.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Users className="w-8 h-8 text-[#8b4513]/20" />
                            )}
                          </div>
                          <div className="flex-1 relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              onChange={handleMemberPhotoUpload}
                            />
                            <div className="border-2 border-dashed border-[#8b4513]/20 p-3 text-center text-[10px] uppercase tracking-widest font-bold text-[#8b4513]/60 hover:border-[#d4af37] transition-colors">
                              {memberForm.photo ? 'चित्रं परिवर्तितम् [Change Photo]' : 'चित्रं चिन्वान्तु [Choose Photo]'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">सङ्केतः [Address with Pin Code]</label>
                    <textarea 
                      required 
                      className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] h-24 resize-none transition-colors" 
                      value={memberForm.address || ''}
                      onChange={e => setMemberForm({...memberForm, address: e.target.value})} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#2c1e12] text-[#d4af37] py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all shadow-lg"
                  >
                    {modalType === 'addMember' ? 'पञ्जीकरणं करोतु [Register Member]' : 'परिवर्तनं रक्षतु [Save Changes]'}
                  </button>
                </form>
              )}

              {modalType === 'issueBook' && (
                <form onSubmit={handleIssueBook} className="space-y-8 relative">
                  <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                    <ArrowRightLeft className="w-40 h-40 text-[#8b4513]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-8 border-b-2 border-[#d4af37]/30 pb-4 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-[#d4af37]" />
                    <span>ग्रन्थ निर्गमनम् [Issue Volume]</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">ग्रन्थ पञ्जीकरण सङ्ख्या [Book Registration ID]</label>
                      <div className="relative">
                        <input 
                          type="text"
                          required 
                          placeholder="Enter Book ID (e.g. SMR/CAT/2026/1)"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all" 
                          value={issueForm.bookId}
                          onChange={e => setIssueForm({...issueForm, bookId: e.target.value})}
                        />
                        <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/30 pointer-events-none" />
                      </div>
                      {issueForm.bookId && (
                        <div className="mt-2 text-xs font-bold">
                          {books.find(b => b.id === issueForm.bookId) ? (
                            <span className="text-green-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Volume Found: {books.find(b => b.id === issueForm.bookId)?.title}
                              {books.find(b => b.id === issueForm.bookId)?.status === 'Borrowed' && (
                                <span className="text-red-600 ml-2">(Already Borrowed!)</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-red-500">Volume not found with this ID</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">सदस्य सङ्ख्या [Member ID]</label>
                      <div className="relative">
                        <input 
                          type="text"
                          required 
                          placeholder="Enter Member ID (e.g. SMR/MEM/2026/1)"
                          className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all" 
                          value={issueForm.memberId}
                          onChange={e => setIssueForm({...issueForm, memberId: e.target.value})}
                        />
                        <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/30 pointer-events-none" />
                      </div>
                      {issueForm.memberId && (
                        <div className="mt-2 text-xs font-bold">
                          {members.find(m => m.id === issueForm.memberId) ? (
                            <span className="text-green-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Member Found: {members.find(m => m.id === issueForm.memberId)?.name}
                            </span>
                          ) : (
                            <span className="text-red-500">Member not found with this ID</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-[#8b4513] font-sans font-bold mb-2 group-focus-within:text-[#d4af37] transition-colors">अन्तिमतिथिः [Due Date]</label>
                      <input 
                        type="date" 
                        required 
                        className="w-full bg-white border-2 border-[#8b4513]/10 px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all" 
                        value={issueForm.dueDate}
                        onChange={e => setIssueForm({...issueForm, dueDate: e.target.value})} 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!books.find(b => b.id === issueForm.bookId && b.status === 'Available') || !members.find(m => m.id === issueForm.memberId)}
                    className="w-full bg-[#2c1e12] text-[#d4af37] py-5 text-sm uppercase tracking-[0.4em] font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-[#3d2b1a] active:scale-[0.98] transition-all border border-[#d4af37]/30 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    निर्गमनं पुष्टयतु [Confirm Issue]
                  </button>
                </form>
              )}

              {modalType === 'viewBill' && selectedBill && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-[#2c1e12] mb-8 border-b-2 border-[#d4af37]/30 pb-4 flex items-center gap-3">
                    <History className="w-8 h-8 text-[#d4af37]" />
                    <span>क्रय-विपत्रम् [Purchase Bill]</span>
                  </h3>
                  <div className="w-full aspect-[3/4] bg-zinc-100 rounded-sm overflow-hidden border-2 border-[#8b4513]/10">
                    {billBlobUrl ? (
                      <object 
                        data={billBlobUrl} 
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white">
                          <p className="text-[#8b4513] font-bold mb-4">विपत्रं प्रदर्शयितुं न शक्यते [Cannot display bill directly]</p>
                          <a 
                            href={billBlobUrl} 
                            download="bill.pdf"
                            className="bg-[#556b2f] text-white px-6 py-3 rounded-sm font-bold flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            अधोभारं कृत्वा पश्यन्तु [Download to View]
                          </a>
                        </div>
                      </object>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8b4513]/40">
                        <div className="animate-pulse">विपत्रं सज्जीक्रियते [Preparing Bill...]</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {billBlobUrl && (
                      <a 
                        href={billBlobUrl} 
                        download="bill.pdf"
                        className="flex-1 bg-[#556b2f] text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#4a5d29] transition-all text-center flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        अधोभारं करोतु [Download]
                      </a>
                    )}
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-[#2c1e12] text-[#d4af37] py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#3d2b1a] transition-all"
                    >
                      पिधानं करोतु [Close]
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#2c1e12] flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mb-8"
            >
              <Scroll className="w-24 h-24 text-[#d4af37]" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-[#f5f2ed] text-3xl font-serif font-bold tracking-widest mb-4 uppercase">
                {processingType === 'login' && 'प्रवेशः क्रियते [Logging In...]'}
                {processingType === 'logout' && 'निर्गमनं क्रियते [Logging Out...]'}
                {processingType === 'register' && 'पञ्जीकरणं क्रियते [Registering...]'}
                {processingType === 'delete' && 'निष्कासनं क्रियते [Deleting...]'}
                {processingType === 'update' && 'परिवर्तनं क्रियते [Updating...]'}
              </h2>
              <div className="w-48 h-1 bg-[#d4af37]/20 mx-auto rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full bg-[#d4af37]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-[#f5f2ed] border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-8 py-4 rounded-sm flex items-center gap-4 min-w-[300px]"
          >
            <div className="bg-[#556b2f] p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[#2c1e12] font-bold text-sm uppercase tracking-wider">{successMessage}</p>
              <p className="text-[#8b4513] text-[10px] uppercase tracking-widest font-medium">सफलं जातम् [Success]</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant 
        appState={{
          booksCount: books.length,
          membersCount: members.length,
          categoriesCount: categories.length,
          lastError: lastError,
          currentView: adminTab
        }}
      />

      {/* Footer */}
      <footer className="bg-[#2c1e12] border-t border-[#d4af37]/20 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10">
            <div className="flex items-center gap-4">
              <Scroll className="w-8 h-8 text-[#d4af37]" />
              <div>
                <span className="text-[#f5f2ed] text-xl font-serif font-bold tracking-widest block">स्मृतिसंग्रहः</span>
                <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Smrtisangrahah</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#f5f2ed]/40 text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-2">स्मृतिपथस्य आरम्भः</p>
              <p className="text-[#f5f2ed]/20 text-[10px] uppercase tracking-widest font-sans">Collection of Wisdom &copy; 2026</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#d4af37]/10 flex justify-center gap-10">
            <a href="#" className="text-[#f5f2ed]/40 hover:text-[#d4af37] text-[10px] uppercase tracking-widest transition-colors font-bold">Privacy</a>
            <a href="#" className="text-[#f5f2ed]/40 hover:text-[#d4af37] text-[10px] uppercase tracking-widest transition-colors font-bold">Terms</a>
            <a href="#" className="text-[#f5f2ed]/40 hover:text-[#d4af37] text-[10px] uppercase tracking-widest transition-colors font-bold">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
