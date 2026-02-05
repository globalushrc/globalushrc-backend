# 🚀 Quick Reference Card

## 5-Minute Setup

```bash
# 1. Set JWT Secret
echo JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") >> .env

# 2. Verify installation
npm list express-validator express-rate-limit helmet winston

# 3. Start server
npm run dev

# 4. Test it works
curl http://localhost:5001/
```

---

## API Endpoints Summary

### Public Endpoints (No Auth Required)

```
POST /api/auth/login
POST /api/consultations
POST /api/contact
GET  /api/consultations/availability
GET  /api/consultations/:id/public
GET  /api/news
GET  /api/notices
POST /api/create-payment-intent
POST /api/esewa/initiate
GET  /api/esewa/verify
POST /api/esewa/confirm-payment
```

### Protected Endpoints (Requires JWT)

```
GET    /api/users
POST   /api/users/add
POST   /api/users/delete
POST   /api/users/change-password
GET    /api/consultations
GET    /api/submissions
POST   /api/consultations/complete
POST   /api/consultations/process
POST   /api/consultations/confirm-payment
POST   /api/consultations/:id (DELETE)
POST   /api/submissions/delete
POST   /api/files/delete
POST   /api/news
POST   /api/news/delete
POST   /api/notices
POST   /api/notices/delete
```

---

## Quick Troubleshooting

| Problem                                         | Solution                                                 |
| ----------------------------------------------- | -------------------------------------------------------- |
| `Error: JWT_SECRET is not defined`              | Add JWT_SECRET to .env                                   |
| `Error: Cannot find module 'express-validator'` | Run `npm install`                                        |
| `429 Too Many Requests`                         | Wait 15 minutes or use different IP                      |
| `File type not allowed`                         | Use PDF, DOC, DOCX, TXT, JPG, or PNG                     |
| `Can't connect to server`                       | Check port 5001 is free: `netstat -ano \| findstr :5001` |
| `logs/ directory error`                         | Server auto-creates it; check permissions                |
| `CORS error in browser`                         | Add your domain to FRONTEND_URL in .env                  |

---

## Environment Variables

```bash
# Required
JWT_SECRET=<your_32_char_random_string>

# Optional but Important
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5001

# Payment (if using)
STRIPE_SECRET_KEY=sk_test_xxx
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_ENVIRONMENT=test

# Server
PORT=5001
```

---

## Security Quick Checks

```bash
# ✅ Check JWT Secret configured
grep JWT_SECRET .env

# ✅ Check no secrets in code
grep -r "sk_test_" index.js  # Should be empty

# ✅ Check logs created
ls -la logs/

# ✅ Check server running
curl -I http://localhost:5001/

# ✅ Check helmet headers
curl -I http://localhost:5001/ | grep X-

# ✅ Check rate limiting
for i in {1..101}; do curl http://localhost:5001/ > /dev/null; done
```

---

## Log File Commands

```bash
# Watch errors in real-time
tail -f logs/error.log

# Watch all logs
tail -f logs/combined.log

# Count errors today
grep "$(date +%Y-%m-%d)" logs/error.log | wc -l

# View last 100 errors
tail -100 logs/error.log

# Search for login failures
grep "Login failed" logs/combined.log

# Search for rate limit hits
grep "Too many requests" logs/combined.log
```

---

## Testing Commands

```bash
# 1. Health check
curl http://localhost:5001/

# 2. Bad validation
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"T","email":"bad","subject":"x"}'

# 3. Protected endpoint (no auth)
curl http://localhost:5001/api/users

# 4. Protected endpoint (with auth)
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/users

# 5. Check rate limit
for i in {1..5}; do curl http://localhost:5001/; done

# 6. Check file upload
curl -F "name=Test" -F "email=test@test.com" \
  -F "subject=Test" -F "message=Test message" \
  -F "document=@file.pdf" \
  http://localhost:5001/api/contact
```

---

## Performance Tuning

```javascript
// Adjust rate limits in index.js
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

// Adjust file upload size
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Adjust JSON body size
app.use(express.json({ limit: "10mb" }));
```

---

## Common Error Messages

| Message                     | Meaning                | Fix                                 |
| --------------------------- | ---------------------- | ----------------------------------- |
| `401 Unauthorized`          | No token provided      | Add Authorization header            |
| `403 Forbidden`             | Token invalid/expired  | Login again to get new token        |
| `400 Bad Request`           | Validation failed      | Check validation errors in response |
| `429 Too Many Requests`     | Rate limited           | Wait 15 minutes                     |
| `413 Payload Too Large`     | File too big (>10MB)   | Upload smaller file                 |
| `404 Not Found`             | Endpoint doesn't exist | Check URL spelling                  |
| `500 Internal Server Error` | Server crashed         | Check logs/error.log                |

---

## Admin Tasks

### Change User Password

```bash
# Use CLI tool
node manage_users.js

# Select option 3 (Change Password)
# Enter username and new password
```

### Add New Admin User

```bash
# Use CLI tool
node manage_users.js

# Select option 2 (Add New User)
# Enter username and password
```

### List Users

```bash
# Use CLI tool
node manage_users.js

# Select option 1 (List Users)
```

### View Recent Errors

```bash
tail -50 logs/error.log
```

### Check Disk Usage

```bash
# Check logs directory
du -sh logs/

# Check uploads directory
du -sh uploads/

# Check total disk
df -h
```

---

## Important Files

| File                      | Purpose                         |
| ------------------------- | ------------------------------- |
| `index.js`                | Main application code           |
| `.env`                    | Environment variables (SECRET!) |
| `package.json`            | Dependencies                    |
| `logs/error.log`          | Error logs                      |
| `logs/combined.log`       | All logs                        |
| `uploads/`                | User uploaded files             |
| `users.json`              | User accounts                   |
| `consultations.json`      | Booking data                    |
| `submissions.json`        | Contact form data               |
| `news.json`               | News items                      |
| `notices.json`            | Notices                         |
| `IMPROVEMENTS.md`         | Detailed changes                |
| `SECURITY_GUIDE.md`       | Security reference              |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist        |

---

## Useful npm Commands

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Check for security vulnerabilities
npm audit

# Update packages (careful!)
npm update

# List installed packages
npm list

# Check specific package version
npm list express-validator
```

---

## Production Deployment Reminders

1. ✅ JWT_SECRET set (strong, random, 32+ chars)
2. ✅ NODE_ENV=production
3. ✅ CORS configured for your domain
4. ✅ FRONTEND_URL set correctly
5. ✅ Backup files before deploying
6. ✅ Test in staging first
7. ✅ Monitor logs first 24 hours
8. ✅ Set up log rotation
9. ✅ Plan disaster recovery
10. ✅ Document admin procedures

---

## Emergency Procedures

### Server Won't Start

```bash
# 1. Check syntax
node -c index.js

# 2. Check dependencies
npm install

# 3. Check port in use
netstat -ano | findstr :5001

# 4. Check JWT_SECRET
grep JWT_SECRET .env

# 5. Start with debug info
NODE_DEBUG=* npm run dev
```

### Data Loss

```bash
# 1. Check backup location
ls -la ../backups/

# 2. Restore from backup
cp ../backups/users.json ./users.json

# 3. Restart server
npm run dev
```

### High Error Rate

```bash
# 1. Check error log
tail -100 logs/error.log

# 2. Identify pattern
grep "error_type" logs/error.log | wc -l

# 3. Fix issue and restart
npm run dev
```

---

**Bookmark this card!** 📌

Save this file for quick reference during development and maintenance.

---

_Last Updated: February 5, 2026_  
_Version: 2.0 - Security Enhanced_
