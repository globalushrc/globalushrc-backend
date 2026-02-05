# Backend Setup & Security Reference Guide

## Quick Start

### 1. Environment Setup

```bash
# Install dependencies (already done)
npm install

# Create/Update .env file
cp .env.example .env
```

### 2. Generate JWT Secret (Critical for Production)

```bash
# Run this command to generate a secure secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste into .env
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Run Production Server

```bash
NODE_ENV=production npm start
```

---

## 🔐 Security Features Implemented

### Rate Limiting

- **Global**: 100 requests/15 min per IP
- **Login**: 5 attempts/15 min per IP
- Returns: `429 Too Many Requests`

### Input Validation

- All form inputs validated with `express-validator`
- Email format validation
- Phone number format validation
- Date format validation (YYYY-MM-DD)
- String length restrictions
- Alphanumeric restrictions where needed

### File Upload Security

**Allowed MIME Types Only**:

- `application/pdf` - PDF files
- `application/msword` - .doc files
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - .docx files
- `text/plain` - .txt files
- `image/jpeg` - .jpg/.jpeg files
- `image/png` - .png files

**File Size**: 10MB maximum

### Helmet Security Headers

Protects against:

- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Missing Content Security Policy

### JWT Authentication

- Token-based authentication
- 24-hour token expiration
- Stored in `Authorization: Bearer <token>` header

---

## 📋 API Endpoints Overview

### Authentication

```
POST /api/auth/login
  - Body: { username, password }
  - Returns: { accessToken }
  - Rate Limited: 5 attempts/15 min
```

### User Management (Protected)

```
GET /api/users
  - Protected: Requires valid JWT
  - Returns: List of users without passwords

POST /api/users/add
  - Protected: Requires valid JWT
  - Body: { username (3-50 chars), password (6+ chars) }
  - Validated: Username pattern (alphanumeric, -, _)
```

### Consultations

```
POST /api/consultations
  - Body: { name, email, phone, service, date, time, ... }
  - Validations: All fields required, format checks
  - Returns: { consultationId, clientSecret, status }

GET /api/consultations/availability?date=YYYY-MM-DD
  - Validated: Date format
  - Returns: Available time slots for the date
```

### Contact Form

```
POST /api/contact (File upload allowed)
  - Body: { name, email, subject, message, document? }
  - Validations:
    - Name: 2-100 chars
    - Email: Valid email format
    - Subject: 3-150 chars
    - Message: 10+ chars
    - File: Whitelist MIME types, 10MB max
  - Returns: { message, submission }
```

### Admin Endpoints (Protected)

```
GET /api/consultations
GET /api/submissions
POST /api/news
POST /api/notices
DELETE endpoints
```

---

## 📊 Logging

### Log Files Location

- `logs/error.log` - Error level only
- `logs/combined.log` - All levels

### Log Levels

```
DEBUG: Detailed debugging information
INFO:  General information about application operations
WARN:  Warning messages (security events, rate limits)
ERROR: Error messages
```

### Example Log Entries

```
[2026-02-05 10:30:45] info: User logged in successfully {"username":"admin"}
[2026-02-05 10:31:12] warn: CORS blocked origin {"origin":"http://untrusted.com"}
[2026-02-05 10:32:00] error: Consultation creation error {"error":"Invalid email"}
```

---

## ✅ Validation Rules Reference

### Username Validation

- Length: 3-50 characters
- Pattern: Alphanumeric, hyphens (-), underscores (\_) only
- Example: `user_name-123` ✅ | `user@name` ❌

### Password Validation

- Minimum 6 characters
- No other restrictions (allow special chars)

### Email Validation

- Must be valid email format
- Example: `user@example.com` ✅ | `user@` ❌

### Phone Validation

- Allows: digits, spaces, hyphens, parentheses, plus sign
- Example: `+1 (555) 123-4567` ✅ | `abc-1234` ❌

### Date Validation

- Format: `YYYY-MM-DD`
- Example: `2026-02-15` ✅ | `02-15-2026` ❌

### Time Validation

- Format: `H:MM AM|PM`
- Example: `9:00 AM`, `2:30 PM` ✅ | `9:00:00` ❌

---

## 🛠️ Troubleshooting

### JWT_SECRET Not Configured

**Error**: Application won't start in production
**Solution**:

```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=<generated_secret>
```

### Rate Limit Errors

**Error**: `429 Too Many Requests`
**Solution**: Wait 15 minutes or use different IP

### File Upload Rejected

**Error**: `File type not allowed`
**Solution**: Use only whitelisted formats (PDF, DOC, DOCX, TXT, JPG, PNG)

### Validation Errors

**Error**: `400 Bad Request` with validation errors
**Solution**: Check request body matches validation rules

### Missing Logs Directory

**Error**: `ENOENT: no such file or directory, open 'logs/error.log'`
**Solution**: Application auto-creates `logs/` directory on first run

---

## 🚀 Performance Tips

1. **Rate Limiting**: Automatically handles concurrent requests
2. **Input Validation**: Fails fast on invalid input
3. **File Size Limit**: 10MB prevents large upload attacks
4. **Helmet Headers**: Minimal performance impact

---

## 🔒 Production Checklist

- [ ] JWT_SECRET set in .env (strong random string)
- [ ] NODE_ENV=production in .env
- [ ] CORS origins configured for your domain
- [ ] STRIPE_SECRET_KEY configured (if using Stripe)
- [ ] ESEWA credentials configured (if using eSewa)
- [ ] logs/ directory writable
- [ ] uploads/ directory writable and backed up
- [ ] Database/JSON files backed up
- [ ] Monitor logs/error.log regularly
- [ ] Rate limits appropriate for your traffic

---

## 📞 Common Questions

### Q: Can I change rate limit values?

**A**: Yes, edit the `rateLimit` configurations in index.js:

```javascript
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Change time window
  max: 100, // Change max requests
});
```

### Q: How do I add a new file type to upload whitelist?

**A**: Edit the `allowedMimeTypes` array in index.js:

```javascript
const allowedMimeTypes = [
  // ... existing types
  "application/vnd.ms-excel", // Add Excel files
];
```

### Q: Can I disable rate limiting?

**A**: Not recommended for production, but you can remove the line:

```javascript
app.use(generalLimiter); // Remove this line
```

### Q: How do I view logs in production?

**A**: Use tail or your hosting provider's log viewer:

```bash
tail -f logs/error.log
tail -f logs/combined.log
```

### Q: Where are uploaded files stored?

**A**: In the `uploads/` directory. Ensure it's writable and backed up.

---

## 📚 Additional Resources

- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: February 5, 2026
**Backend Version**: 2.0 (Security Enhanced)
