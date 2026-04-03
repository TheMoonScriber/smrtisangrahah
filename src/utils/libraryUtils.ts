import { Book, Transaction } from '../types';

export const getBookStatus = (bookId: string, books: Book[], transactions: Transaction[]) => {
  const book = books.find(b => b.id === bookId);
  if (book?.status === 'Gifted') return { label: 'Gifted [उपहारः]', color: 'text-purple-600', bg: 'bg-purple-50' };

  const bookTransactions = transactions.filter(t => t.bookId === bookId);
  if (bookTransactions.length === 0) return { label: 'In Catalog [संग्रहे अस्ति]', color: 'text-green-600', bg: 'bg-green-50' };
  
  const latest = [...bookTransactions].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];
  
  if (latest.returnDate) return { label: 'Returned [निवर्तितम्]', color: 'text-blue-600', bg: 'bg-blue-50' };
  
  const today = new Date().toISOString().split('T')[0];
  if (latest.dueDate < today) return { label: 'Overdue [कालातीतम्]', color: 'text-red-600', bg: 'bg-red-50' };
  
  return { label: 'Issued [निर्गमितम्]', color: 'text-orange-600', bg: 'bg-orange-50' };
};
