import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaTimes, FaPaperPlane } from "react-icons/fa";

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 22) setGreeting("Good Evening");
    else setGreeting("Hello");
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedFaq, isOpen]);

  const faqs = [
    {
      question: "Visa Consultant",
      answer:
        "We offer comprehensive global visa services. Would you like to speak with a specialist?",
      message: "Hello, I need help with a visa consulting inquiry.",
    },
    {
      question: "HR Strategy",
      answer:
        "Our team provides tailored HR solutions for global scale. Ready to discuss your strategy?",
      message: "Hello, I would like to know more about HR strategy services.",
    },
    {
      question: "Compliance Audit",
      answer:
        "We ensure your business meets international labor standards. Shall we schedule an audit?",
      message: "Hi, I need assistance with a global compliance audit.",
    },
    {
      question: "General Inquiry",
      answer:
        "Feel free to ask us anything! We're here to help you navigate global HR.",
      message: "Hello, I have a general question about your services.",
    },
  ];

  const phoneNumber = "447956903957";

  const handleFaqClick = (index: number) => {
    setSelectedFaq(index);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Bubble */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-72 md:w-85 bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100/50 animate-fade-in-up backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <p className="font-bold text-base">Support Assistant</p>
                <p className="text-[10px] text-emerald-100/80 uppercase tracking-widest font-semibold">
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Area */}
          <div
            ref={chatContainerRef}
            className="p-5 bg-gradient-to-b from-gray-50 to-white h-85 overflow-y-auto scroll-smooth custom-scrollbar"
          >
            {/* System Greeting */}
            <div className="flex gap-2 mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FaWhatsapp className="text-sm" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-emerald-50">
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  <span className="font-bold block mb-1">{greeting}! 👋</span>
                  How can we help you today with your global HR and mobility
                  needs?
                </p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] ml-1 mb-2">
                Frequently Asked
              </p>
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => handleFaqClick(index)}
                  className={`w-full text-left bg-white border ${
                    selectedFaq === index
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20"
                  } p-3 rounded-xl text-[13px] text-gray-600 transition-all flex items-center justify-between group`}
                >
                  <span
                    className={
                      selectedFaq === index
                        ? "text-emerald-700 font-medium"
                        : ""
                    }
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      selectedFaq === index
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-50 text-gray-300 group-hover:bg-emerald-100 group-hover:text-emerald-500"
                    }`}
                  >
                    <FaPaperPlane className="text-[8px]" />
                  </div>
                </button>
              ))}
            </div>

            {/* AI Response Preview */}
            {selectedFaq !== null && (
              <div className="mt-6 animate-fade-in">
                <div className="flex justify-end mb-4">
                  <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                    <p className="text-[13px]">{faqs[selectedFaq].question}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <FaWhatsapp className="text-sm" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-emerald-50">
                    <p className="text-[13px] text-gray-700 leading-relaxed italic">
                      {faqs[selectedFaq].answer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-white border-t border-gray-50">
            <a
              href={`https://wa.me/${phoneNumber}${selectedFaq !== null ? `?text=${encodeURIComponent(faqs[selectedFaq].message)}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-emerald-200 active:scale-[0.98] group"
            >
              <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
              <span>
                {selectedFaq !== null
                  ? "Message on WhatsApp"
                  : "Chat with us Now"}
              </span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-90 relative ${
            isOpen
              ? "bg-slate-800 rotate-90 text-white"
              : "bg-emerald-500 text-white ring-4 ring-emerald-500/20 hover-glow-whatsapp"
          }`}
        >
          {/* Ripple Wave Effect Layers */}
          {!isOpen && (
            <>
              <div className="ripple-ring ripple-ring-1 text-emerald-500"></div>
            </>
          )}

          {/* Continuous Glowing Effect Core */}
          {!isOpen && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-400 animate-pulse opacity-20 rounded-full"></div>
          )}

          {isOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <>
              <FaWhatsapp className="text-3xl relative z-10" />
              {/* Extra Sparkle/Glow Layer */}
              <div className="absolute inset-0 animate-ping bg-emerald-400 opacity-20 rounded-full scale-75"></div>
            </>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-22 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl border border-white/10 translate-x-4 group-hover:translate-x-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Ask anything
            </div>
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-t border-white/10"></div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppWidget;
