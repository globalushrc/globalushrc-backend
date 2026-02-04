import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "/logo.png"; // Updated import to use the logo in public folder

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Global Coverage", path: "/global-coverage" },
    { name: "Industries", path: "/industries" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  const isWhitePage = [
    "/privacy",
    "/terms",
    "/disclaimer",
    "/documents",
  ].includes(location.pathname);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isWhitePage ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="Global US HR Consultant"
            className="h-10 md:h-11 w-auto object-contain transition-all duration-300"
            style={{
              filter:
                scrolled || isWhitePage
                  ? "brightness(0) saturate(100%) invert(18%) sepia(88%) saturate(2643%) hue-rotate(209deg) brightness(94%) contrast(92%)"
                  : "none",
            }}
          />
          <span
            className={`text-base md:text-lg font-bold uppercase tracking-tight whitespace-nowrap ${scrolled || isWhitePage ? "text-blue-900" : "text-white"}`}
          >
            Global US HRC
          </span>
        </Link>

        {/* Desktop Menu - Center */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-8 gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-sm font-bold tracking-tight transition-colors group whitespace-nowrap ${
                scrolled || isWhitePage
                  ? "text-slate-700 hover:text-blue-600"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button - Right */}
        <div className="hidden lg:block shrink-0">
          <Link
            to="/book-consultation"
            className="px-6 py-3 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 whitespace-nowrap uppercase tracking-wider"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile Toggle & Action */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link
            to="/book-consultation"
            className="px-2.5 py-1.5 md:px-3 md:py-2 bg-blue-600 text-white text-[10px] md:text-xs font-bold rounded shadow-md hover:bg-blue-700 transition-colors"
          >
            Book Now
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl focus:outline-none ${
              scrolled || isWhitePage ? "text-slate-800" : "text-white"
            }`}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-6 px-4 flex flex-col gap-4 lg:hidden animate-fade-in-down">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-800 font-medium text-lg border-b border-gray-100 pb-2"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/book-consultation"
            onClick={() => setIsOpen(false)}
            className="w-full text-center px-5 py-3 bg-primary text-white font-semibold rounded-md shadow-md"
          >
            Book Consultation
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
