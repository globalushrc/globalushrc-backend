import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFlag,
  FaBuilding,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeEurope,
  FaBriefcase,
  FaUsers,
  FaPassport,
  FaIdCard,
  FaExchangeAlt,
  FaTools,
  FaHandshake,
  FaLaptop,
  FaCrown,
  FaUserTie,
  FaGem,
  FaHome,
  FaUserFriends,
  FaSearch,
  FaGraduationCap,
  FaRocket,
  FaLightbulb,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Helper component for visa icons
const getVisaIcon = (visa: string) => {
  const v = visa.toLowerCase();
  if (v.includes("blue card")) return <FaIdCard className="text-blue-500" />;
  if (v.includes("ict")) return <FaExchangeAlt className="text-orange-500" />;
  if (
    v.includes("worker") ||
    v.includes("specialist") ||
    v.includes("employee")
  )
    return <FaTools className="text-slate-600" />;
  if (v.includes("business")) return <FaHandshake className="text-amber-600" />;
  if (v.includes("nomad") || v.includes("remote"))
    return <FaLaptop className="text-purple-500" />;
  if (v.includes("golden") || v.includes("premium"))
    return <FaCrown className="text-yellow-500" />;
  if (v.includes("talent")) return <FaLightbulb className="text-indigo-500" />;
  if (v.includes("investor") || v.includes("founder"))
    return <FaGem className="text-emerald-500" />;
  if (v.includes("residency") || v.includes("permit"))
    return <FaHome className="text-teal-600" />;
  if (v.includes("family") || v.includes("relationship"))
    return <FaUserFriends className="text-pink-500" />;
  if (v.includes("seeker") || v.includes("search"))
    return <FaSearch className="text-gray-500" />;
  if (v.includes("study") || v.includes("academic"))
    return <FaGraduationCap className="text-blue-400" />;
  if (v.includes("startup") || v.includes("innovator"))
    return <FaRocket className="text-red-500" />;
  if (v.includes("visa") || v.includes("employment"))
    return <FaUserTie className="text-slate-700" />;
  return <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>;
};

// Helper component to enable per-region state (active image)
const RegionCard = ({ region, index }: { region: any; index: number }) => {
  const [activeCountry, setActiveCountry] = useState(
    region.countries[0] || null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCountryClick = (country: any) => {
    if (country.image && country.image !== activeCountry?.image) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCountry(country);
        setIsTransitioning(false);
      }, 300); // Wait for fade out
    } else {
      setActiveCountry(country);
    }
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 group overflow-hidden border border-slate-100 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
    >
      {/* Image Section */}
      <div className="md:w-1/2 relative min-h-[500px] overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>

        {/* Image Element with transition support */}
        <img
          src={activeCountry?.image || region.image}
          alt={activeCountry?.name || region.name}
          className={`absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-1000 ease-out ${isTransitioning ? "opacity-50 blur-sm" : "opacity-100 blur-0"}`}
        />

        <div className="absolute bottom-8 left-8 z-20 flex flex-col items-start gap-3">
          <span className="bg-white/95 backdrop-blur-md text-slate-900 text-sm font-bold px-5 py-2 rounded-full uppercase tracking-wider shadow-xl ring-1 ring-black/5">
            {activeCountry?.name || region.name}
          </span>
          {activeCountry?.landmark && (
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
              <FaMapMarkerAlt className="text-red-400" />{" "}
              {activeCountry.landmark}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center relative">
        {/* Decorative Icon Background */}
        <div className="absolute top-10 right-10 text-[12rem] text-slate-50 opacity-50 pointer-events-none transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          {region.icon}
        </div>

        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-4xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            {region.icon}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
              {region.name}
            </h2>
            <div className="h-1.5 w-16 bg-slate-200 mt-3 rounded-full group-hover:w-full group-hover:bg-blue-300 transition-all duration-700 ease-in-out"></div>
          </div>
        </div>

        <p className="text-lg text-slate-600 font-normal mb-8 leading-loose text-justify relative z-10">
          {region.description}
        </p>

        {/* Active Country Visa Details */}
        <div className="mb-8 bg-slate-50 p-8 rounded-3xl border border-slate-100 animate-fade-in relative z-10 group-hover:border-blue-100 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <FaPassport className="text-blue-600 text-xl" />
            <h4 className="font-bold text-slate-800">
              Available Visa Solutions:{" "}
              <span className="text-blue-600">{activeCountry?.name}</span>
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(
              activeCountry?.visas || [
                { name: "Work Permits", time: "2-4 months" },
                { name: "Business Visas", time: "2-4 weeks" },
                { name: "Family Visa", time: "1-3 months" },
              ]
            ).map((visa: any, vIdx: number) => (
              <div
                key={vIdx}
                className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-3 rounded-2xl border border-slate-200/50 hover:border-blue-200 hover:shadow-md transition-all group/visa"
              >
                <div className="text-lg group-hover/visa:scale-110 transition-transform">
                  {getVisaIcon(typeof visa === "string" ? visa : visa.name)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">
                    {typeof visa === "string" ? visa : visa.name}
                  </span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider bg-blue-50 w-fit px-2 py-0.5 rounded-full mt-1">
                    Est: {typeof visa === "string" ? "N/A" : visa.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Select a Market to View Details
          </h3>
          <div className="flex flex-wrap gap-2">
            {region.countries.map((country: any, i: number) => (
              <button
                key={i}
                onClick={() => handleCountryClick(country)}
                className={`pl-2 pr-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-50 ${activeCountry?.code === country.code ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600"}`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${country.code}.png`}
                  alt={`${country.name} Flag`}
                  className="w-5 h-auto rounded-sm shadow-sm opacity-90"
                />
                {country.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <Link
            to="/contact"
            className="inline-flex items-center text-slate-900 font-bold hover:text-blue-600 transition-colors group/link text-lg"
          >
            <span className="border-b-2 border-slate-200 group-hover/link:border-blue-600 pb-0.5 transition-colors">
              Process Visa for {activeCountry?.name || region.name}
            </span>
            <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const coverageImages = [
  {
    url: "/assets/images/france_eiffel.png",
    name: "Paris, France",
  },
  {
    url: "/assets/images/burj_khalifa_correct.jpg",
    name: "Dubai, UAE",
  },
  {
    url: "/assets/images/australia_highres.jpg",
    name: "Sydney, Australia",
  },
  {
    url: "/assets/images/toronto_real.png",
    name: "Toronto, Canada",
  },
  {
    url: "/assets/images/belgium_grand_place.png",
    name: "Brussels, Belgium",
  },
];

const GlobalCoverage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % coverageImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const euVisas = [
    { name: "EU Blue Card", time: "1-3 months" },
    { name: "ICT Permit", time: "2-4 months" },
    { name: "Business Visa", time: "2-4 weeks" },
    { name: "Worker Visa", time: "2-3 months" },
  ];
  const meVisas = [
    { name: "Employment Visa", time: "1-3 weeks" },
    { name: "Investor Visa", time: "2-4 weeks" },
    { name: "Golden Visa", time: "1-2 months" },
    { name: "Family Visa", time: "2-4 weeks" },
  ];

  const regions = [
    {
      name: "Schengen Region",
      icon: <FaGlobeEurope />,
      image: "/assets/images/schengen_region_hero.png",
      countries: [
        {
          name: "Germany",
          code: "de",
          image: "/assets/images/1560969184-10fe8719e047.jpg",
          landmark: "Berlin Skyline",
          visas: [
            { name: "EU Blue Card", time: "1-2 months" },
            { name: "Specialist Visa", time: "2-3 months" },
            { name: "Job Seeker", time: "1-3 months" },
            { name: "ICT Permit", time: "1-2 months" },
          ],
        },
        {
          name: "France",
          code: "fr",
          image: "/assets/images/france_eiffel.png",
          landmark: "Eiffel Tower",
          visas: [
            { name: "Talent Passport", time: "2-3 months" },
            { name: "VLS-TS", time: "1-2 months" },
            { name: "Business Visa", time: "2-4 weeks" },
            { name: "ICT", time: "2 months" },
          ],
        },
        {
          name: "Netherlands",
          code: "nl",
          image: "/assets/images/1534351590666-13e3e96b5017.jpg",
          landmark: "Amsterdam Canals",
          visas: [
            { name: "Highly Skilled Migrant", time: "2-4 weeks" },
            { name: "Startup Visa", time: "3 months" },
            { name: "ICT", time: "1 month" },
            { name: "Search Year", time: "1 month" },
          ],
        },
        {
          name: "Belgium",
          code: "be",
          image: "/assets/images/belgium_grand_place.png",
          landmark: "Grand Place",
          visas: euVisas,
        },
        {
          name: "Spain",
          code: "es",
          image: "/assets/images/1583422409516-2895a77efded.jpg",
          landmark: "Sagrada Família",
          visas: [
            { name: "Digital Nomad Visa", time: "1 month" },
            { name: "Golden Visa", time: "1-2 months" },
            { name: "Investor", time: "2 months" },
            { name: "Employee", time: "2-3 months" },
          ],
        },
        {
          name: "Italy",
          code: "it",
          image: "/assets/images/1552832230-c0197dd311b5.jpg",
          landmark: "Colosseum",
          visas: euVisas,
        },
        {
          name: "Austria",
          code: "at",
          image: "/assets/images/1609856878074-cf31e21ccb6b.jpg",
          landmark: "Hallstatt",
          visas: [
            { name: "Red-White-Red Card", time: "2 months" },
            { name: "EU Blue Card", time: "2 months" },
            { name: "Business", time: "3 weeks" },
          ],
        },
        {
          name: "Switzerland",
          code: "ch",
          image: "/assets/images/1515488764276-beab7607c1e6.jpg",
          landmark: "Matterhorn",
          visas: [
            { name: "L / B / C Permits", time: "2-4 months" },
            { name: "Federal Visa", time: "2-3 months" },
            { name: "Business", time: "2-4 weeks" },
          ],
        },
        {
          name: "Sweden",
          code: "se",
          image: "/assets/images/1509356843151-3e7d96241e11.jpg",
          landmark: "Stockholm Old Town (Gamla Stan)",
          visas: euVisas,
        },
        {
          name: "Norway",
          code: "no",
          image: "/assets/images/1620029342551-7f8e3f435ce8.jpg",
          landmark: "Geirangerfjord",
          visas: euVisas,
        },
        {
          name: "Portugal",
          code: "pt",
          image: "/assets/images/1555881400-74d7acaacd81.jpg",
          landmark: "Belém Tower, Lisbon",
          visas: [
            { name: "D7 Visa", time: "3-4 months" },
            { name: "Digital Nomad", time: "2 months" },
            { name: "Golden Visa", time: "2-3 months" },
            { name: "HQA", time: "1 month" },
          ],
        },
        {
          name: "Denmark",
          code: "dk",
          image: "/assets/images/1513622470522-26c3c8a854bc.jpg",
          landmark: "Nyhavn, Copenhagen",
          visas: euVisas,
        },
        {
          name: "Czech Republic",
          code: "cz",
          image: "/assets/images/1541849546-d1693816eb77.jpg",
          landmark: "Charles Bridge, Prague",
          visas: euVisas,
        },
        {
          name: "Poland",
          code: "pl",
          image: "/assets/images/1519197924294-4ba991a11128.jpg",
          landmark: "Old Town Market Square, Warsaw",
          visas: euVisas,
        },
        {
          name: "Finland",
          code: "fi",
          image: "/assets/images/1531771686035-25f47595e061.jpg",
          landmark: "Helsinki Cathedral",
          visas: euVisas,
        },
        {
          name: "Greece",
          code: "gr",
          image: "/assets/images/1603565816030-6b389eeb23cb.jpg",
          landmark: "Parthenon, Athens",
          visas: euVisas,
        },
        {
          name: "Malta",
          code: "mt",
          image: "/assets/images/1558273648-939db276d499.jpg",
          landmark: "Upper Barrakka Gardens, Valletta",
          visas: euVisas,
        },
        {
          name: "Slovakia",
          code: "sk",
          image: "/assets/images/1563214532-68c67c570b5d.jpg",
          landmark: "Bratislava Castle",
          visas: euVisas,
        },
        {
          name: "Slovenia",
          code: "si",
          image: "/assets/images/1595188800922-38682a0b12bc.jpg",
          landmark: "Lake Bled",
          visas: euVisas,
        },
        {
          name: "Hungary",
          code: "hu",
          image: "/assets/images/1565426873118-a1bedaa7d6c7.jpg",
          landmark: "Parliament Building, Budapest",
          visas: euVisas,
        },
        {
          name: "Estonia",
          code: "ee",
          image: "/assets/images/1562943260-f197472097e3.jpg",
          landmark: "Tallinn Old Town",
          visas: [
            { name: "Digital Nomad", time: "2-4 weeks" },
            { name: "Startup Visa", time: "1-2 months" },
            { name: "e-Residency", time: "1 month" },
          ],
        },
        {
          name: "Latvia",
          code: "lv",
          image: "/assets/images/1565518423403-2410a5676e19.jpg",
          landmark: "Freedom Monument, Riga",
          visas: euVisas,
        },
        {
          name: "Lithuania",
          code: "lt",
          image: "/assets/images/1590483842426-146313936a71.jpg",
          landmark: "Gediminas Tower, Vilnius",
          visas: euVisas,
        },
        {
          name: "Luxembourg",
          code: "lu",
          image: "/assets/images/1587383626779-195996452296.jpg",
          landmark: "Casemates du Bock",
          visas: euVisas,
        },
        {
          name: "Iceland",
          code: "is",
          image: "/assets/images/1476610182048-b716b8518aae.jpg",
          landmark: "Hallgrímskirkja, Reykjavík",
          visas: euVisas,
        },
        {
          name: "Croatia",
          code: "hr",
          image: "/assets/images/1559132174-89c09fe55883.jpg",
          landmark: "Old City of Dubrovnik",
          visas: euVisas,
        },
        {
          name: "Romania",
          code: "ro",
          image: "/assets/images/1589330273594-fade1ee91647.jpg",
          landmark: "Bran Castle (Dracula's Castle)",
          visas: euVisas,
        },
        {
          name: "Serbia",
          code: "rs",
          image: "/assets/images/1559810857-c1b721bf6e72.jpg",
          landmark: "Belgrade Fortress",
          visas: [
            { name: "Work Permit", time: "1 month" },
            { name: "Business Visa", time: "2-3 weeks" },
            { name: "Residency", time: "2 months" },
            { name: "Family Visa", time: "1 month" },
          ],
        },
      ],
      description: "Comprehensive compliance solutions for the Eurozone.",
      details:
        "Expert navigation of Works Councils, GDPR mandates, and localized labor contracts.",
    },
    {
      name: "United Kingdom",
      icon: <FaFlag />,
      image: "/assets/images/1526129318478-62ed807ebdf9.jpg",
      landmark: "Big Ben & Palace of Westminster",
      countries: [
        {
          name: "United Kingdom",
          code: "gb",
          image: "/assets/images/1513635269975-59663e0ac1ad.jpg",
          visas: [
            { name: "Skilled Worker", time: "3-8 weeks" },
            { name: "Global Talent", time: "1-4 months" },
            { name: "Innovator Founder", time: "2 months" },
            { name: "Health & Care", time: "3 weeks" },
          ],
        },
        {
          name: "UK Seasonal Hiring",
          code: "gb",
          image: "/assets/images/uk_seasonal_farm.png",
          landmark: "Horticulture & Poultry",
          visas: [
            { name: "Seasonal Worker", time: "6 Months Max" },
            { name: "Horticulture", time: "Spring/Summer" },
            { name: "Poultry Work", time: "Oct-Dec" },
            { name: "Fruit Picking", time: "Apr-Oct" },
          ],
        },
      ],
      description:
        "Strategic employment advisory for the UK market. NOW HIRING: Seasonal workers for 2026 season.",
      details:
        "Handling IR35 assessments, post-Brexit workforce regulations, and large-scale seasonal recruitment for the agricultural sector (Horticulture & Poultry).",
    },
    {
      name: "North America",
      icon: <FaGlobeAmericas />,
      image: "/assets/images/1486325212027-8081e485255e.jpg",
      countries: [
        {
          name: "Canada",
          code: "ca",
          image: "/assets/images/canada_real.png",
          landmark: "Moraine Lake",
          visas: [
            { name: "LMIA", time: "2-4 months" },
            { name: "Global Talent Stream", time: "2 weeks" },
            { name: "Express Entry", time: "6 months" },
            { name: "Work Permit", time: "2-3 months" },
          ],
        },
      ],
      description: "Provincial HR guidance across Canada.",
      details:
        "Bilingual contract drafting (Quebec), provincial standards compliance, and benefits administration.",
    },
    {
      name: "Asia Pacific",
      icon: <FaGlobeAsia />,
      image: "/assets/images/1503899036084-c55cdd92da26.jpg",
      countries: [
        {
          name: "Australia",
          code: "au",
          image: "/assets/images/australia_sydney.png",
          landmark: "Sydney Opera House",
          visas: [
            { name: "TSS 482", time: "1-3 months" },
            { name: "Subclass 186", time: "6-12 months" },
            { name: "Business Innovation", time: "3 months" },
            { name: "Working Holiday", time: "2 weeks" },
          ],
        },
        {
          name: "Singapore",
          code: "sg",
          image: "/assets/images/1525625293386-3f8f99389edd.jpg",
          landmark: "Marina Bay Sands",
          visas: [
            { name: "Employment Pass", time: "3-8 weeks" },
            { name: "S-Pass", time: "3-6 weeks" },
            { name: "EntrePass", time: "2 months" },
            { name: "DEP", time: "3 weeks" },
          ],
        },
        {
          name: "Japan",
          code: "jp",
          image: "/assets/images/1503899036084-c55cdd92da26.jpg",
          landmark: "Tokyo Tower",
          visas: [
            { name: "Highly Skilled Professional", time: "1-2 months" },
            { name: "Specified Skilled Worker", time: "2 months" },
            { name: "Business Manager", time: "3-4 months" },
            { name: "Engineering", time: "2 months" },
          ],
        },
        {
          name: "India",
          code: "in",
          image: "/assets/images/1524492412937-b28074a5d7da.jpg",
          landmark: "Taj Mahal",
          visas: [
            { name: "Employment Visa", time: "2-4 weeks" },
            { name: "Business Visa", time: "1 week" },
            { name: "Projects Visa", time: "2 weeks" },
            { name: "E-Visa", time: "72 hours" },
          ],
        },
        {
          name: "Philippines",
          code: "ph",
          image: "/assets/images/1518509562904-e7ef99cdcc86.jpg",
          landmark: "El Nido, Palawan",
          visas: [
            { name: "9(G) Visa", time: "2-3 months" },
            { name: "PEZA Visa", time: "1 month" },
            { name: "Special Working Permit", time: "2 weeks" },
          ],
        },
        {
          name: "Nepal",
          code: "np",
          image: "/assets/images/1544735716-392fe2489ffa.jpg",
          landmark: "Swayambhunath Stupa",
          visas: [
            { name: "Business Visa", time: "1 week" },
            { name: "Relationship Visa", time: "2 weeks" },
            { name: "Missionary Visa", time: "1 month" },
            { name: "Study Visa", time: "2 weeks" },
          ],
        },
      ],
      description: "High-growth market expansion support.",
      details:
        "Navigating diverse regulatory frameworks from Australia's Fair Work Act to Asian labor codes.",
    },
    {
      name: "Middle East",
      icon: <FaBuilding />,
      image: "/assets/images/1597659840241-37e2b9c2f55f.jpg",
      countries: [
        {
          name: "UAE",
          code: "ae",
          image: "/assets/images/burj_khalifa_correct.jpg",
          landmark: "Burj Khalifa",
          visas: [
            { name: "Golden Visa", time: "1 month" },
            { name: "Freelance Permit", time: "2 weeks" },
            { name: "Employment Visa", time: "1-2 weeks" },
            { name: "Mission Visa", time: "48 hours" },
          ],
        },
        {
          name: "Saudi Arabia",
          code: "sa",
          image: "/assets/images/1586724237569-f3d0c1dee8c6.jpg",
          landmark: "Kingdom Centre",
          visas: [
            { name: "Premium Residency", time: "1 month" },
            { name: "Work Visa", time: "2 weeks" },
            { name: "Business Visit", time: "1 week" },
            { name: "Investor", time: "2 weeks" },
          ],
        },
        {
          name: "Qatar",
          code: "qa",
          image: "/assets/images/1575549594586-45ef42674258.jpg",
          landmark: "Doha Skyline",
          visas: meVisas,
        },
        {
          name: "Oman",
          code: "om",
          image: "/assets/images/1577717474975-b83a21685a08.jpg",
          landmark: "Sultan Qaboos Grand Mosque",
          visas: meVisas,
        },
        {
          name: "Bahrain",
          code: "bh",
          image: "/assets/images/1588661746261-2404e1763138.jpg",
          landmark: "Bahrain World Trade Center",
          visas: meVisas,
        },
      ],
      description: "HR frameworks for the GCC region.",
      details:
        "Specialized advisory on local labor laws, Emiratization/Saudization requirements, and end-of-service gratuity.",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Immersive Hero Section - Clean HD Slider */}
      <div className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden bg-[#020617]">
        {/* Background Slider Layer */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${coverageImages[currentImage].url}')`,
              }}
            />
          </AnimatePresence>

          {/* Location Badge */}
          <motion.div
            key={`label-${currentImage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-12 right-12 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <FaMapMarkerAlt className="text-red-500 text-sm" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {coverageImages[currentImage].name}
            </span>
          </motion.div>

          {/* Refined Overlays for Clarity */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-none mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Global Coverage
            </h1>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Local Expertise.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="text-lg md:text-xl text-white font-semibold max-w-2xl mx-auto leading-relaxed mb-16 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]"
          >
            Empowering your enterprise to operate seamlessly across 50+
            countries, eliminating the barriers of international HR and
            compliance with precision and speed.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* 
            <Link
              to="/contact"
              className="px-10 py-5 bg-white text-blue-900 font-black text-lg rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1"
            >
              Start Free Assessment
            </Link>
            */}

            <a
              href="#regions"
              className="text-white hover:text-blue-400 font-bold text-lg transition-colors py-4 flex items-center gap-2 border-b-2 border-white/40 hover:border-blue-400 drop-shadow-md"
            >
              Explore Markets
            </a>
          </div>
        </div>

        {/* Centered Slider Indicators - Moved up to avoid stats bar overlap */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {coverageImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-1.5 transition-all duration-700 rounded-full ${
                idx === currentImage
                  ? "w-12 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.9)]"
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator - Moved up */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-20">
          <div className="w-1 h-8 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Modern Stats Section - Executive Glassmorphism (35% Transparent) */}
      <div
        id="regions"
        className="relative z-20 container mx-auto px-4 max-w-6xl py-12"
      >
        <div className="bg-white/35 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40 flex flex-col md:flex-row items-stretch overflow-hidden">
          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center group border-b md:border-b-0 md:border-r border-white/20 hover:bg-white/10 transition-colors duration-500">
            <div className="w-16 h-16 bg-blue-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <FaGlobeEurope className="text-3xl" />
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tight drop-shadow-sm">
              50+
            </div>
            <div className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[11px]">
              Countries Served
            </div>
          </div>

          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center group border-b md:border-b-0 md:border-r border-white/20 hover:bg-white/10 transition-colors duration-500">
            <div className="w-16 h-16 bg-teal-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-teal-600 mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <FaClock className="text-3xl" />
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tight drop-shadow-sm">
              24/7
            </div>
            <div className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[11px]">
              Expert Support
            </div>
          </div>

          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors duration-500">
            <div className="w-16 h-16 bg-emerald-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <FaCheckCircle className="text-3xl" />
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tight drop-shadow-sm">
              100%
            </div>
            <div className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[11px]">
              Compliance Accuracy
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Regional Breakdown
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-20 max-w-7xl mx-auto">
            {regions.map((region, index) => (
              <RegionCard key={index} region={region} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      {/* Methodology Section */}
      <div className="bg-[#0f172a] text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/global_map_overlay.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-transparent to-[#0f172a]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Our Methodology
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
              A proven, systematic framework designed for international success
              and risk mitigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Assess",
                desc: "Comprehensive risk exposure analysis & strategic gap identification.",
                icon: <FaBriefcase />,
                step: "01",
              },
              {
                title: "Structure",
                desc: "Tailored entity planning versus EOR solutions for optimal operation.",
                icon: <FaBuilding />,
                step: "02",
              },
              {
                title: "Manage",
                desc: "End-to-end lifecycle management & ongoing compliance monitoring.",
                icon: <FaUsers />,
                step: "03",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-slate-800/50 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="absolute -top-6 -left-6 text-6xl font-black text-slate-800 select-none group-hover:text-slate-700 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 text-3xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 relative z-10 shadow-lg ring-1 ring-white/5">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-justify">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-full hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Launch Your Expansion</span>
              <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalCoverage;
