import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      // Get location from IP address (no permission required)
      let location = null;
      try {
        const ipResponse = await fetch("https://ipapi.co/json/", {
          method: "GET",
        });
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          location = {
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            city: ipData.city,
            region: ipData.region,
            country: ipData.country_name,
            ip: ipData.ip,
          };
        }
      } catch (geoError) {
        console.log("IP geolocation not available:", geoError);
        // Continue without location if it fails
      }

      // Use FormData to handle both text and file
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("subject", formData.subject);
      data.append("message", formData.message);
      if (location) {
        data.append("location", JSON.stringify(location));
      }
      if (file) {
        data.append("document", file);
      }

      console.log(`Submitting to: ${apiUrl}/api/contact`);

      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        body: data,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok) {
          alert("Success! Your message and document have been received.");
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setFile(null);
          // @ts-ignore
          document.getElementById("document").value = "";
        } else {
          alert(`Server Error: ${result.error || "Unknown error"}`);
        }
      } else {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`,
        );
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(
        `Connection Issue!\n\nError: ${error.message}\n\nPlease ensure your backend is running at http://127.0.0.1:5001`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative z-10 space-y-2 mb-8">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Send Message
          </span>
        </div>
        <h3 className="text-3xl font-black text-slate-900">
          Get Started Today
        </h3>
        <p className="text-gray-600 text-sm">
          Fill out the form below and we'll get back to you shortly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              required
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <PhoneInput
            country={"np"}
            value={formData.phone}
            onChange={(phone) =>
              setFormData({ ...formData, phone: "+" + phone })
            }
            inputProps={{
              name: "phone",
              id: "phone",
            }}
            containerClass="!w-full !font-sans"
            inputClass="!w-full !px-4 !py-3 !pl-14 !h-[48px] !rounded-xl !border !border-gray-200 !focus:border-blue-500 !focus:ring-4 !focus:ring-blue-500/10 !outline-none !transition-all !bg-white !text-base"
            buttonClass="!border !border-gray-200 !border-r-0 !bg-gray-50/50 !rounded-l-xl !px-3"
            dropdownClass="!rounded-xl !shadow-2xl !border-gray-100 !mt-2"
            placeholder="+977 98XXXXXXX"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Inquiry Type
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white cursor-pointer"
            required
          >
            <option value="">Select a subject...</option>
            <option value="Global HR Strategy">Global HR Strategy</option>
            <option value="Compliance Advisory">Compliance Advisory</option>
            <option value="Visa & Mobility">Visa & Mobility</option>
            <option value="Employer of Record (EOR)">
              Employer of Record (EOR)
            </option>
            <option value="Talent Management">Talent Management</option>
            <option value="Partnership Inquiry">Partnership Inquiry</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="document"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Attach Document (Optional)
          </label>
          <div className="relative group">
            <input
              type="file"
              id="document"
              name="document"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Support for PDF, DOCX, and Images (Max 10MB)
          </p>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            required
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:shadow-blue-500/50"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className="text-lg">Send Message</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="Arrow-Right"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
