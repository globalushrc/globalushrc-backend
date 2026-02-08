import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLaptopCode,
  FaRocket,
  FaIndustry,
  FaHeartbeat,
  FaTruck,
  FaBriefcase,
  FaShoppingCart,
  FaGraduationCap,
  FaSeedling,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const industryImages = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=100&w=3840", // Liverpool (Tech)
  "https://images.unsplash.com/photo-1541003365608-f327299a9971?q=100&w=3840", // Cambridge (Startups)
  "https://images.unsplash.com/photo-1549421263-5494883f05f4?q=100&w=3840", // Sheffield (Manufacturing)
  "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=100&w=3840", // Bath Abbey (Healthcare/Wellness)
  "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=100&w=3840", // Berlin (Logistics)
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=100&w=3840", // Dubai (Finance)
  "https://images.unsplash.com/photo-1526131399667-5316739344c3?q=100&w=3840", // London Retail
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=100&w=3840", // Education (Landmark)
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=100&w=3840", // Green Energy (Cotswolds)
  "https://images.unsplash.com/photo-1517733325601-499c887bd901?q=100&w=3840", // Corporate (Canary Wharf)
];

const Industries = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [siteSettings, setSiteSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
        const res = await fetch(`${apiUrl}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const heroImages =
    siteSettings.hero_images && siteSettings.hero_images.length > 0
      ? siteSettings.hero_images
      : industryImages;

  useEffect(() => {
    if (heroImages.length <= 1) {
      setCurrentImage(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);
  const industries = [
    {
      name: "Technology & SaaS",
      icon: <FaLaptopCode />,
      image: "/assets/images/industry_tech_saas.png",
      description: "Agile HR frameworks for high-growth tech firms.",
      details:
        "Supporting rapid scaling, remote-first cultures, and IP protection across borders.",
    },
    {
      name: "Startups & Scale-ups",
      icon: <FaRocket />,
      image: "/assets/images/industry_startups.png",
      description: "Foundational HR setup for emerging global players.",
      details:
        "From first international hire to establishing foreign entities, we guide your expansion journey.",
    },
    {
      name: "Manufacturing",
      icon: <FaIndustry />,
      image: "/assets/images/industry_manufacturing.png",
      description: "Safety, compliance, and shift-work management.",
      details:
        "Addressing complex labor relations, union negotiations, and health & safety regulations worldwide.",
    },
    {
      name: "Healthcare & Life Sciences",
      icon: <FaHeartbeat />,
      image: "/assets/images/industry_healthcare.png",
      description: "Highly regulated workforce compliance.",
      details:
        "Managing credentialing, mobility for medical professionals, and strict regulatory adherence.",
    },
    {
      name: "Logistics & Supply Chain",
      icon: <FaTruck />,
      image: "/assets/images/industry_logistics.png",
      description: "Cross-border mobility and fleet HR management.",
      details:
        "Streamlining operations for a mobile workforce navigating multiple jurisdictions.",
    },
    {
      name: "Finance & Fintech",
      icon: <FaBriefcase />,
      image: "/assets/images/industry_finance.png",
      description: "Governance for financial institutions.",
      details:
        "Ensuring rigorous background checks, data security, and regulatory reporting compliance.",
    },
    {
      name: "E-commerce & Retail",
      icon: <FaShoppingCart />,
      image: "/assets/images/1441986300917-64674bd600d8.jpg",
      description: "Scalable solutions for seasonal and distributed teams.",
      details:
        "Managing high-volume hiring, seasonal contracts, and distributed customer support teams.",
    },
    {
      name: "Education",
      icon: <FaGraduationCap />,
      image: "/assets/images/1523240795612-9a054b0db644.jpg",
      description: "Global mobility for academic staff.",
      details:
        "Facilitating international assignments, research grants, and compliant academic appointments.",
    },
    {
      name: "Green Energy & Agriculture",
      icon: <FaSeedling />,
      image: "/assets/images/1466692476868-aef1dfb1e735.jpg",
      description: "Sustainable workforce practices.",
      details:
        "Supporting projects in remote locations with specialized compliance and community engagement.",
    },
  ];

  const models = [
    {
      title: "Ad-Hoc Advisory",
      desc: "Pay-as-you-go consulting for specific compliance questions or crisis management.",
      icon: "⚡",
      image: "/assets/images/1557804506-669a67965ba0.jpg",
    },
    {
      title: "Project-Based",
      desc: "Defined scope for market entry, handbook creation, or audit preparation.",
      icon: "📋",
      image: "/assets/images/1531482615713-2afd69097998.jpg",
    },
    {
      title: "Retainer Partnership",
      desc: "Ongoing strategic support acting as your dedicated Global HR extension.",
      icon: "🤝",
      image: "/assets/images/schengen_region_hero.png",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section - Clean HD Slider */}
      <div className="relative py-32 md:py-48 bg-slate-950 text-white overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${heroImages[currentImage]}')`,
              }}
            />
          </AnimatePresence>

          {/* Animated Logo Watermark */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`logo-${currentImage}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <img
                src="/logo.png"
                alt="Logo Watermark"
                className="w-[400px] h-[400px] object-contain invert brightness-200"
              />
            </motion.div>
          </AnimatePresence>

          {/* Refined Overlays for Clarity */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Industries We Serve
            </h1>
            <p className="text-xl md:text-3xl text-white font-semibold max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Tailored HR strategy and compliance mapping for diverse global
              sectors.
            </p>
          </motion.div>
        </div>

        {/* Centered Slider Indicators - Moved up for balance */}
        <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-1.5 transition-all duration-700 rounded-full ${
                idx === currentImage
                  ? "w-12 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Industry Grid */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {industries.map((ind, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src={ind.image}
                    alt={ind.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      {ind.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {ind.name}
                    </h3>
                  </div>
                  <p className="text-lg text-slate-700 font-semibold mb-3">
                    {ind.description}
                  </p>
                  <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                    {ind.details}
                  </p>
                  <div className="pt-6 border-t border-gray-50">
                    <Link
                      to="/contact"
                      className="text-blue-600 font-bold hover:gap-3 inline-flex items-center transition-all group/link hover:text-blue-500"
                    >
                      <span className="transform group-hover/link:scale-105 transition-transform">
                        Expert Consultation
                      </span>
                      <span className="transform group-hover/link:translate-x-2 transition-transform ml-2">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Models */}
      <div className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900/[0.02] -skew-y-3 transform origin-top-left"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Engagement Models
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed">
              From one-off compliance checks to full-scale HR outsourcing, we
              adapt to your pace of growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {models.map((model, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors duration-500 z-10"></div>
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-2xl text-3xl shadow-lg">
                    {model.icon}
                  </div>
                </div>

                <div className="p-10 flex-grow flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">
                    {model.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                    {model.desc}
                  </p>
                  <Link
                    to="/contact"
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg shadow-slate-900/20 active:scale-100"
                  >
                    Select Partnership
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Industries;
