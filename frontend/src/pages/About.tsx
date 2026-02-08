import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaHandshake,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

const About = () => {
  const [siteSettings, setSiteSettings] = useState<any>({ hero_images: [] });

  const getApiUrl = () => {
    const hostname = window.location.hostname;
    return import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const [currentImage, setCurrentImage] = useState(0);
  const defaultHero =
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=100&w=3840";
  const heroImages =
    siteSettings.hero_images && siteSettings.hero_images.length > 0
      ? siteSettings.hero_images
      : [defaultHero];

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
  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="relative py-24 bg-slate-900 text-white overflow-hidden min-h-[400px] flex items-center">
        {/* Dynamic Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImages[currentImage]}')` }}
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
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            About Global US HRC
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your strategic partner in navigating the complexities of the global
            workforce.
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1522083165195-3424ed129620?q=100&w=3840"
                  alt="Corporate Landmark"
                  className="relative rounded-lg shadow-2xl w-full h-[400px] object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-6">
                Who We Are
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Global US HRC is a premier consultancy firm dedicated to
                empowering organizations to scale globally. We specialize in
                bridging the gap between complex international labor laws and
                your business objectives.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                With a presence across key markets in Europe, Asia, the Middle
                East, and the Americas, we provide actionable strategies that
                ensure compliance, foster culture, and drive performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-t-8 border-blue-600 group">
              <div className="mb-6 p-4 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                <FaChartLine className="text-4xl text-blue-600 group-hover:text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To serve as the catalyst for global business growth by
                delivering expert HR advisory, ensuring rigorous compliance, and
                implementing ethical workforce strategies that transcend
                borders.
              </p>
            </div>
            <div className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-t-8 border-teal-500 group">
              <div className="mb-6 p-4 bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                <FaGlobe className="text-4xl text-teal-600 group-hover:text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be the world's most trusted partner for distributed workforce
                solutions, defining the future of international HR with
                integrity, innovation, and expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Values */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800">
              Our Core Values
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: FaGlobe,
                title: "Global Mindset",
                text: "Thinking beyond borders to connect cultures.",
              },
              {
                icon: FaShieldAlt,
                title: "Integrity",
                text: "Unwavering commitment to ethical standards.",
              },
              {
                icon: FaHandshake,
                title: "Partnership",
                text: "Your success is our measure of success.",
              },
              {
                icon: FaUsers,
                title: "People First",
                text: "Empowering the human element of business.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-8 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300"
              >
                <div className="text-5xl text-blue-600 mb-6 flex justify-center">
                  <value.icon />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {value.title}
                </h3>
                <p className="text-gray-500">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ethical Practice Section */}
      <div className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/1454165804606-c3d57bc86b40.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ethical & Confidential Practice
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              We understand that HR deals with sensitive data and critical
              business decisions. Our practice is built on a foundation of
              strict confidentiality and adherence to global data privacy
              standards (GDPR, CCPA, etc.).
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We do not provide legal representation but offer high-level
              advisory aligned with local employment frameworks to guide your
              legal teams effectively.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Data Privacy Compliance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Conflict of Interest Mgmt</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Anti-Corruption Policies</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Inclusive Hiring Practices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
