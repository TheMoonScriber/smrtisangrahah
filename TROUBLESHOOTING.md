# Troubleshooting Guide for Smrtisangrahah

## Localhost Not Working

If you're experiencing issues accessing the application on localhost, follow these troubleshooting steps:

### 1. Check Prerequisites

Ensure you have Node.js installed:
```bash
node --version  # Should be v18 or higher
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

Make sure all dependencies are installed:
```bash
npm install
```

If you encounter errors:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):
```bash
cp .env.example .env
```

The `.env` file should contain:
```env
GEMINI_API_KEY="your-actual-api-key-here"
APP_URL="http://localhost:3000"
```

**Note:** The GEMINI_API_KEY is optional for basic functionality. Get one from [Google AI Studio](https://makersuite.google.com/app/apikey) if you want to use AI features.

### 4. Check Port Availability

The default port is 3000. Check if it's already in use:

**Windows:**
```bash
netstat -ano | findstr :3000
```

**Mac/Linux:**
```bash
lsof -i :3000
# or
netstat -tuln | grep 3000
```

If port 3000 is in use, either:
- Kill the process using that port
- Set a different port:
  ```bash
  PORT=3001 npm run dev
  ```

### 5. Start the Server

Start the development server:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

### 6. Verify Server is Running

Open another terminal and test the server:
```bash
curl http://localhost:3000
# or visit in browser
```

**Expected:** You should see the HTML content or the login page in your browser.

### 7. Check Firewall Settings

Ensure your firewall isn't blocking localhost connections:

**Windows:**
- Open Windows Defender Firewall
- Allow Node.js through the firewall

**Mac:**
- System Preferences → Security & Privacy → Firewall
- Ensure Node.js is allowed

**Linux:**
```bash
sudo ufw allow 3000/tcp
# or
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

### 8. Browser Cache Issues

If the page loads but looks broken:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private mode
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 9. Network Configuration

If accessing from another device on the same network:
1. The server binds to `0.0.0.0` by default (allows external access)
2. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # or
   hostname -I
   ```
3. Access from other device: `http://YOUR_IP:3000`

### 10. Common Error Messages

#### "EADDRINUSE: address already in use"
- Port 3000 is taken
- Solution: Kill the process or use a different port

#### "Cannot find module 'xyz'"
- Missing dependencies
- Solution: Run `npm install`

#### "EACCES: permission denied"
- Port requires elevated privileges (ports < 1024)
- Solution: Use port 3000 or higher, or run with sudo (not recommended)

#### "Network error" or "ERR_CONNECTION_REFUSED"
- Server not running
- Solution: Start the server with `npm run dev`

#### Blank page or white screen
- Build/compilation error
- Solution: Check terminal for error messages, restart server

### 11. Development Tools

Enable verbose logging:
```bash
DEBUG=* npm run dev
```

Check TypeScript errors:
```bash
npm run lint
```

### 12. Reset Everything

If all else fails, complete reset:
```bash
# Stop all running servers (Ctrl+C)

# Clean everything
rm -rf node_modules package-lock.json dist .env

# Reinstall
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your API key (optional)

# Start fresh
npm run dev
```

### 13. Test Health Check

Once the server is running, test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

## Default Credentials

Once the server is running, access the app at `http://localhost:3000`

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Member Registration:**
- Sign up through the member portal
- Wait for admin approval
- Login with your Member ID

## Still Having Issues?

If you're still experiencing problems:

1. Check the terminal output for specific error messages
2. Look for error messages in the browser console (F12)
3. Ensure you're using a supported browser (Chrome, Firefox, Edge, Safari)
4. Try a different network (sometimes VPNs or corporate networks block localhost)
5. Create an issue on GitHub with:
   - Your OS and version
   - Node.js version
   - Error messages
   - Steps you've already tried

## Production Deployment

For production deployment, the setup is different:

1. Build the app:
   ```bash
   npm run build
   ```

2. Preview the build:
   ```bash
   npm run preview
   ```

3. For actual deployment, use a service like:
   - Vercel
   - Netlify
   - Render
   - Railway
   - AWS/Azure/GCP

The built files will be in the `dist` directory.
