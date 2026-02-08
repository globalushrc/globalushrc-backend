import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroImages = [
  {
    url: "/assets/images/uk_hero_1.png",
    name: "London Cityscape",
    theme: "light",
  },
  {
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=100&w=3840",
    name: "The London Eye",
    theme: "light",
  },
  {
    url: "/assets/images/uk_hero_2.png",
    name: "Tower Bridge, London",
    theme: "light",
  },
  {
    url: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=100&w=3840",
    name: "Big Ben & Westminster",
    theme: "dark",
  },
  {
    url: "/assets/images/uk_hero_3.png",
    name: "St Paul's Cathedral",
    theme: "light",
  },
  {
    url: "https://images.unsplash.com/photo-1505761671935-60b3a0b2f484?q=100&w=3840",
    name: "London Bridge View",
    theme: "light",
  },
];

const cyclingPhrases = [
  "Distributed Workforce",
  "Global Talent Pool",
  "UK Compliance",
  "Strategic HR Growth",
  "International Mobility",
];

const Hero = ({
  setHeroTheme,
}: {
  setHeroTheme: (t: "light" | "dark") => void;
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
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

  const heroImagesToShow =
    siteSettings.hero_images && siteSettings.hero_images.length > 0
      ? siteSettings.hero_images.map((url: string) => ({
          url,
          name: "Global HR",
          theme: "light",
        }))
      : heroImages;

  useEffect(() => {
    // Initial theme set
    if (heroImagesToShow[currentImage]) {
      setHeroTheme(heroImagesToShow[currentImage].theme as "light" | "dark");
    }
  }, [currentImage, heroImagesToShow]);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImagesToShow.length);
    }, 6000);

    const phraseTimer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % cyclingPhrases.length);
    }, 3500);

    return () => {
      clearInterval(imageTimer);
      clearInterval(phraseTimer);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background Slider - Clean HD (No Gradients) */}
      <div className="absolute inset-0 z-0 text-white">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImagesToShow[currentImage]?.url || heroImages[0].url}')`,
            }}
          />
        </AnimatePresence>

        {/* Animated Logo Watermark */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`logo-${currentImage}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src="/logo.png"
              alt="Background Logo"
              className="w-[500px] h-[500px] object-contain opacity-50 grayscale brightness-200 contrast-200"
            />
          </motion.div>
        </AnimatePresence>

        {/* Location Badge Removed per User Request */}
        {/*
        <motion.div
          key={`label-${currentImage}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute top-32 right-12 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-2xl"
        >
          <FaMapMarkerAlt className="text-red-500 text-sm animate-pulse" />
          <span className="text-white text-xs font-black uppercase tracking-[0.2em]">
            {heroImages[currentImage].name}
          </span>
        </motion.div>
        */}

        {/* Minimal Subtle Vignette for Legibility only at bottom/top */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Global HR Consulting Solutions <br className="hidden md:block" />
              for a{" "}
              <span className="inline-block align-bottom h-[1.2em] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPhrase}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-blue-500 font-extrabold drop-shadow-[0_2px_4px_rgba(37,99,235,0.3)]"
                  >
                    {cyclingPhrases[currentPhrase]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="text-lg md:text-xl font-semibold text-white mb-14 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              Supporting organizations with HR strategy, compliance guidance,
              and workforce solutions worldwide.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                BOOK A CONSULTATION
              </Link>
              <Link
                to="/contact"
                className="px-10 py-5 bg-black/30 border border-white/40 hover:border-white/60 hover:bg-black/40 text-white font-bold rounded-2xl backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg"
              >
                CONTACT US
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Centered Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`h-1 transition-all duration-700 rounded-full ${
              idx === currentImage
                ? "w-12 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                : "w-6 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
