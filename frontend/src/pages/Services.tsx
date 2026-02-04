import {
  FaChessBoard,
  FaGavel,
  FaFileAlt,
  FaUserTie,
  FaPlaneDeparture,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      id: "strategy",
      title: "HR Strategy & Advisory",
      icon: <FaChessBoard />,
      description: "Align your workforce strategy with your business goals.",
      image: "/assets/images/1552664730-d307ca884978.jpg",
      details: [
        "Global HR Roadmap Development",
        "Strategic Workforce Planning & Analysis",
        "Organizational Design & Hybrid Structure",
        "HR Maturity & Capability Assessments",
        "Mergers & Acquisitions HR Support",
        "Change Management & Culture Transformation",
      ],
    },
    {
      id: "compliance",
      title: "Global HR Compliance",
      icon: <FaGavel />,
      description: "Navigate the complex web of international labor laws.",
      image: "/assets/images/1589829085413-56de8ae18c73.jpg",
      details: [
        "Country-specific Labor Law Advisory",
        "Employment Frameworks & Statutory Compliance",
        "Payroll, Tax & Benefits Compliance Audits",
        "Termination, Redundancy & Risk Management",
        "Data Privacy (GDPR/CCPA) for Global HR",
        "Statutory Reporting & Disclosure Support",
      ],
    },
    {
      id: "documentation",
      title: "HR Policies & Documentation",
      icon: <FaFileAlt />,
      description: "Robust frameworks for clear and consistent operations.",
      image: "/assets/images/1450101499163-c8848c66ca85.jpg",
      details: [
        "Tailored Employee Handbooks (Global & Local)",
        "Standard Operating Procedures (SOPs)",
        "Code of Conduct & Professional Ethics",
        "Remote Work, Leave & Disciplinary Policies",
        "Anti-Discrimination & Workplace Safety (HSE)",
        "Contract Templates & NDAs (Legal Aligned)",
      ],
    },
    {
      id: "talent",
      title: "Talent Management",
      icon: <FaUserTie />,
      description: "Attract, develop, and retain top global talent.",
      image: "/assets/images/1521737604893-d14cc237f11d.jpg",
      details: [
        "Global Recruitment & Hiring Frameworks",
        "Onboarding & Integration Systems",
        "Performance Management & OKR Goal Setting",
        "Competency Mapping & Skill GAP Analysis",
        "Employee Engagement & Retention Programs",
        "Succession Planning for Key Leadership",
      ],
    },
    {
      id: "visa",
      title: "Global Mobility & Visa Assistance",
      icon: <FaPlaneDeparture />,
      description:
        "End-to-end support for all visa types and relocation needs.",
      image: "/assets/images/1530789253388-582c481c54b0.jpg",
      details: [
        "Work Permits & Skilled Worker Visas (Global)",
        "Business, Visitor & Temporary Assignment Visas",
        "Dependent Visas & Family Relocation Support",
        "Student & Vocational Training Visas",
        "Permanent Residency & Citizenship Guidance",
        "Relocation Coordination & Post-Landing Support",
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/1454165804606-c3d57bc86b40.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Our Services
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive HR consulting solutions tailored for the modern,
            distributed enterprise.
          </p>
        </div>
      </div>

      <div className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:gap-16 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col md:flex-row gap-0 bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Image Section */}
                <div className="md:w-1/2 relative min-h-[300px] overflow-hidden">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 text-2xl md:text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="grid grid-cols-1 gap-3 mb-8">
                    {service.details.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all duration-300 group-hover:text-blue-700"
                    >
                      Request this service <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer for Services */}
      <div className="bg-slate-900 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/1522071820081-009f0129c71c.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Every organization is unique. Contact us to discuss a tailored
            engagement model that fits your specific requirements.
          </p>
          <Link
            to="/contact"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-600/30"
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
