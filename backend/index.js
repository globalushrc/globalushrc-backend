const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult, query } = require("express-validator");
const winston = require("winston");

// Load environment variables FIRST
dotenv.config();

// ===== LOGGER CONFIGURATION =====
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "global-us-hrc-backend" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

// Ensure logs directory exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// Initialize Stripe only if key is provided and valid
let stripe = null;
if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_YOUR_SECRET_KEY_HERE"
) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  logger.info("Stripe initialized successfully");
} else {
  logger.warn("Stripe not configured - using free booking mode");
}

// Verify JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (
  !JWT_SECRET ||
  JWT_SECRET.includes("change") ||
  JWT_SECRET.includes("YOUR")
) {
  logger.error("JWT_SECRET is not properly configured in .env file");
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production environment");
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

// ===== SECURITY MIDDLEWARE =====
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Rate limiting middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // don't count successful requests
});

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Paths
const uploadDir = path.join(__dirname, "uploads");
const submissionsFile = path.join(__dirname, "submissions.json");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Ensure submissions file exists
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify([]));
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File type whitelist for security
const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      logger.warn(
        `File upload attempt with invalid MIME type: ${file.mimetype}`,
      );
      return cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

// Request Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Enable CORS with production support
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        try {
          return new URL(origin).origin === new URL(allowedOrigin).origin;
        } catch (e) {
          return origin === allowedOrigin;
        }
      });

      if (isAllowed || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// ===== INPUT VALIDATION MIDDLEWARE =====
// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation errors", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => {
  res.json({ message: "Global US HR Consultant API is running", port: PORT });
});

// Helper to get submissions
const getSubmissions = () => {
  try {
    const data = fs.readFileSync(submissionsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to save submissions
const saveSubmissions = (submissions) => {
  try {
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
    return true;
  } catch (err) {
    return false;
  }
};

// Consultations file path
const consultationsFile = path.join(__dirname, "consultations.json");

// Ensure consultations file exists
if (!fs.existsSync(consultationsFile)) {
  fs.writeFileSync(consultationsFile, JSON.stringify([]));
}

// Helper to get consultations
const getConsultations = () => {
  try {
    const data = fs.readFileSync(consultationsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to save consultations
const saveConsultations = (consultations) => {
  try {
    fs.writeFileSync(consultationsFile, JSON.stringify(consultations, null, 2));
    return true;
  } catch (err) {
    return false;
  }
};

// --- Authentication Middleware & Helpers ---
const usersFile = path.join(__dirname, "users.json");

const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    logger.error("Error reading users file", { error: err.message });
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    return true;
  } catch (err) {
    logger.error("Error saving users file", { error: err.message });
    return false;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Authentication attempt without token");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn("Invalid token attempt", { error: err.message });
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Login Endpoint with validation and rate limiting
app.post(
  "/api/auth/login",
  loginLimiter,
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters"),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
  handleValidationErrors,
  async (req, res) => {
    try {
      // Artificial delay to prevent brute force timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { username, password } = req.body;
      const users = getUsers();
      const user = users.find((u) => u.username === username);

      if (!user) {
        logger.warn("Login failed - user not found", { username });
        return res.status(400).json({ error: "Invalid username or password" });
      }

      if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, {
          expiresIn: "24h",
        });
        logger.info("User logged in successfully", { username });
        res.json({ accessToken });
      } else {
        logger.warn("Login failed - incorrect password", { username });
        res.status(400).json({ error: "Invalid username or password" });
      }
    } catch (err) {
      logger.error("Login error", { error: err.message });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// --- User Management Endpoints (Protected) ---

// Get All Users
app.get("/api/users", authenticateToken, (req, res) => {
  const users = getUsers();
  // Return users without passwords
  const safeUsers = users.map((u) => ({ id: u.id, username: u.username }));
  res.json(safeUsers);
});

// Add New User with validation
app.post(
  "/api/users/add",
  authenticateToken,
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, hyphens, and underscores",
    ),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const users = getUsers();

      if (users.find((u) => u.username === username)) {
        logger.warn("User creation failed - user already exists", { username });
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword,
      };

      users.push(newUser);
      if (saveUsers(users)) {
        logger.info("New user created", { username });
        res.json({
          message: "User created successfully",
          user: { id: newUser.id, username: newUser.username },
        });
      } else {
        res.status(500).json({ error: "Failed to save user" });
      }
    } catch (err) {
      logger.error("User creation error", { error: err.message });
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Delete User
app.post("/api/users/delete", authenticateToken, (req, res) => {
  const { id } = req.body;

  let users = getUsers();
  const userToDelete = users.find((u) => u.id === id);

  if (!userToDelete) {
    return res.status(404).json({ error: "User not found" });
  }

  // Prevent deleting self (optional, but good practice) - checking against req.user.username
  if (userToDelete.username === req.user.username) {
    return res
      .status(400)
      .json({ error: "Cannot delete your own account while logged in." });
  }

  // Prevent deleting the last admin if desired, but for now just filter
  users = users.filter((u) => u.id !== id);

  if (saveUsers(users)) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(500).json({ error: "Failed to save changes" });
  }
});

// Change Password
app.post("/api/users/change-password", authenticateToken, async (req, res) => {
  const { id, newPassword } = req.body;
  if (!id || !newPassword) {
    return res.status(400).json({ error: "User ID and new password required" });
  }

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    users[userIndex].password = hashedPassword;

    if (saveUsers(users)) {
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(500).json({ error: "Failed to save changes" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const HOLIDAYS = {
  "2026-01-01": "New Year's Day",
  "2026-12-25": "Christmas Day",
  "2026-01-30": "Martyr's Day",
  "2026-04-14": "Nepali New Year",
  "2026-05-01": "International Labour Day",
};

// Mark Consultation as Completed (Auto-complete for Meeting Room)
app.post("/api/consultations/complete", (req, res) => {
  try {
    const { id } = req.body;
    const consultations = getConsultations();
    const consultationIndex = consultations.findIndex(
      (c) => c.id === parseInt(id),
    );

    if (consultationIndex === -1) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Only allow completing if it's currently Processed (Active) or already Completed
    if (
      consultations[consultationIndex].status !== "Processed" &&
      consultations[consultationIndex].status !== "Completed"
    ) {
      return res
        .status(400)
        .json({ error: "Consultation must be active to complete." });
    }

    consultations[consultationIndex].status = "Completed";
    saveConsultations(consultations);

    logger.info("Consultation marked as completed", { id });

    res.json({
      message: "Consultation marked as completed",
      consultation: consultations[consultationIndex],
    });
  } catch (err) {
    logger.error("Complete consultation error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Check Availability Endpoint with validation
app.get(
  "/api/consultations/availability",
  query("date")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  handleValidationErrors,
  (req, res) => {
    try {
      const { date } = req.query;

      const selectedDate = new Date(date);
      const day = selectedDate.getDay();

      // Block Weekends (Saturday=6, Sunday=0)
      if (day === 0 || day === 6) {
        return res.json({
          available: false,
          reason: "We are closed on weekends. Please choose a weekday.",
        });
      }

      // Block Holidays
      if (HOLIDAYS[date]) {
        return res.json({
          available: false,
          reason: `Today is a public holiday: ${HOLIDAYS[date]}`,
        });
      }

      const consultations = getConsultations();
      const dateBookings = consultations.filter(
        (c) => c.preferredDate === date,
      );

      // Daily Limit Check
      if (dateBookings.length >= 28) {
        return res.json({
          available: false,
          reason: "No slots available for this date.",
        });
      }

      // Define 15-Minute Time Slots (9 AM - 12 PM, 1 PM - 5 PM)
      // 7 hours total * 4 slots per hour = 28 slots
      const generateTimeSlots = () => {
        const slots = [];
        const periods = [
          { start: 9, end: 12 },
          { start: 13, end: 17 },
        ];

        periods.forEach((p) => {
          for (let hour = p.start; hour < p.end; hour++) {
            for (let min = 0; min < 60; min += 15) {
              const h = hour > 12 ? hour - 12 : hour;
              const ampm = hour >= 12 ? "PM" : "AM";
              const time = `${h}:${String(min).padStart(2, "0")} ${ampm}`;
              slots.push(time);
            }
          }
        });
        return slots;
      };

      const timeSlots = generateTimeSlots();
      const maxPerSlot = 1; // 15-min slot per person

      // Calculate availability per slot
      const slotsStatus = timeSlots.map((slot) => {
        const slotCount = dateBookings.filter(
          (c) => c.preferredTime === slot,
        ).length;

        return {
          time: slot,
          available: slotCount < maxPerSlot,
          bookedCount: slotCount,
        };
      });

      res.json({
        available: true,
        slots: slotsStatus,
      });
    } catch (err) {
      logger.error("Availability check error", { error: err.message });
      res.status(500).json({ error: "Failed to check availability" });
    }
  },
);

// GET Month Availability Stats (for Calendar Grid)
app.get("/api/consultations/month-stats", (req, res) => {
  const { year, month } = req.query;
  if (!year || !month)
    return res.status(400).json({ error: "Year and month required" });

  const consultations = getConsultations();
  const timeSlotsCount = 7;
  const maxPerSlot = 4;

  const stats = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayBookings = consultations.filter(
      (c) => c.preferredDate === dateStr,
    );

    // Calculate available SLOTS (not just people)
    // 7 hours total * 4 slots per hour = 28 slots
    const slots = [];
    const periods = [
      { start: 9, end: 12 },
      { start: 13, end: 17 },
    ];

    periods.forEach((p) => {
      for (let hour = p.start; hour < p.end; hour++) {
        for (let min = 0; min < 60; min += 15) {
          const h = hour > 12 ? hour - 12 : hour;
          const ampm = hour >= 12 ? "PM" : "AM";
          const time = `${h}:${String(min).padStart(2, "0")} ${ampm}`;
          slots.push(time);
        }
      }
    });

    let availableSlots = 0;
    const maxPerSlot = 1;
    slots.forEach((slot) => {
      const count = dayBookings.filter((b) => b.preferredTime === slot).length;
      if (count < maxPerSlot) availableSlots++;
    });

    stats[dateStr] = availableSlots;
  }

  res.json(stats);
});

// Book Consultation Endpoint with validation
app.post(
  "/api/consultations",
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone")
    .matches(/^[+]?[0-9\s-()]+$/)
    .withMessage("Valid phone number is required"),
  body("service")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service must be between 2 and 100 characters"),
  body("date")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .matches(/^(9|10|11|12|1|2|3|4):[0-9]{2}\s(AM|PM)$/)
    .withMessage("Valid time is required"),
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        service,
        date,
        time,
        message,
        location,
        paymentMethod,
        isPremium,
      } = req.body;

      // Double Check Availability on Submit
      const selectedDate = new Date(date);
      const day = selectedDate.getDay();
      if (day === 0 || day === 6 || HOLIDAYS[date]) {
        logger.warn("Booking attempt on unavailable date", { date });
        return res
          .status(400)
          .json({ error: "Selected date is not available." });
      }

      const consultations = getConsultations();
      const dateBookings = consultations.filter(
        (c) => c.preferredDate === date,
      );

      if (dateBookings.length >= 28) {
        logger.warn("Booking attempt when daily limit reached", { date });
        return res.status(400).json({ error: "Daily booking limit reached." });
      }

      // Check specific slot limit (15-min slot is per person)
      const slotCount = dateBookings.filter(
        (c) => c.preferredTime === time,
      ).length;
      if (slotCount >= 1) {
        logger.warn("Booking attempt for occupied slot", { date, time });
        return res
          .status(400)
          .json({ error: "This time slot is already booked." });
      }

      const consultationId = Date.now();
      let clientSecret = null;
      let status = "Pending"; // Default status
      const selectedPaymentMethod = paymentMethod || "stripe"; // Default to stripe
      const amount = isPremium ? 10000 : 5000; // $100 if premium, $50 if standard

      // Handle Stripe Payment
      if (selectedPaymentMethod === "stripe" && stripe) {
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { consultationId: consultationId.toString() },
          });
          clientSecret = paymentIntent.client_secret;
          status = "Pending Payment";
        } catch (stripeErr) {
          logger.error("Stripe Intent Error", { error: stripeErr.message });
        }
      }

      // Handle eSewa Payment - just mark as Pending Payment
      if (selectedPaymentMethod === "esewa") {
        status = "Pending Payment";
      }

      const newConsultation = {
        id: consultationId,
        name,
        email,
        phone,
        service,
        preferredDate: date,
        preferredTime: time,
        message: message || "",
        location: location || null,
        paymentId: null,
        paymentMethod: selectedPaymentMethod,
        amountPaid: 0,
        isPremium: !!isPremium,
        status: status,
        createdAt: new Date().toISOString(),
      };
      consultations.push(newConsultation);
      saveConsultations(consultations);

      logger.info("Consultation created", {
        consultationId,
        name,
        service,
        date,
      });

      res.status(200).json({
        message: "Consultation created successfully!",
        consultationId: consultationId,
        clientSecret: clientSecret,
        status: status,
        paymentMethod: selectedPaymentMethod,
      });
    } catch (err) {
      logger.error("Consultation creation error", { error: err.message });
      res.status(500).json({ error: err.message });
    }
  },
);

// Mark Consultation as Processed
app.post("/api/consultations/process", authenticateToken, (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ error: "Consultation ID is required" });

    const consultations = getConsultations();
    const index = consultations.findIndex((c) => c.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    consultations[index].status = "Processed";
    saveConsultations(consultations);

    logger.info("Consultation marked as processed", { id });

    res.status(200).json({
      message: "Consultation processed successfully",
      status: "Processed",
    });
  } catch (err) {
    logger.error("Process consultation error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Contact Form Submission Endpoint with validation
app.post(
  "/api/contact",
  upload.single("document"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("subject")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Subject must be between 3 and 150 characters"),
  body("message")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),
  handleValidationErrors,
  (req, res) => {
    try {
      const { name, email, phone, subject, message, location } = req.body;

      const submissions = getSubmissions();
      const newSubmission = {
        id: Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        location: location ? JSON.parse(location) : null,
        document: req.file ? req.file.filename : null,
        date: new Date().toISOString(),
      };

      submissions.push(newSubmission);
      saveSubmissions(submissions);

      logger.info("New contact submission", { name, subject, email });

      res.status(200).json({
        message: "Message received successfully!",
        submission: newSubmission,
      });
    } catch (err) {
      logger.error("Submission error", { error: err.message });
      res.status(500).json({ error: err.message });
    }
  },
);

// Confirm Payment Endpoint
app.post("/api/consultations/confirm-payment", (req, res) => {
  try {
    const { id, paymentId } = req.body;
    if (!id || !paymentId) {
      return res.status(400).json({ error: "ID and Payment ID are required" });
    }

    const consultations = getConsultations();
    const index = consultations.findIndex((c) => c.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    consultations[index].status = "Paid";
    consultations[index].paymentId = paymentId;
    consultations[index].amountPaid = 50;

    saveConsultations(consultations);

    logger.info("Consultation payment confirmed", { id, paymentId });

    res.status(200).json({ message: "Payment confirmed successfully" });
  } catch (err) {
    logger.error("Confirm payment error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// GET Public Consultation Details (for Video Room)
app.get("/api/consultations/:id/public", (req, res) => {
  try {
    const { id } = req.params;
    const consultations = getConsultations();
    const consultation = consultations.find((c) => c.id === parseInt(id));

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Return only safe public details
    res.json({
      service: consultation.service,
      name: consultation.name,
      status: consultation.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API for Admin to get all consultations
app.get("/api/consultations", authenticateToken, (req, res) => {
  const consultations = getConsultations();
  consultations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(consultations);
});

// API for Admin to get all submissions
app.get("/api/submissions", authenticateToken, (req, res) => {
  const submissions = getSubmissions();
  submissions.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(submissions);
});

// DELETE Submission Endpoint
app.post("/api/submissions/delete", authenticateToken, (req, res) => {
  try {
    const { id } = req.body;
    const submissions = getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);

    if (submissions.length === filtered.length) {
      return res.status(404).json({ error: "Submission not found" });
    }

    saveSubmissions(filtered);
    logger.info("Submission deleted", { id });
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    logger.error("Submission deletion error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// DELETE Consultation Endpoint
app.delete("/api/consultations/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const consultations = getConsultations();
    const filtered = consultations.filter((c) => c.id !== parseInt(id));

    if (consultations.length === filtered.length) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    saveConsultations(filtered);
    logger.info("Consultation deleted", { id });
    res.status(200).json({ message: "Consultation deleted successfully" });
  } catch (err) {
    logger.error("Consultation deletion error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// List Uploaded Files
app.get("/api/uploads", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      logger.error("Upload directory scan error", { error: err.message });
      return res.status(500).json({ error: "Unable to scan directory" });
    }
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const fileList = files.map((file) => ({
      name: file,
      url: `${baseUrl}/uploads/${file}`,
      date: fs.statSync(path.join(uploadDir, file)).mtime,
    }));
    res.status(200).json(fileList);
  });
});

// POST based deletion for compatibility
app.post("/api/files/delete", authenticateToken, (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "No filename provided" });

  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    logger.warn("File deletion - file not found", { filename });
    return res.status(404).json({ error: `File not found: ${filename}` });
  }

  try {
    fs.unlinkSync(filePath);
    logger.info("File deleted", { filename });
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    logger.error("File deletion error", { filename, error: err.message });
    res.status(500).json({ error: "Failed to delete file from disk" });
  }
});

// Payment Intent Endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error:
          "Payment system not configured. Please add STRIPE_SECRET_KEY to backend/.env",
      });
    }

    const { amount } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 5000, // Default $50.00 (in cents)
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger.info("Payment intent created", { amount });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    logger.error("Stripe error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// --- eSewa Payment Integration ---

// eSewa Configuration
const ESEWA_CONFIG = {
  merchantCode: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
  environment: process.env.ESEWA_ENVIRONMENT || "test",
  paymentUrl:
    process.env.ESEWA_ENVIRONMENT === "production"
      ? "https://epay.esewa.com.np/api/epay/main/v2/form"
      : "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  verifyUrl:
    process.env.ESEWA_ENVIRONMENT === "production"
      ? "https://epay.esewa.com.np/api/epay/transaction/status/"
      : "https://rc-epay.esewa.com.np/api/epay/transaction/status/",
};

logger.info(
  `eSewa configured in ${ESEWA_CONFIG.environment} mode with merchant: ${ESEWA_CONFIG.merchantCode}`,
);

// Helper function to generate eSewa signature using HMAC SHA256
const generateEsewaSignature = (totalAmount, transactionUuid, productCode) => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hash = crypto
    .createHmac("sha256", ESEWA_CONFIG.secretKey)
    .update(message)
    .digest("base64");
  return hash;
};

// POST /api/esewa/initiate - Initiate eSewa Payment
app.post("/api/esewa/initiate", (req, res) => {
  try {
    const { consultationId, amount } = req.body;

    if (!consultationId || !amount) {
      return res
        .status(400)
        .json({ error: "Consultation ID and amount are required" });
    }

    // Generate unique transaction UUID
    const transactionUuid = `TXN-${consultationId}-${Date.now()}`;
    const productCode = ESEWA_CONFIG.merchantCode;

    // Standardize amount as integer for eSewa test environment reliability
    const totalAmount = Math.round(parseFloat(amount)).toString();
    const taxAmount = "0";
    const productServiceCharge = "0";
    const productDeliveryCharge = "0";

    // Generate signature using the formatted amount
    const signature = generateEsewaSignature(
      totalAmount,
      transactionUuid,
      productCode,
    );

    // Frontend URL for success/failure redirects
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const paymentData = {
      amount: totalAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: productServiceCharge,
      product_delivery_charge: productDeliveryCharge,
      success_url: `${frontendUrl}/payment/success`,
      failure_url: `${frontendUrl}/payment/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    logger.info("eSewa payment initiated", {
      consultationId,
      transactionUuid,
      amount: totalAmount,
    });

    res.json({
      paymentUrl: ESEWA_CONFIG.paymentUrl,
      paymentData,
      transactionUuid,
    });
  } catch (err) {
    logger.error("eSewa initiate error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/esewa/verify - Verify eSewa Payment
app.get("/api/esewa/verify", async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ error: "Payment data is required" });
    }

    // Decode base64 data from eSewa
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8"),
    );

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature,
    } = decodedData;

    // Verify signature
    const generatedSignature = generateEsewaSignature(
      total_amount,
      transaction_uuid,
      product_code,
    );

    if (signature !== generatedSignature) {
      logger.warn("eSewa signature mismatch", {
        received: signature,
        generated: generatedSignature,
      });
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Verify with eSewa server
    const verifyUrl = `${ESEWA_CONFIG.verifyUrl}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!verifyResponse.ok) {
      throw new Error("eSewa verification failed");
    }

    const verifyData = await verifyResponse.json();

    if (verifyData.status !== "COMPLETE") {
      return res
        .status(400)
        .json({ error: "Payment not completed", verifyData });
    }

    logger.info("eSewa payment verified", {
      transaction_code,
      transaction_uuid,
      amount: total_amount,
    });

    res.json({
      success: true,
      transaction_code,
      transaction_uuid,
      amount: total_amount,
      status: verifyData.status,
    });
  } catch (err) {
    logger.error("eSewa verify error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// POST /api/esewa/confirm-payment - Confirm eSewa Payment and Update Consultation
app.post("/api/esewa/confirm-payment", (req, res) => {
  try {
    const { consultationId, transactionCode, transactionUuid, amount } =
      req.body;

    if (!consultationId || !transactionCode) {
      return res
        .status(400)
        .json({ error: "Consultation ID and transaction code are required" });
    }

    const consultations = getConsultations();
    const index = consultations.findIndex(
      (c) => c.id === parseInt(consultationId),
    );

    if (index === -1) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    consultations[index].status = "Paid";
    consultations[index].paymentId = transactionCode;
    consultations[index].paymentMethod = "eSewa";
    consultations[index].transactionUuid = transactionUuid;
    consultations[index].amountPaid = parseFloat(amount);

    saveConsultations(consultations);

    logger.info("eSewa payment confirmed", {
      consultationId,
      transactionCode,
      amount,
    });

    res.status(200).json({
      message: "Payment confirmed successfully",
      consultation: consultations[index],
    });
  } catch (err) {
    logger.error("eSewa confirm payment error", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// API to generate content automatically based on title
app.post(
  "/api/generate-content",
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  handleValidationErrors,
  (req, res) => {
    try {
      const { title } = req.body;

      const lowerTitle = title.toLowerCase();
      let generatedContent = "";

      // Keyword based "AI" generation for professional HR/Consultancy content
      if (lowerTitle.includes("visa")) {
        generatedContent = `We are pleased to announce updated guidelines for visa processing. At Global US HR Consultant, we ensure that our clients receive the most accurate and timely information regarding travel documentation. \n\nKey points include:\n- Streamlined application review process\n- Updated documentation requirements for efficiency\n- Expert consultation available for complex cases.\n\nContact our team for personalized assistance.`;
      } else if (
        lowerTitle.includes("job") ||
        lowerTitle.includes("hiring") ||
        lowerTitle.includes("career")
      ) {
        generatedContent = `New career opportunities are now available through our global network. Global US HR Consultant is dedicated to connecting top-tier talent with industry-leading organizations. \n\nPositions are open across various sectors including Information Technology, Healthcare, and Management. Applicants are encouraged to submit their updated resumes through our portal for immediate consideration.`;
      } else if (
        lowerTitle.includes("policy") ||
        lowerTitle.includes("rule") ||
        lowerTitle.includes("update")
      ) {
        generatedContent = `Important policy updates have been implemented to better serve our international community. These changes reflect our commitment to transparency and excellence in HR consultancy. \n\nWe recommend all stakeholders review these updates to ensure compliance with the latest international standards. Our team is hosting a webinar next week to discuss these changes in detail.`;
      } else if (
        lowerTitle.includes("australia") ||
        lowerTitle.includes("canada") ||
        lowerTitle.includes("usa") ||
        lowerTitle.includes("uk")
      ) {
        const country =
          title.match(/australia|canada|usa|uk/i)?.[0] || "international";
        generatedContent = `Exciting developments for ${country} immigration and work permits. Global US HR Consultant has simplified the process for individuals looking to relocate or work in ${country}. \n\nOur specialists provide end-to-end support, from initial evaluation to final approval. Register for a consultation today to explore your options.`;
      } else {
        generatedContent = `Official Update from Global US HR Consultant: regarding "${title}". \n\nWe are committed to providing world-class workforce solutions and consultancy services. This latest development is part of our ongoing effort to enhance our global reach and service quality. \n\nPlease stay tuned for more detailed information or reach out to our support department for specific inquiries.`;
      }

      logger.info("Content generated", { title });
      res.json({ content: generatedContent });
    } catch (err) {
      logger.error("Content generation error", { error: err.message });
      res.status(500).json({ error: "Failed to generate content" });
    }
  },
);

// --- News / Documents Feature ---
const newsFile = path.join(__dirname, "news.json");

if (!fs.existsSync(newsFile)) {
  fs.writeFileSync(newsFile, JSON.stringify([]));
}

const getNews = () => {
  try {
    const data = fs.readFileSync(newsFile);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveNews = (news) => {
  fs.writeFileSync(newsFile, JSON.stringify(news, null, 2));
};

// GET News
app.get("/api/news", (req, res) => {
  const news = getNews();
  res.json(news);
});

// POST Publish News (Upload)
app.post(
  "/api/news",
  authenticateToken,
  upload.single("document"),
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  handleValidationErrors,
  (req, res) => {
    try {
      const { title, description } = req.body;
      const file = req.file;

      const newsItem = {
        id: Date.now(),
        title: title || "Untitled News",
        description: description || "",
        filename: file ? file.filename : null,
        url: file ? `/uploads/${file.filename}` : null,
        date: new Date().toISOString(),
        type: file ? file.mimetype : "text/plain",
      };

      const news = getNews();
      news.push(newsItem);
      saveNews(news);

      logger.info("News published", { title });
      res
        .status(201)
        .json({ message: "News published successfully", newsItem });
    } catch (err) {
      logger.error("News upload error", { error: err.message });
      res.status(500).json({ error: "Failed to publish news" });
    }
  },
);

// DELETE News
app.post("/api/news/delete", authenticateToken, (req, res) => {
  try {
    const { id, filename } = req.body;
    let news = getNews();
    news = news.filter((item) => item.id !== id);
    saveNews(news);

    // Optional: Delete file from uploads
    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    logger.info("News deleted", { id });
    res.json({ message: "News item deleted successfully" });
  } catch (err) {
    logger.error("News deletion error", { error: err.message });
    res.status(500).json({ error: "Failed to delete news item" });
  }
});

// --- Notice Board Feature ---
const noticesFile = path.join(__dirname, "notices.json");

if (!fs.existsSync(noticesFile)) {
  fs.writeFileSync(noticesFile, JSON.stringify([]));
}

const getNotices = () => {
  try {
    const data = fs.readFileSync(noticesFile);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveNotices = (notices) => {
  fs.writeFileSync(noticesFile, JSON.stringify(notices, null, 2));
};

// GET Notices
app.get("/api/notices", (req, res) => {
  const notices = getNotices();
  res.json(notices);
});

// POST Notice
app.post(
  "/api/notices",
  authenticateToken,
  body("content")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Notice content must be between 5 and 1000 characters"),
  handleValidationErrors,
  (req, res) => {
    try {
      const { content, priority } = req.body;

      const notice = {
        id: Date.now(),
        content,
        priority: priority || "normal", // normal, high
        date: new Date().toISOString(),
      };

      const notices = getNotices();
      notices.push(notice);
      saveNotices(notices);

      logger.info("Notice posted", { priority });
      res.status(201).json({ message: "Notice posted successfully", notice });
    } catch (err) {
      logger.error("Notice error", { error: err.message });
      res.status(500).json({ error: "Failed to post notice" });
    }
  },
);

// DELETE Notice
app.post("/api/notices/delete", authenticateToken, (req, res) => {
  try {
    const { id } = req.body;
    let notices = getNotices();
    notices = notices.filter((item) => item.id !== id);
    saveNotices(notices);
    logger.info("Notice deleted", { id });
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    logger.error("Notice deletion error", { error: err.message });
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  logger.warn("Route not found", { path: req.originalUrl });
  res
    .status(404)
    .json({ error: `Path ${req.originalUrl} not found on this server.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error("Global error handler", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File size exceeds 10MB limit" });
  }

  // Multer file type error
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Backend server running at http://0.0.0.0:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    logger.warn("Running in production mode");
  }
});
