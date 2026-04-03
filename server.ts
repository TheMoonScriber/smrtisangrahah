import express from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'smrtisangrahah_secret_key_2026';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Rate limiters
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
  const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });

  app.use('/api/login', authLimiter);
  app.use('/api/signup', authLimiter);
  app.use('/api/', apiLimiter);

  app.use(express.json({ limit: '2mb' }));

  // Mock Database
  let categories = ["Philosophy", "Strategy", "Poetry", "Fiction", "History", "Science"];
  
  let books = [
    { 
      id: "SMR/PHILOSOPHY/2024/1", 
      title: "The Republic", 
      author: "Plato", 
      publisher: "Ancient Press",
      category: "Philosophy", 
      year: -375, 
      regYear: 2024,
      status: "Available", 
      description: "A Socratic dialogue concerning justice, the order and character of the just city-state, and the just man.", 
      isGift: false,
      billData: null 
    },
    { 
      id: "SMR/PHILOSOPHY/2024/2", 
      title: "Meditations", 
      author: "Marcus Aurelius", 
      publisher: "Stoic House",
      category: "Philosophy", 
      year: 180, 
      regYear: 2024,
      status: "Borrowed", 
      description: "A series of personal writings by the Roman Emperor, recording his private notes to himself and ideas on Stoic philosophy.", 
      isGift: true,
      billData: null 
    },
  ];

  let members = [
    { 
      id: "SMR/MEM/2024/1", 
      name: "Dharma Deva", 
      fatherName: "Brahma Deva",
      address: "Varanasi, UP - 221001",
      aadhaar: "1234 - 5678 - 9012",
      mobile: "+91 - 9876543210",
      email: "dharma@wisdom.org", 
      joinedDate: "2024-01-15",
      dob: "1990-05-20",
      photo: null,
      status: 'approved',
      password: 'password123'
    },
    { 
      id: "SMR/MEM/2024/2", 
      name: "Saraswati Devi", 
      fatherName: "Vishnu Deva",
      address: "Prayagraj, UP - 211001",
      aadhaar: "9876 - 5432 - 1098",
      mobile: "+91 - 9123456789",
      email: "saraswati@knowledge.edu", 
      joinedDate: "2024-02-20",
      dob: "1995-08-15",
      photo: null,
      status: 'approved',
      password: 'password123'
    },
  ];

  let transactions = [
    { id: "T1001", bookId: "SMR/PHILOSOPHY/2024/2", memberId: "M1001", issueDate: "2024-03-10", dueDate: "2024-03-24", returnDate: null },
  ];

  let gifts = [
    { id: "G1001", bookId: "SMR/PHILOSOPHY/2024/1", memberId: "SMR/MEM/2024/1", giftDate: "2024-03-15" }
  ];

  let demands = [
    { id: "D1001", bookId: "SMR/PHILOSOPHY/2024/1", memberId: "SMR/MEM/2024/2", status: "pending", requestDate: "2024-03-18" }
  ];

  let adminUser = { username: 'admin', password: 'admin123', isAdmin: true };

  // Auth Middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/login", (req, res) => {
    const { username, password, type } = req.body;
    
    if (type === 'admin') {
      if (username === adminUser.username && password === adminUser.password) {
        const user = { username: adminUser.username, isAdmin: true };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ user, token });
      }
    } else {
      const member = members.find(m => m.id === username && m.password === password && m.status === 'approved');
      if (member) {
        const user = { username: member.name, id: member.id, isAdmin: false };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ user, token });
      }
    }
    res.status(401).json({ error: "Invalid credentials or account not approved" });
  });

  app.post("/api/signup", (req, res) => {
    const { name, fatherName, address, aadhaar, mobile, email, dob, photo, password, joiningDate } = req.body;
    
    // Check if email already exists
    if (members.some(m => m.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const year = new Date().getFullYear();
    const membersInYear = members.filter(m => m.id.startsWith(`SMR/MEM/${year}/`));
    const nextNum = membersInYear.length + 1;
    const id = `SMR/MEM/${year}/${nextNum}`;

    const newMember = { 
      id,
      name,
      fatherName,
      address,
      aadhaar,
      mobile,
      email,
      photo: photo || null,
      dob,
      joinedDate: joiningDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      password: password || '' 
    };
    members.push(newMember);
    res.status(201).json({ message: "Registration successful. Please wait for admin approval.", memberId: id });
  });

  app.post("/api/admin/approve-member", requireAuth, (req, res) => {
    const { memberId } = req.body;
    const index = members.findIndex(m => m.id === memberId);
    
    if (index === -1) return res.status(404).json({ error: "Member not found" });
    
    members[index].status = 'approved';
    
    res.json({ message: "Member approved successfully", memberId: members[index].id });
  });

  app.get("/api/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      res.json({ user: decoded });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.put("/api/admin/account", requireAuth, (req, res) => {
    const { username, password } = req.body;
    
    if (!username && !password) {
      return res.status(400).json({ error: "No update data provided" });
    }

    if (username && username.trim() !== "") {
      adminUser.username = username.trim();
    }
    
    if (password && password.trim() !== "") {
      adminUser.password = password;
    }
    
    console.log(`Admin account updated: ${adminUser.username}`);
    res.json({ message: "Account updated successfully", username: adminUser.username });
  });

  // --- Category Routes ---
  app.get("/api/categories", requireAuth, (req, res) => {
    res.json(categories);
  });

  app.post("/api/categories", requireAuth, (req, res) => {
    const { name } = req.body;
    if (name && !categories.includes(name)) {
      categories.push(name);
      res.status(201).json(name);
    } else {
      res.status(400).json({ error: "Invalid or duplicate category" });
    }
  });

  app.delete("/api/categories/:name", requireAuth, (req, res) => {
    const { name } = req.params;
    categories = categories.filter(c => c !== name);
    res.status(204).send();
  });

  // --- Book Routes ---
  app.get("/api/books", requireAuth, (req, res) => {
    res.json(books);
  });

  const generateBookId = (category: string, regYear: number) => {
    const catUpper = (category || "OTHER").toUpperCase();
    const yearStr = regYear || new Date().getFullYear();
    const count = books.filter(b => b.category === category && b.regYear === regYear).length + 1;
    return `SMR/${catUpper}/${yearStr}/${count}`;
  };

  app.post("/api/books", requireAuth, (req, res) => {
    const { title, author, publisher, category, year, regYear, description, isGift, billData } = req.body;
    
    const yearInt = parseInt(regYear) || new Date().getFullYear();
    const customId = generateBookId(category, yearInt);

    const newBook = { 
      id: customId,
      title,
      author,
      publisher,
      category,
      year,
      regYear: yearInt,
      status: 'Available', 
      description,
      isGift: isGift || false,
      billData: billData || null
    };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      const oldBook = books[index];
      const updatedData = req.body;
      
      // Check if category or regYear changed to update ID
      let newId = id;
      const categoryChanged = updatedData.category && updatedData.category !== oldBook.category;
      const yearChanged = updatedData.regYear && parseInt(updatedData.regYear) !== oldBook.regYear;
      
      if (categoryChanged || yearChanged) {
        const newCategory = updatedData.category || oldBook.category;
        const newYear = parseInt(updatedData.regYear) || oldBook.regYear;
        newId = generateBookId(newCategory, newYear);
        
        // Update transactions referencing this book
        transactions.forEach(t => {
          if (t.bookId === id) t.bookId = newId;
        });
      }

      books[index] = { 
        ...oldBook, 
        ...updatedData, 
        id: newId,
        regYear: updatedData.regYear ? parseInt(updatedData.regYear) : oldBook.regYear 
      };
      res.json(books[index]);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });

  app.delete("/api/books/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    books = books.filter(b => b.id !== id);
    res.status(204).send();
  });

  // --- Member Routes ---
  app.get("/api/admin/members", requireAuth, (req, res) => {
    res.json(members);
  });

  app.post("/api/admin/members", requireAuth, (req, res) => {
    const { name, fatherName, address, aadhaar, mobile, email, photo, dob, joinedDate } = req.body;
    
    // Generate ID: SMR/MEM/YYYY/N
    const year = new Date().getFullYear();
    const membersInYear = members.filter(m => m.id.startsWith(`SMR/MEM/${year}/`));
    const nextNum = membersInYear.length + 1;
    const id = `SMR/MEM/${year}/${nextNum}`;

    const newMember = { 
      id,
      name,
      fatherName,
      address,
      aadhaar,
      mobile,
      email,
      photo: photo || null,
      dob,
      joinedDate: joinedDate || new Date().toISOString().split('T')[0],
      status: 'approved',
      password: 'password123'
    };
    members.push(newMember);
    res.status(201).json(newMember);
  });

  app.put("/api/admin/members/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...req.body };
      res.json(members[index]);
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  });

  app.delete("/api/admin/members/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    members = members.filter(m => m.id !== id);
    res.status(204).send();
  });

  app.get("/api/admin/demands", requireAuth, (req, res) => {
    const enriched = demands.map(d => ({
      ...d,
      book: books.find(b => b.id === d.bookId),
      member: members.find(m => m.id === d.memberId)
    }));
    res.json(enriched);
  });

  app.post("/api/admin/approve-demand", requireAuth, (req, res) => {
    const { demandId } = req.body;
    const dIndex = demands.findIndex(d => d.id === demandId);
    if (dIndex === -1) return res.status(404).json({ error: "Demand not found" });

    const demand = demands[dIndex];
    const bookIndex = books.findIndex(b => b.id === demand.bookId);
    if (bookIndex === -1 || books[bookIndex].status !== 'Available') {
      return res.status(400).json({ error: "Book not available" });
    }

    // Update demand
    demand.status = 'approved';

    // Issue book
    books[bookIndex].status = 'Borrowed';

    // Create transaction
    const newTransaction = {
      id: `T${Date.now()}`,
      bookId: demand.bookId,
      memberId: demand.memberId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days
      returnDate: null
    };
    transactions.push(newTransaction);

    res.json({ demand, transaction: newTransaction });
  });

  // --- Transaction Routes (Issue/Receive) ---
  app.get("/api/transactions", requireAuth, (req, res) => {
    const enriched = transactions.map(t => ({
      ...t,
      book: books.find(b => b.id === t.bookId),
      member: members.find(m => m.id === t.memberId)
    }));
    res.json(enriched);
  });

  app.post("/api/issue", requireAuth, (req, res) => {
    const { bookId, memberId, dueDate } = req.body;
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1 || books[bookIndex].status !== 'Available') {
      return res.status(400).json({ error: "Book not available" });
    }

    const newTransaction = {
      id: `T${Date.now()}`,
      bookId,
      memberId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      returnDate: null
    };

    books[bookIndex].status = 'Borrowed';
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  });

  app.post("/api/receive/:transactionId", requireAuth, (req, res) => {
    const { transactionId } = req.params;
    const tIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (tIndex === -1) return res.status(404).json({ error: "Transaction not found" });
    
    const transaction = transactions[tIndex];
    const bookIndex = books.findIndex(b => b.id === transaction.bookId);
    
    transaction.returnDate = new Date().toISOString().split('T')[0];
    if (bookIndex !== -1) books[bookIndex].status = 'Available';
    
    res.json(transaction);
  });

  // --- Gifting Routes ---
  app.get("/api/gifts", requireAuth, (req, res) => {
    const enriched = gifts.map(g => ({
      ...g,
      book: books.find(b => b.id === g.bookId),
      member: members.find(m => m.id === g.memberId)
    }));
    res.json(enriched);
  });

  app.post("/api/gift", requireAuth, (req, res) => {
    const { bookId, memberId } = req.body;
    const bookIndex = books.findIndex(b => b.id === bookId);
    const memberExists = members.some(m => m.id === memberId);

    if (bookIndex === -1) return res.status(404).json({ error: "Book not found" });
    if (!memberExists) return res.status(404).json({ error: "Member not found" });
    if (books[bookIndex].status !== 'Available') {
      return res.status(400).json({ error: "Book not available for gifting" });
    }

    const newGift = {
      id: `G${Date.now()}`,
      bookId,
      memberId,
      giftDate: new Date().toISOString().split('T')[0]
    };

    books[bookIndex].status = 'Gifted';
    gifts.push(newGift);
    res.status(201).json(newGift);
  });

  // --- Member Auth & Portal Routes ---
  app.post("/api/member/login", (req, res) => {
    const { id, password } = req.body;
    const member = members.find(m => m.id === id && m.password === password);
    
    if (member) {
      if (member.status !== 'approved') {
        return res.status(403).json({ error: "Your account is pending approval" });
      }
      const token = jwt.sign({ id: member.id, role: 'member' }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: member });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/member/me", requireAuth, (req, res) => {
    const member = members.find(m => m.id === (req as any).user.id);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  });

  app.get("/api/member/demands", requireAuth, (req, res) => {
    const memberId = (req as any).user.id;
    const memberDemands = demands.filter(d => d.memberId === memberId).map(d => ({
      ...d,
      book: books.find(b => b.id === d.bookId)
    }));
    res.json(memberDemands);
  });

  app.post("/api/member/demand", requireAuth, (req, res) => {
    const { bookId } = req.body;
    const memberId = (req as any).user.id;
    
    const book = books.find(b => b.id === bookId);
    if (!book || book.status !== 'Available') {
      return res.status(400).json({ error: "Book not available" });
    }

    const newDemand = {
      id: `D${Date.now()}`,
      bookId,
      memberId,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    demands.push(newDemand);
    res.status(201).json(newDemand);
  });

  app.post("/api/member/undemand", requireAuth, (req, res) => {
    const { demandId } = req.body;
    const memberId = (req as any).user.id;
    
    const index = demands.findIndex(d => d.id === demandId && d.memberId === memberId && d.status === 'pending');
    if (index !== -1) {
      demands.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Demand not found or cannot be cancelled" });
    }
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
