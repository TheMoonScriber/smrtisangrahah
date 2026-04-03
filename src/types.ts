export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  year: number;
  regYear: number;
  status: 'Available' | 'Borrowed' | 'Gifted';
  description: string;
  isGift: boolean;
  billData: string | null;
}

export interface Member {
  id: string;
  name: string;
  fatherName: string;
  address: string;
  aadhaar: string;
  mobile: string;
  email: string;
  photo: string | null;
  joinedDate: string;
  dob: string;
  status: 'pending' | 'approved';
  password?: string;
}

export interface Demand {
  id: string;
  bookId: string;
  memberId: string;
  status: 'pending' | 'approved';
  date: string;
  book?: Book;
  member?: Member;
  bookTitle?: string;
  requestDate?: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  book?: Book;
  member?: Member;
}

export interface GiftRecord {
  id: string;
  bookId: string;
  memberId: string;
  giftDate: string;
  book?: Book;
  member?: Member;
}

export interface User {
  id?: string;
  username?: string;
  name?: string;
  role: 'admin' | 'member';
  isAdmin: boolean;
  status?: string;
  joinedDate?: string;
}