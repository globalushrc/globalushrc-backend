import {
  FaRocket,
  FaCheckCircle,
  FaUserTie,
  FaClock,
  FaGlobe,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ConsultantSection = () => {
  const benefits = [
    {
      icon: <FaCheckCircle className="text-teal-400" />,
      text: "100% Compliance Guarantee",
    },
    {
      icon: <FaClock className="text-blue-400" />,
      text: "Fast-Track Processing",
    },
    {
      icon: <FaGlobe className="text-indigo-400" />,
      text: "50+ Countries Covered",
    },
    {
      icon: <FaUserTie className="text-amber-400" />,
      text: "Dedicated HR Experts",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Content Side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Free Consultation Service
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
              Unlock Your Global Potential with our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400">
                Premium Visa Experts
              </span>
            </h2>

            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl">
              Don't let complex regulations stall your international growth. Our
              specialized consultants provide end-to-end support for work
              permits, business visas, and executive relocation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                  <div className="text-xl group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <span className="font-medium text-gray-200">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              <Link
                to="/contact"
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-black text-lg rounded-2xl flex items-center gap-3 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Start Free Assessment</span>
                <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <Link
                to="/services#visa"
                className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all text-center"
              >
                Explore Visa Types
              </Link>
            </div>
          </div>

          {/* Visual Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-float">
              <img
                src="/assets/images/1530789253388-582c481c54b0.jpg"
                alt="Visa Consultation"
                className="w-full h-auto object-cover"
              />
              {/* Overlay stats */}
              <div className="absolute top-8 right-8 bg-blue-600/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl hidden md:block">
                <div className="text-3xl font-black mb-1">98%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                  Success Rate
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl max-w-[240px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center text-[10px]"
                      >
                        <FaUserTie />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-300">
                    +45 Consultants
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Experts available now for your region.
                </p>
              </div>
            </div>

            {/* Background geometric shapes */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/20 rounded-3xl rotate-12 -z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
