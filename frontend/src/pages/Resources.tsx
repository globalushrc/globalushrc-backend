import { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaNewspaper,
  FaHandshake,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import CurrencySuite from "../components/CurrencySuite";
import JobApplicationModal from "../components/JobApplicationModal";

const Resources = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [bankRates, setBankRates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [siteSettings, setSiteSettings] = useState<any>({
    company_reg: "#284915/078/079",
    pan_vat: "#610192845",
    dofe_license: "#1584/079/080",
    hero_images: [],
  });

  // Fetch News and Jobs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const url = getApiUrl();

        // Fetch News
        const newsRes = await fetch(`${url}/api/news`);
        if (newsRes.ok) {
          const data = await newsRes.json();
          data.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setNews(data);
        }

        // Fetch Jobs
        const jobsRes = await fetch(`${url}/api/admin/jobs`);
        if (jobsRes.ok) setJobs(await jobsRes.json());

        // Fetch Bank Rates
        const bankRes = await fetch(`${url}/api/bank-rates`);
        if (bankRes.ok) setBankRates(await bankRes.json());

        // Fetch Site Settings
        const settingsRes = await fetch(`${url}/api/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSiteSettings((prev: any) => ({
            ...prev,
            ...settingsData,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch page data", err);
      }
    };

    fetchAllData();
  }, []);

  const getApiUrl = () => {
    const hostname = window.location.hostname;
    return import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
  };

  const faqs = [
    {
      question: "What is an Employer of Record (EOR)?",
      answer:
        "An Employer of Record (EOR) is a service provider that legally employs individuals on behalf of another company. We handle payroll, taxes, benefits, and compliance, allowing you to focus on managing your global team without setting up a local entity.",
    },
    {
      question: "How long does the visa processing usually take?",
      answer:
        "Visa timelines vary significantly by country and visa type. Generally, work permits can take anywhere from 2 weeks to 4 months. We provide specific timelines and real-time tracking for each case.",
    },
    {
      question: "Which countries do you cover?",
      answer:
        "We provide comprehensive coverage in over 50+ countries across Europe (Schengen & UK), Asia Pacific, North America, and the Middle East (GCC). Check our 'Global Coverage' page for the full list.",
    },
    {
      question: "Are your services compliant with local labor laws?",
      answer:
        "Yes, 100%. Our core mission is ensuring compliance. We stay updated with local regulations, including GDPR in Europe, Fair Work Act in Australia, and Saudization in the Middle East.",
    },
    {
      question: "Can you help with local entity setup instead of EOR?",
      answer:
        "Absolutely. We offer 'Entity Management' services for clients who prefer to establish their own legal presence. We handle registration, bank account setup, and ongoing corporate secretarial support.",
    },
    {
      question: "What industries do you specialize in?",
      answer:
        "While we serve diverse sectors, we have deep expertise in Technology & SaaS, Finance, Healthcare, Manufacturing, and Logistics.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const heroImages =
    siteSettings.hero_images && siteSettings.hero_images.length > 0
      ? siteSettings.hero_images
      : [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
        ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section with Slider */}
      <div className="relative py-32 bg-slate-900 text-white overflow-hidden">
        {heroImages.map((img: string, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform ${
              index === currentImageIndex
                ? "opacity-60 scale-105"
                : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          ></div>
        ))}

        {/* Dynamic Watermark Logo - Re-animates on color change */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            key={currentImageIndex}
            className="w-80 h-80 opacity-10 animate-pulse-slow transition-all duration-[3000ms] scale-110"
            style={{
              backgroundImage: "url('/logo.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "brightness(200%) grayscale(100%)",
            }}
          ></div>
        </div>
        {/* Lighter Gradient for cleaner look */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentImageIndex
                  ? "bg-white w-8"
                  : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight animate-fade-in-up drop-shadow-lg">
            Resources & Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-100 drop-shadow-md">
            Expert knowledge to guide your global expansion and compliance
            strategy.
          </p>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
            {/* Articles Main Column */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-3 mb-8">
                <FaNewspaper className="text-3xl text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-800">
                  Latest Insights
                </h2>
              </div>

              <div className="grid gap-8 mb-16">
                {news.length === 0 ? (
                  // Fallback / Static Content if no news
                  <p className="text-gray-500 italic">
                    Loading updates or no news available...
                  </p>
                ) : (
                  news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row group"
                    >
                      <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto bg-slate-100 flex items-center justify-center">
                        {/* Placeholder Icon since we don't have thumbnail upload yet */}
                        <FaBriefcase className="text-6xl text-slate-300" />
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                            Update
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <div
                          className="text-gray-600 mb-4 leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></div>
                        <a
                          href={`${getApiUrl()}${item.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 hover:gap-2 inline-flex items-center transition-all"
                        >
                          View Document <span>&rarr;</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-16 mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <FaBriefcase className="text-3xl text-blue-600" />
                  <h2 className="text-3xl font-bold text-slate-800">
                    Global Job Bank
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {jobs.length === 0 ? (
                    <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500">
                        No current vacancies. Please check back later.
                      </p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job._id || job.id}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2">
                          <span className="truncate">{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="truncate text-slate-400">
                            {job.location}
                          </span>
                        </p>
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                        {job.requirements && (
                          <div className="mb-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              Requirements:
                            </p>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2">
                              {job.requirements}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <span className="text-xs font-bold text-slate-700">
                            {job.salary || "Competitive"}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedJob(job.title);
                              setIsApplyModalOpen(true);
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                          >
                            Apply Now &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <FaQuestionCircle className="text-3xl text-blue-600" />
                  <h2 className="text-3xl font-bold text-slate-800">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-slate-700">
                          {faq.question}
                        </span>
                        {openFaq === idx ? (
                          <FaChevronUp className="text-blue-600" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </button>
                      {openFaq === idx && (
                        <div className="p-6 pt-0 border-t border-gray-50 animate-fade-in">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Unified Currency Suite */}
              <div className="sticky top-24 space-y-8">
                <CurrencySuite />

                {/* Official Bank Rates */}
                {bankRates.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <FaMoneyBillWave className="text-6xl text-amber-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FaMoneyBillWave className="text-amber-600" /> Official
                      Forex Rates
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-50 pb-2">
                        <span>Currency</span>
                        <span className="text-center">Unit</span>
                        <span className="text-right">Buy</span>
                        <span className="text-right">Sell</span>
                      </div>
                      {bankRates.map((rate) => (
                        <div
                          key={rate.currency}
                          className="grid grid-cols-4 items-center py-2 border-b border-gray-50 last:border-0"
                        >
                          <span className="font-bold text-slate-700">
                            {rate.currency}
                          </span>
                          <span className="text-center text-xs text-slate-500">
                            {rate.unit}
                          </span>
                          <span className="text-right text-xs font-bold text-emerald-600">
                            {rate.buy}
                          </span>
                          <span className="text-right text-xs font-bold text-rose-600">
                            {rate.sell}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold italic mt-4">
                      * Rates pushed manually by bank administrator
                    </p>
                  </div>
                )}

                {/* Partners Widget */}
                <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaHandshake className="text-8xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">
                    Partner With Us
                  </h3>
                  <p className="text-blue-100 mb-6 relative z-10">
                    Join our vetted network of local legal and payroll experts
                    worldwide.
                  </p>

                  {/* Credentials Section */}
                  <div className="relative z-10 mb-6 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <FaShieldAlt className="text-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        Verified Consultancy
                      </span>
                    </div>
                    <div className="space-y-2 text-[11px] font-bold text-blue-50">
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="opacity-70">Company Reg:</span>
                        <span>{siteSettings.company_reg}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="opacity-70">PAN/VAT:</span>
                        <span>{siteSettings.pan_vat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">DOFE License:</span>
                        <span>{siteSettings.dofe_license}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="mailto:partners@globalushrc.com"
                    className="block w-full py-3 bg-white text-blue-900 font-bold rounded-xl text-center hover:bg-gray-100 transition-colors relative z-10"
                  >
                    Contact Partnerships
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJob}
      />
    </div>
  );
};

export default Resources;
