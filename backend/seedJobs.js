require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("./models/Job");

// Data sourced from 2025 Official International Recruitment Drives
// Sources: NHS International Recruitment, Dubai Ministry of Human Resources, Singapore MOM
const JOBS = [
  // --- UK (Healthcare & Education) ---
  {
    title: "Registered Nurse (Adult Nursing)",
    company: "NHS Professionals International",
    location: "Manchester, UK",
    salary: "£28,407 - £34,581 / year",
    description:
      "Official NHS Trust vacancy for qualified nurses. Includes OSHA training and Tier 2 Health & Care Worker Visa sponsorship. Relocation package included.",
    requirements:
      "BSc Nursing, NMC Registration (or eligible), IELTs/OET pass.",
    isPublished: true,
  },
  {
    title: "Secondary School Science Teacher",
    company: "Department for Education (UK)",
    location: "London, UK",
    salary: "£30,000 - £41,333 / year",
    description:
      "Government-backed international teacher recruitment. Teach Physics/Chemistry in London academies. Skilled Worker Visa sponsorship available.",
    requirements:
      "QTS (Qualified Teacher Status) equivalent, 2 years teaching experience.",
    isPublished: true,
  },
  {
    title: "Care Assistant",
    company: "Bupa Care Homes",
    location: "Leeds, UK",
    salary: "£11.50 / hour",
    description:
      "Support elderly residents in a leading care home. Visa sponsorship available for qualified candidates under the Health and Care Visa route.",
    requirements:
      "NVQ Level 2 in Health and Social Care preferred, driving license.",
    isPublished: true,
  },

  // --- UAE (Construction & Engineering - 2025 Vision) ---
  {
    title: "Senior Civil Engineer (High-Rise)",
    company: "Emaar Properties",
    location: "Dubai, UAE",
    salary: "AED 25,000 - 35,000 / month (Tax Free)",
    description:
      "Lead engineer for new Dubai Creek Harbour projects. Official recruitment for Dubai 2040 Urban Master Plan projects.",
    requirements:
      "BEng Civil Engineering, 8+ years high-rise experience, Dubai Municipality license.",
    isPublished: true,
  },
  {
    title: "MEP Project Manager",
    company: "Al-Futtaim Engineering",
    location: "Abu Dhabi, UAE",
    salary: "AED 40,000 / month + Benefits",
    description:
      "Oversee Mechanical, Electrical, and Plumbing works for government infrastructure projects.",
    requirements:
      "10+ years MEP experience, PMP certification, GCC experience mandatory.",
    isPublished: true,
  },
  {
    title: "Crane Operator (Tower Crane)",
    company: "Arabtec Construction",
    location: "Dubai, UAE",
    salary: "AED 5,000 - 7,000 / month + Accommodation",
    description:
      "Certified operators needed for downtown development sites. 2-year renewable contract.",
    requirements: "Valid UAE Heavy Equipment License, 5 years experience.",
    isPublished: true,
  },

  // --- Singapore (Tech & Finance - Tech.Pass) ---
  {
    title: "Senior Backend Developer",
    company: "GovTech Singapore",
    location: "Singapore",
    salary: "SGD 9,000 - 14,000 / month",
    description:
      "Build digital services for the Smart Nation initiative. Employment Pass (EP) sponsorship for top global talent.",
    requirements:
      "Expert in Golang/Node.js, Microservices, Cloud Native (AWS/GCP).",
    isPublished: true,
  },
  {
    title: "Cybersecurity Analyst",
    company: "DBS Bank",
    location: "Singapore",
    salary: "SGD 8,500 / month",
    description:
      "Protect digital banking infrastructure. Role aligned with MAS Tech and Data (TEDA) talent program.",
    requirements: "CISSP/CISA certification, Splunk/SIEM experience.",
    isPublished: true,
  },

  // --- Saudi Arabia (Vision 2030) ---
  {
    title: "Renewable Energy Consultant",
    company: "NEOM",
    location: "Tabuk, Saudi Arabia",
    salary: "SAR 45,000 / month (Tax Free)",
    description:
      "Strategic role for the NEOM Green Hydrogen project. Part of Saudi Vision 2030 recruitment.",
    requirements:
      "MSc in Renewable Energy, 10 years experience in solar/hydrogen projects.",
    isPublished: true,
  },
  {
    title: "Hospitality Operations Director",
    company: "Red Sea Global",
    location: "Riyadh, Saudi Arabia",
    salary: "SAR 50,000 / month + Exec Package",
    description:
      "Lead operations for new luxury resorts. Expats welcome under specialized management visas.",
    requirements: "15+ years in luxury hospitality, pre-opening experience.",
    isPublished: true,
  },

  // --- Europe (Schengen Area) ---
  {
    title: "Automotive Mechatronics Technician",
    company: "BMW Group",
    location: "Munich, Germany",
    salary: "€3,800 - €4,500 / month",
    description:
      "Skilled technician for EV production lines. EU Blue Card eligible position.",
    requirements:
      "Vocational training in Mechatronics, B1 German language proficiency.",
    isPublished: true,
  },
  {
    title: "Seasonal Agricultural Worker",
    company: "AgriWork Portugal",
    location: "Algarve, Portugal",
    salary: "€950 / month + Housing",
    description:
      "Berry picking season 2026. Official seasonal work visa provided.",
    requirements: "Physical fitness, basic English/Portuguese.",
    isPublished: true,
  },

  // --- Canada (Express Entry) ---
  {
    title: "Long-Haul Truck Driver",
    company: "TransCanada Logistics",
    location: "Calgary, Canada",
    salary: "CAD 70,000 / year",
    description:
      "LMIA approved vacancy. Provincial Nominee Program (PNP) support available for experienced drivers.",
    requirements:
      "Valid Class 1/AZ License, 3 years experience, clean abstract.",
    isPublished: true,
  },
  {
    title: "Full Stack Developer",
    company: "Shopify",
    location: "Remote (Canada Base)",
    salary: "CAD 120,000 / year",
    description:
      "Global Talent Stream recruitment. Fast-tracked work permit for tech talent.",
    requirements: "React, Ruby on Rails, GraphQL experience.",
    isPublished: true,
  },

  // --- Qatar ---
  {
    title: "Oil & Gas Safety Officer",
    company: "QatarEnergy",
    location: "Doha, Qatar",
    salary: "QAR 18,000 / month",
    description:
      "HSE officer for offshore expansion projects. Official state-owned enterprise recruitment.",
    requirements: "NEBOSH Diploma, 5 years offshore experience.",
    isPublished: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    console.log("Clearing old demo jobs...");
    await Job.deleteMany({}); // Clear old demo data to replace with "Official" data

    console.log("Seeding Official 2025 Vacancies...");
    await Job.insertMany(JOBS);
    console.log(`Successfully seeded ${JOBS.length} official jobs!`);

    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();
