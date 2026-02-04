import ContactForm from "../components/ContactForm";
import { FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/contact_hero_bg.png')] bg-cover bg-center opacity-10"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slower"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold text-teal-300">
              We're Here to Help
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-teal-200 bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to optimize your global workforce? Our expert team is standing
            by to help you navigate international HR challenges.
          </p>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Info Column */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-50 rounded-full">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Contact Information
                  </span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Whether you need a quick compliance check or a full-scale
                  global expansion strategy, our team is here to help you
                  succeed.
                </p>
              </div>

              <div className="grid gap-5">
                {/* Email Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-2 text-lg">
                        Email Us
                      </h3>
                      <a
                        href="mailto:info.globalushrc@gmail.com?subject=Inquiry%20from%20Global%20US%20HRC%20Website"
                        className="text-gray-700 hover:text-blue-600 transition-colors font-medium block cursor-pointer"
                      >
                        info.globalushrc@gmail.com
                      </a>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Response within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone/WhatsApp Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                      <FaWhatsapp className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-2 text-lg">
                        Call / WhatsApp
                      </h3>
                      <a
                        href="https://wa.me/447956903957"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-emerald-600 transition-colors font-medium text-lg block"
                      >
                        +44 7956 903 957
                      </a>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Mon-Fri, 9am - 6pm GMT
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-2 text-lg">
                        Headquarters
                      </h3>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=London,+United+Kingdom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-purple-600 transition-colors font-medium block"
                      >
                        London, United Kingdom
                      </a>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Operating Globally
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
