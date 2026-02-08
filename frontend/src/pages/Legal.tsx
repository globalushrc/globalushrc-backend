import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FaShieldAlt,
  FaFileContract,
  FaExclamationTriangle,
} from "react-icons/fa";

const LegalPage = () => {
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
      : ["/assets/images/contact_hero_bg.png"]; // Using contact bg as default for legal

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

  const location = useLocation();
  const path = location.pathname;

  let content = {
    title: "Legal Information",
    icon: <FaShieldAlt className="text-blue-600" />,
    lastUpdated: "January 2026",
    sections: [
      {
        title: "Introduction",
        text: "Generic legal information for Global US HR Consultant.",
      },
    ],
  };

  if (path === "/privacy") {
    content = {
      title: "Privacy Policy",
      icon: <FaShieldAlt className="text-emerald-600" />,
      lastUpdated: "January 31, 2026",
      sections: [
        {
          title: "Introduction",
          text: "At Global US HR Consultant, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.",
        },
        {
          title: "The Data We Collect",
          text: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Technical Data, Usage Data.",
        },
        {
          title: "How We Use Your Data",
          text: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide services to you, to improve our website, and to comply with legal obligations.",
        },
      ],
    };
  } else if (path === "/terms") {
    content = {
      title: "Terms & Conditions",
      icon: <FaFileContract className="text-blue-600" />,
      lastUpdated: "January 31, 2026",
      sections: [
        {
          title: "Agreement to Terms",
          text: "By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy.",
        },
        {
          title: "Services",
          text: "Global US HR Consultant provides HR consulting and visa assistance services. All services are subject to the specific terms of the engagement agreement signed between the parties.",
        },
        {
          title: "Intellectual Property",
          text: "The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and trademarks.",
        },
      ],
    };
  } else if (path === "/disclaimer") {
    content = {
      title: "Disclaimer",
      icon: <FaExclamationTriangle className="text-amber-600" />,
      lastUpdated: "January 31, 2026",
      sections: [
        {
          title: "General Information",
          text: "The information provided by Global US HR Consultant on this website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind.",
        },
        {
          title: "Not Legal Advice",
          text: "The information on this website does not constitute legal advice. While we provide HR and visa consulting, you should consult with qualified legal professionals for specific legal matters.",
        },
      ],
    };
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-12 text-white text-center relative overflow-hidden">
          {/* Dynamic Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
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
                animate={{ opacity: 0.05, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <img
                  src="/logo.png"
                  alt="Logo Watermark"
                  className="w-[300px] h-[300px] object-contain invert brightness-200"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl z-0">
            {content.icon}
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-3xl mb-6">
              {content.icon}
            </div>
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            <p className="text-gray-400">Last Updated: {content.lastUpdated}</p>
          </div>
        </div>

        <div className="p-12">
          {content.sections.map((section, idx) => (
            <div key={idx} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {section.text}
              </p>
            </div>
          ))}

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 mb-6 italic">
              If you have any questions regarding our{" "}
              {content.title.toLowerCase()}, please contact us.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
