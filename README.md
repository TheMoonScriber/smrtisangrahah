<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# स्मृतिसंग्रहः (Smrtisangrahah) - Library Management System

A comprehensive library management system with AI-powered assistance built with React, Express, and Google Gemini AI.

**📖 [Quick Start Guide](QUICKSTART.md)** | **❗ [Troubleshooting](TROUBLESHOOTING.md)**

View your app in AI Studio: https://ai.studio/apps/366b6aec-4e38-4b77-b483-5e6b2fef7924

## 🚀 Quick Start

**Prerequisites:** Node.js v18 or higher

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheMoonScriber/smrtisangrahah.git
   cd smrtisangrahah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (Optional - AI features only)
   
   A default `.env` file is already included. To enable AI features, add your Gemini API key:
   ```bash
   # Edit .env file and add your API key
   GEMINI_API_KEY="your-api-key-here"
   ```
   
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and go to: **http://localhost:3000**

## 🔑 Default Credentials

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**Member Access:**
- Register through the member portal
- Wait for admin approval
- Login with your assigned Member ID

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts

## 🏥 Health Check

Test if the server is running:
```bash
curl http://localhost:3000/api/health
```

## ❗ Troubleshooting

If you're experiencing issues with localhost not working, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

**Common issues:**
- Port 3000 already in use → Kill the process or use `PORT=3001 npm run dev`
- Missing dependencies → Run `npm install`
- Can't connect → Check firewall settings
- Blank page → Clear browser cache or try incognito mode

## 📁 Project Structure

```
smrtisangrahah/
├── src/              # React frontend source
├── server.ts         # Express backend server
├── .env              # Environment configuration
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## 🌐 Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## 📚 Features

- 📖 Book management with categories
- 👥 Member registration and management
- 🔄 Book issuing and returns
- 🎁 Gift book tracking
- 📊 Transaction history
- 🤖 AI-powered assistant (optional)
- 🔐 Secure authentication with JWT
- ⚡ Rate limiting for API protection

## 🛠️ Technology Stack

- **Frontend:** React 19, Tailwind CSS, Motion
- **Backend:** Express.js, Node.js
- **AI:** Google Gemini API
- **Build Tool:** Vite
- **Language:** TypeScript

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private repository. Please contact the maintainers for contribution guidelines.
