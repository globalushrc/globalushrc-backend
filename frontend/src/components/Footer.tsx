import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaArrowRight,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 pt-24 pb-12 overflow-hidden border-t border-slate-800">
      {/* WhatsApp Floating-style Button in Footer */}

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-teal-400 to-blue-600"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                Global US HRC
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed lg:max-w-sm">
                Empowering businesses to scale beyond borders with expert HR
                strategy, local compliance, and talent solutions worldwide.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400">
                Connect With Us
              </h4>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {[
                  {
                    icon: <FaWhatsapp />,
                    link: "https://wa.me/447956903957",
                    color: "hover:bg-emerald-600 hover-glow-whatsapp",
                  },
                  {
                    icon: <FaLinkedin />,
                    link: "#",
                    color: "hover:bg-blue-600 hover-glow-linkedin",
                  },
                  {
                    icon: <FaTwitter />,
                    link: "#",
                    color: "hover:bg-slate-800 hover-glow-twitter",
                  },
                  {
                    icon: <FaFacebook />,
                    link: "#",
                    color: "hover:bg-blue-700 hover-glow-facebook",
                  },
                  {
                    icon: <FaInstagram />,
                    link: "#",
                    color: "hover:bg-pink-600 hover-glow-instagram",
                  },
                  {
                    icon: <FaYoutube />,
                    link: "#",
                    color: "hover:bg-red-600 hover-glow-youtube",
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className={`w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-xl text-gray-400 transition-all duration-500 hover:-translate-y-2 hover:text-white ${social.color} shadow-lg relative border border-slate-700/50 hover:border-transparent`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-8 text-lg">Quick Access</h4>
            <ul className="space-y-4">
              {[
                "About Us",
                "Our Services",
                "Global Coverage",
                "Industries",
                "Resources",
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 hover:text-white transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-blue-400">
                      <FaArrowRight className="text-xs" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-8 text-lg">Core Services</h4>
            <ul className="space-y-4">
              {[
                "HR Strategy & Advisory",
                "Compliance Guidance",
                "HR Documentation",
                "Talent Management",
                "Visa & Mobility",
              ].map((service, idx) => (
                <li
                  key={idx}
                  className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter/Contact */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-white font-bold mb-4 text-lg">
                Ready to grow?
              </h4>
              <p className="text-gray-400 text-sm mb-6">
                Schedule a strategy session with our advisors today.
              </p>
              <Link
                to="/contact"
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-xl"
              >
                Book Session <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Global US HRC. Excellence in
              Mobility.
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700"></div>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link
                to="/disclaimer"
                className="hover:text-white transition-colors"
              >
                Legal
              </Link>
            </div>
          </div>

          <div className="text-xs text-gray-600 text-center md:text-right max-w-md">
            Global US HRC provides advisory services only. We are not a law firm
            and do not provide direct legal representation.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
