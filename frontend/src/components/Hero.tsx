import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-slate-900 to-primary text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/1486406146926-c627a92ad1ab.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Global HR Consulting Solutions for a{" "}
            <span className="text-blue-400">Distributed Workforce</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Supporting organizations with HR strategy, compliance guidance, and
            workforce solutions worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105 hover:-translate-y-1 inline-block"
            >
              Book a Consultation
            </Link>
            <Link
              to="/contact" // Assuming Contact Us is the destination
              className="px-8 py-4 bg-transparent border border-white/40 hover:bg-white text-white hover:text-slate-900 font-bold rounded-xl backdrop-blur-sm transition-all transform hover:scale-105 hover:-translate-y-1 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
