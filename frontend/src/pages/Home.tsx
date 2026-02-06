import Hero from "../components/Hero";
import NoticeBoard from "../components/NoticeBoard";
import Country3DCard from "../components/Country3DCard";
import { countries } from "../data/countries";
import { Link } from "react-router-dom";
import ConsultantSection from "../components/ConsultantSection";
import { useState, useEffect } from "react";
import {
  FaNewspaper,
  FaChartLine,
  FaGavel,
  FaFileContract,
  FaUsers,
  FaPassport,
} from "react-icons/fa";

const Home = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
        const res = await fetch(`${apiUrl}/api/news`);
        if (res.ok) {
          const data = await res.json();
          // Sort recent first
          data.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setNews(data.slice(0, 3)); // Only latest 3
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };
    fetchNews();
  }, []);

  const getApiUrl = () => {
    const hostname = window.location.hostname;
    return import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
  };

  return (
    <div>
      <NoticeBoard />
      <Hero />

      {/* Services Snapshot */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Comprehensive HR Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From strategy to compliance, we support every aspect of your
              global workforce management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 max-w-[1400px] mx-auto">
            {[
              {
                title: "HR Strategy & Advisory",
                desc: "Roadmaps for global expansion and transformation.",
                icon: FaChartLine,
                color: "blue",
              },
              {
                title: "Compliance Guidance",
                desc: "Navigating complex local labor laws and regulations.",
                icon: FaGavel,
                color: "emerald",
              },
              {
                title: "HR Documentation",
                desc: "Custom handbooks, contracts, and policy frameworks.",
                icon: FaFileContract,
                color: "purple",
              },
              {
                title: "Talent Management",
                desc: "Strategic hiring, retention, and performance systems.",
                icon: FaUsers,
                color: "orange",
              },
              {
                title: "Visa & Mobility",
                desc: "Seamless work permits and international relocation.",
                icon: FaPassport,
                color: "teal",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(30,58,138,0.1)] transition-all duration-500 border border-slate-100 flex flex-col hover:-translate-y-4 group cursor-pointer relative"
              >
                {/* Decorative Icon Hook */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-blue-500/20`}
                >
                  <service.icon className="text-3xl text-blue-600 group-hover:text-white transition-all duration-500" />
                </div>

                <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors leading-tight min-h-[3rem]">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                  {service.desc}
                </p>

                <Link
                  to="/services"
                  className="inline-flex items-center text-blue-600 text-sm font-extrabold gap-2 group/link tracking-wide"
                >
                  LEARN MORE
                  <span className="transform group-hover/link:translate-x-1.5 transition-transform duration-300">
                    &rarr;
                  </span>
                </Link>

                {/* Subtle Progress Indicator */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-700 group-hover:w-full opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage - 3D Cards */}
      <section className="py-24 relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/global_map_v2.jpg')] bg-cover bg-center fixed-bg opacity-30"></div>
        <div className="absolute inset-0 bg-slate-900/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Global Coverage
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Expertise across key international markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {countries.map((country) => (
              <Country3DCard key={country.name} {...country} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/global-coverage"
              className="px-8 py-3 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Full Coverage Map
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/quality_bg_v2.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-slate-900/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Why Choose Global US HRC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                id: "01",
                title: "Global Expertise",
                desc: "Deep understanding of international labor laws and cultural nuances.",
              },
              {
                id: "02",
                title: "Tailored Strategies",
                desc: "Customized HR solutions that align with your business goals.",
              },
              {
                id: "03",
                title: "Ethical Practice",
                desc: "Commitment to integrity, confidentiality, and professional standards.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-2xl hover:bg-white/10 transition-all duration-500 group hover:-translate-y-2"
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white text-2xl font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                  {item.id}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white text-center group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Visa Consultant Section */}
      <ConsultantSection />

      {/* Latest News Section */}
      {news.length > 0 && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight flex items-center justify-center gap-3">
                <FaNewspaper className="text-blue-600" />
                Latest Updates & Insights
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Stay informed with our latest announcements and compliance
                updates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-t-4 border-gray-100 border-t-blue-600 group hover:-translate-y-2 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      Update
                    </span>
                    <span className="text-slate-400 text-xs font-bold">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div
                    className="text-gray-500 mb-6 line-clamp-3 text-sm flex-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>
                  <a
                    href={`${getApiUrl()}${item.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto w-full py-3 bg-gray-50 text-slate-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all text-center text-sm shadow-sm"
                  >
                    View Document
                  </a>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/resources"
                className="font-bold text-slate-500 hover:text-blue-600 text-sm tracking-wide uppercase transition-colors"
              >
                View All News &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 relative text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/quality_bg_v2.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-blue-900/90 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Global Workforce?
          </h2>
          <Link
            to="/contact"
            className="px-10 py-5 bg-white text-blue-900 font-bold rounded-full shadow-xl hover:shadow-blue-400/50 transition-all transform hover:scale-110 hover:-translate-y-2 inline-block"
          >
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
