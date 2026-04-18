# Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start the Server
```bash
npm run dev
```

You should see:
```
============================================================
🚀 Smrtisangrahah Server Started Successfully!
============================================================
📍 Local:            http://localhost:3000
🌐 Network:          http://0.0.0.0:3000
❤️  Health Check:     http://localhost:3000/api/health
============================================================
```

### 3️⃣ Open Your Browser

Go to: **http://localhost:3000**

## Default Login

**Admin:**
- Username: `admin`
- Password: `admin123`

## What's Next?

✅ **The app is ready to use!** The GEMINI_API_KEY is optional - only needed for AI features.

- 📖 Add books to your library
- 👥 Register members
- 🔄 Issue and return books
- 📊 Track transactions
- 🎁 Gift books to members

## Need Help?

- ❗ Server not starting? → See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 📚 Full documentation → See [README.md](README.md)
- 🤖 Want AI features? → Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Quick Checks

**Is the server running?**
```bash
curl http://localhost:3000/api/health
```

**Check what's using port 3000:**
```bash
# Mac/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**Use a different port:**
```bash
PORT=3001 npm run dev
```

---

That's it! You're ready to manage your library. 🎉
