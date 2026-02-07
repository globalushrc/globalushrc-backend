import { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaNewspaper,
  FaHandshake,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import CurrencyConverter from "../components/CurrencyConverter";
import MarketRates from "../components/MarketRates";

const Resources = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [bankRates, setBankRates] = useState<any[]>([]);

  // Fetch News from Backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
        const res = await fetch(`${apiUrl}/api/news`);
        if (res.ok) {
          const data = await res.json();
          // Sort by date desc
          data.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setNews(data);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };
    fetchNews();

    const fetchBankRates = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/bank-rates`);
        if (res.ok) setBankRates(await res.json());
      } catch (err) {
        console.error("Bank rates error", err);
      }
    };
    fetchBankRates();
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

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/1542744173-8e7e53415bb0.jpg')] bg-cover bg-center opacity-20 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Resources & Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
              {/* Live Market Rates */}
              <MarketRates />

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

              {/* Live Currency Exchanger */}
              <CurrencyConverter />

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
                <a
                  href="mailto:partners@globalushrc.com"
                  className="block w-full py-3 bg-white text-blue-900 font-bold rounded-xl text-center hover:bg-gray-100 transition-colors relative z-10"
                >
                  Apply to Partner
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
